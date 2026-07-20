export type TranscriptionMode = 'webspeech' | 'deepgram';

function getSupportedMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
  for (const t of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) return t;
  }
  return 'audio/webm';
}

export function startDeepgramTranscription(
  onSegment: (text: string) => void,
  onWarning?: (msg: string) => void,
  onActivity?: (active: boolean) => void,
): () => void {
  let stopped = false;
  let stream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  let cycleTimeout: ReturnType<typeof setTimeout> | null = null;
  let audioContext: AudioContext | null = null;
  let rawStreams: MediaStream[] = [];
  let watchTrack: MediaStreamTrack | null = null;

  // ponytail: mixes display (Zoom) audio + mic via Web Audio API rather than a
  // real-time audio worklet — fine at this scale (single 2-source mix, no processing)
  async function getStream(): Promise<MediaStream> {
    let displayStream: MediaStream | null = null;
    try {
      displayStream = await navigator.mediaDevices.getDisplayMedia({
        audio: { echoCancellation: false, noiseSuppression: false, sampleRate: 16000 } as MediaTrackConstraints,
        video: true,
      });
      displayStream.getVideoTracks().forEach(t => t.stop());
    } catch {
      displayStream = null;
    }

    if (!displayStream || displayStream.getAudioTracks().length === 0) {
      onWarning?.('No system audio captured — pick a Chrome Tab with "Share audio" checked, not a Window. Using mic only.');
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
      rawStreams = [mic];
      watchTrack = mic.getAudioTracks()[0] ?? null;
      return mic;
    }

    rawStreams = [displayStream];
    watchTrack = displayStream.getAudioTracks()[0];

    let micStream: MediaStream;
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      rawStreams.push(micStream);
    } catch {
      return displayStream;
    }

    audioContext = new AudioContext();
    const dest = audioContext.createMediaStreamDestination();
    audioContext.createMediaStreamSource(displayStream).connect(dest);
    audioContext.createMediaStreamSource(micStream).connect(dest);
    return dest.stream;
  }

  function runCycle() {
    if (stopped || !stream) return;

    const mimeType = getSupportedMimeType();
    const chunks: Blob[] = [];

    try {
      recorder = new MediaRecorder(stream, { mimeType });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      if (stopped || chunks.length === 0) return;

      const blob = new Blob(chunks, { type: mimeType });
      onActivity?.(true);

      try {
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': mimeType },
          body: blob,
        });

        if (res.ok) {
          const data = await res.json();
          const text: string = data.text?.trim() ?? '';
          if (text.length > 0) onSegment(text);
        } else {
          const data = await res.json().catch(() => ({}));
          if (data.errorCode === 'no_api_key') {
            onWarning?.('DEEPGRAM_API_KEY is not set in Vercel. Add it in Vercel → Settings → Environment Variables, then redeploy.');
          }
        }
      } catch {}

      onActivity?.(false);
      if (!stopped) runCycle();
    };

    recorder.start();

    cycleTimeout = setTimeout(() => {
      if (recorder && recorder.state === 'recording') {
        recorder.stop();
      }
    }, 4000);
  }

  getStream().then((s) => {
    stream = s;
    watchTrack?.addEventListener('ended', () => {
      stopped = true;
      if (cycleTimeout) clearTimeout(cycleTimeout);
      onActivity?.(false);
    });
    runCycle();
  }).catch(() => {});

  return () => {
    stopped = true;
    if (cycleTimeout) clearTimeout(cycleTimeout);
    if (recorder && recorder.state === 'recording') {
      recorder.onstop = null;
      recorder.stop();
    }
    stream?.getTracks().forEach(t => t.stop());
    rawStreams.forEach(s => s.getTracks().forEach(t => t.stop()));
    audioContext?.close();
    onActivity?.(false);
  };
}
