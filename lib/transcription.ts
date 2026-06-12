export function startTranscription(
  onSegment: (text: string) => void,
  onInterim?: (text: string) => void,
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Web Speech API not supported in this browser');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        onSegment(transcript.trim());
      } else {
        interim += transcript;
      }
    }
    if (onInterim) onInterim(interim.trim());
  };

  recognition.onerror = (event: any) => {
    if (event.error !== 'no-speech') {
      console.error('Speech recognition error:', event.error);
    }
  };

  recognition.onend = () => {
    // Auto-restart to keep continuous transcription going
    try {
      recognition.start();
    } catch {}
  };

  recognition.start();
  return () => {
    recognition.onend = null;
    recognition.stop();
  };
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}
