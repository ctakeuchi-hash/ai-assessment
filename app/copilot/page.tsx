'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TranscriptPane } from '@/components/copilot/TranscriptPane';
import { SuggestionCard } from '@/components/copilot/SuggestionCard';
import { MicButton } from '@/components/copilot/MicButton';
import { ContextPanel } from '@/components/copilot/ContextPanel';
import { MeetingSummary } from '@/components/copilot/MeetingSummary';
import { startTranscription, isSpeechRecognitionSupported } from '@/lib/transcription';
import { getCopilotSuggestions, getMeetingSummary } from '@/lib/anthropic';
import type { TranscriptSegment, CopilotSuggestion, CopilotContext } from '@/types';
import type { MeetingSummary as SummaryType } from '@/lib/anthropic';

const DEFAULT_CONTEXT: CopilotContext = { systemPrompt: '', knowledgeBase: '' };
const STORAGE_KEY = 'copilot-context';
const MAX_SUGGESTIONS = 5;
const SUMMARY_EVERY_N_SEGMENTS = 8; // summarize after every 8 new segments

type RightTab = 'suggestions' | 'summary';
type LeftTab = 'transcript' | 'context';

export default function CopilotPage() {
  const router = useRouter();

  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => typeof window !== 'undefined' && isSpeechRecognitionSupported());

  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const [context, setContext] = useState<CopilotContext>(DEFAULT_CONTEXT);
  const [leftTab, setLeftTab] = useState<LeftTab>('transcript');
  const [rightTab, setRightTab] = useState<RightTab>('suggestions');

  const stopFnRef = useRef<(() => void) | null>(null);
  const suggestionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullTranscriptRef = useRef('');
  const lastSummarizedAtRef = useRef(0); // segment count when last summarized

  // Load context from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setContext(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist context
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    } catch {}
  }, [context]);

  const triggerSummary = useCallback(async (transcript: string) => {
    if (summarizing || transcript.trim().length < 80) return;
    setSummarizing(true);
    try {
      const s = await getMeetingSummary(transcript);
      setSummary(s);
    } catch {}
    setSummarizing(false);
  }, [summarizing]);

  const handleSegment = useCallback((text: string) => {
    const segment: TranscriptSegment = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      timestamp: Date.now(),
    };

    setSegments(prev => {
      const next = [...prev, segment];

      // Check if we should trigger summary
      if (next.length - lastSummarizedAtRef.current >= SUMMARY_EVERY_N_SEGMENTS) {
        lastSummarizedAtRef.current = next.length;
        const full = next.map(s => s.text).join(' ');
        triggerSummary(full);
      }

      return next;
    });

    fullTranscriptRef.current += ' ' + text;

    // Debounce Claude suggestion call 4s
    if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
    suggestionDebounceRef.current = setTimeout(async () => {
      try {
        const newSuggestions = await getCopilotSuggestions(fullTranscriptRef.current, context);
        if (newSuggestions.length > 0) {
          setSuggestions(prev => [...newSuggestions, ...prev].slice(0, MAX_SUGGESTIONS));
        }
      } catch {}
    }, 4000);
  }, [context, triggerSummary]);

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
    setSummary(null);
    fullTranscriptRef.current = '';
    lastSummarizedAtRef.current = 0;
  };

  const handleSendToWorkflow = (detail: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('workflow-prefill', detail);
    }
    router.push('/workflow');
  };

  const tabStyle = (active: boolean) => ({
    fontFamily: "'DM Mono', monospace",
    fontSize: '0.6rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: active ? '#ddd8cc' : '#3a4a60',
    background: 'none',
    border: 'none',
    borderBottom: `2px solid ${active ? '#38d4a0' : 'transparent'}`,
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#08090f', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1c2030' }}>

        {/* Top toolbar */}
        <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 }}>
          <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a4a60', textDecoration: 'none', flexShrink: 0 }}>
            ← Back
          </a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38d4a0', flex: 1 }}>
            Meeting Copilot
          </span>
          <MicButton recording={recording} supported={supported} onToggle={toggleRecording} />
        </div>

        {/* Browser warning */}
        {!supported && (
          <div style={{ background: '#180e02', borderBottom: '1px solid #3a2808', color: '#e8a020', fontSize: '0.78rem', padding: '0.5rem 1.25rem', flexShrink: 0 }}>
            Requires Chrome or Edge for Web Speech API.
          </div>
        )}

        {/* Left tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1c2030', padding: '0 0.5rem', flexShrink: 0 }}>
          <button style={tabStyle(leftTab === 'transcript')} onClick={() => setLeftTab('transcript')}>
            Transcript {segments.length > 0 && `(${segments.length})`}
          </button>
          <button style={tabStyle(leftTab === 'context')} onClick={() => setLeftTab('context')}>
            Context
          </button>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {leftTab === 'context' ? (
            <ContextPanel context={context} onChange={setContext} />
          ) : (
            <TranscriptPane segments={segments} onReset={handleReset} />
          )}
        </div>

      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Right tabs */}
        <div style={{ padding: '0 0.5rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex' }}>
            <button style={tabStyle(rightTab === 'suggestions')} onClick={() => setRightTab('suggestions')}>
              Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
            </button>
            <button style={tabStyle(rightTab === 'summary')} onClick={() => setRightTab('summary')}>
              Summary {summarizing && '…'}
            </button>
          </div>

          {rightTab === 'suggestions' && suggestions.length > 0 && (
            <button
              onClick={() => setSuggestions([])}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#3a4a60', textTransform: 'uppercase', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: 'pointer', marginRight: '0.5rem' }}
            >
              Clear
            </button>
          )}

          {rightTab === 'summary' && segments.length >= 4 && (
            <button
              onClick={() => triggerSummary(segments.map(s => s.text).join(' '))}
              disabled={summarizing}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: summarizing ? '#3a4a60' : '#38d4a0', textTransform: 'uppercase', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: summarizing ? 'not-allowed' : 'pointer', marginRight: '0.5rem' }}
            >
              {summarizing ? 'Updating…' : 'Refresh'}
            </button>
          )}
        </div>

        {/* Right content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {rightTab === 'suggestions' ? (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suggestions.length === 0 ? (
                <div style={{ color: '#2a3040', fontSize: '0.82rem', fontFamily: "'DM Mono', monospace", textAlign: 'center', marginTop: '3rem' }}>
                  {recording
                    ? 'Listening… suggestions appear as the conversation progresses'
                    : 'Start recording to receive real-time suggestions'}
                </div>
              ) : (
                suggestions.map(s => (
                  <SuggestionCard key={s.id} suggestion={s} onSendToWorkflow={handleSendToWorkflow} />
                ))
              )}
            </div>
          ) : (
            <MeetingSummary
              summary={summary}
              summarizing={summarizing}
              segmentCount={segments.length}
            />
          )}
        </div>

        {/* Mac audio hint */}
        <div style={{ padding: '0.6rem 1.25rem', borderTop: '1px solid #1c2030', flexShrink: 0 }}>
          <p style={{ fontSize: '0.7rem', color: '#2a3040', lineHeight: 1.5, margin: 0 }}>
            <strong style={{ color: '#3a4a60' }}>Mac audio:</strong> BlackHole → Multi-Output Device (BlackHole + speakers) → Zoom output → browser mic input to BlackHole.
          </p>
        </div>
      </div>

    </div>
  );
}
