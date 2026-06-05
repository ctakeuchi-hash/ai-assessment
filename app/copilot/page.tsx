'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TranscriptPane } from '@/components/copilot/TranscriptPane';
import { SuggestionCard } from '@/components/copilot/SuggestionCard';
import { MicButton } from '@/components/copilot/MicButton';
import { ContextPanel } from '@/components/copilot/ContextPanel';
import { startTranscription, isSpeechRecognitionSupported } from '@/lib/transcription';
import { getCopilotSuggestions } from '@/lib/anthropic';
import type { TranscriptSegment, CopilotSuggestion, CopilotContext } from '@/types';

const DEFAULT_CONTEXT: CopilotContext = {
  systemPrompt: '',
  knowledgeBase: '',
};

const STORAGE_KEY = 'copilot-context';
const MAX_SUGGESTIONS = 5;

export default function CopilotPage() {
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => typeof window !== 'undefined' && isSpeechRecognitionSupported());
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [context, setContext] = useState<CopilotContext>(DEFAULT_CONTEXT);
  const [showContext, setShowContext] = useState(false);

  const stopFnRef = useRef<(() => void) | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullTranscriptRef = useRef('');

  // Load context from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContext(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist context to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    } catch {}
  }, [context]);

  const handleSegment = useCallback((text: string) => {
    const segment: TranscriptSegment = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      timestamp: Date.now(),
    };

    setSegments(prev => [...prev, segment]);
    fullTranscriptRef.current += ' ' + text;

    // Debounce Claude API call by 4s
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const newSuggestions = await getCopilotSuggestions(fullTranscriptRef.current, context);
        if (newSuggestions.length > 0) {
          setSuggestions(prev => {
            const combined = [...newSuggestions, ...prev];
            return combined.slice(0, MAX_SUGGESTIONS);
          });
        }
      } catch {}
    }, 4000);
  }, [context]);

  const toggleRecording = useCallback(() => {
    if (recording) {
      stopFnRef.current?.();
      stopFnRef.current = null;
      setRecording(false);
    } else {
      const stop = startTranscription(handleSegment);
      stopFnRef.current = stop;
      setRecording(true);
    }
  }, [recording, handleSegment]);

  const handleReset = () => {
    stopFnRef.current?.();
    stopFnRef.current = null;
    setRecording(false);
    setSegments([]);
    setSuggestions([]);
    fullTranscriptRef.current = '';
  };

  const handleSendToWorkflow = (detail: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('workflow-prefill', detail);
    }
    router.push('/workflow');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#08090f', fontFamily: "'Outfit', sans-serif" }}>

      {/* Left: Transcript + context toggle */}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1c2030' }}>

        {/* Toolbar */}
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a4a60', textDecoration: 'none' }}>
            ← Back
          </a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38d4a0', flex: 1 }}>
            Meeting Copilot
          </span>
          <MicButton recording={recording} supported={supported} onToggle={toggleRecording} />
          <button
            onClick={() => setShowContext(p => !p)}
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: showContext ? '#4a9eff' : '#3a4a60', background: 'none', border: '1px solid #1c2030', padding: '0.35rem 0.65rem', cursor: 'pointer' }}
          >
            {showContext ? 'Transcript' : 'Context'}
          </button>
        </div>

        {!supported && (
          <div style={{ background: '#180e02', borderBottom: '1px solid #3a2808', color: '#e8a020', fontSize: '0.78rem', padding: '0.6rem 1.25rem' }}>
            Web Speech API requires Chrome or Edge. Not supported in this browser.
          </div>
        )}

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {showContext ? (
            <ContextPanel context={context} onChange={setContext} />
          ) : (
            <TranscriptPane segments={segments} onReset={handleReset} />
          )}
        </div>
      </div>

      {/* Right: Suggestions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#58647a' }}>
            AI Suggestions
          </span>
          {suggestions.length > 0 && (
            <button
              onClick={() => setSuggestions([])}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#3a4a60', textTransform: 'uppercase', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {suggestions.length === 0 ? (
            <div style={{ color: '#2a3040', fontSize: '0.82rem', fontFamily: "'DM Mono', monospace", textAlign: 'center', marginTop: '3rem' }}>
              {recording
                ? 'Listening… suggestions will appear as the conversation progresses'
                : 'Start recording to receive real-time suggestions'}
            </div>
          ) : (
            suggestions.map(s => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                onSendToWorkflow={handleSendToWorkflow}
              />
            ))
          )}
        </div>

        {/* Mac audio setup hint */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid #1c2030' }}>
          <p style={{ fontSize: '0.72rem', color: '#2a3040', lineHeight: 1.6 }}>
            <strong style={{ color: '#3a4a60' }}>Mac audio setup:</strong> Install BlackHole → create Multi-Output Device (BlackHole + speakers) → set Zoom output to that device → set browser mic to BlackHole.
          </p>
        </div>
      </div>

    </div>
  );
}
