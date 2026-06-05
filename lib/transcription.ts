export function startTranscription(onSegment: (text: string) => void): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Web Speech API not supported in this browser');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const text = event.results[event.results.length - 1][0].transcript;
    onSegment(text);
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
