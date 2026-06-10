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
): () => void {
  let stopped = false;
  let stream: MediaStream | null = null;
  let recorder: MediaRecorder | null = null;
  let cycleTimeout: ReturnType<typeof setTimeout> | null = null;

  async function getStream(): Promise<MediaStream> {
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({
        audio: { echoCancellation: false, noiseSuppression: false, sampleRate: 16000 } as MediaTrackConstraints,
        video: true, // required by some browsers; video track is stopped immediately
      });
      s.getVideoTracks().forEach(t => t.stop());

      // Warn if the browser gave us no audio tracks (e.g. user picked a Window instead of a Tab)
      if (s.getAudioTracks().length === 0) {
        onWarning?.('No audio captured — the browser only provides audio for browser tabs (pick "Chrome Tab" and check "Share audio"), or for full screen on Windows. Falling back to mic.');
        return navigator.mediaDevices.getUserMedia({ audio: true });
      }

      return s;
    } catch {
      // User cancelled or getDisplayMedia not supported — fall back to mic
      return navigator.mediaDevices.getUserMedia({ audio: true });
    }
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
        }
      } catch {}

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
    s.getAudioTracks()[0]?.addEventListener('ended', () => {
      stopped = true;
      if (cycleTimeout) clearTimeout(cycleTimeout);
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
  };
}
