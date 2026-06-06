'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TranscriptPane } from '@/components/copilot/TranscriptPane';
import { SuggestionCard } from '@/components/copilot/SuggestionCard';
import { MicButton } from '@/components/copilot/MicButton';
import { ContextPanel } from '@/components/copilot/ContextPanel';
import { MeetingSummary } from '@/components/copilot/MeetingSummary';
import { ClientBrief } from '@/components/copilot/ClientBrief';
import { startTranscription, isSpeechRecognitionSupported } from '@/lib/transcription';
import { getCopilotSuggestions, getMeetingSummary, extractCurrentState } from '@/lib/anthropic';
import { createSession, endSession, saveSegment, saveSuggestions, updateSessionSummary, updateSessionStateMap } from '@/lib/session';
import type { TranscriptSegment, CopilotSuggestion, CopilotContext, CurrentStateMap } from '@/types';
import type { MeetingSummary as SummaryType } from '@/lib/anthropic';

const DEFAULT_CONTEXT: CopilotContext = { systemPrompt: '', knowledgeBase: '' };
const STORAGE_KEY = 'copilot-context';
const MAX_SUGGESTIONS = 5;
const SUMMARY_EVERY_N = 8;
const STATE_EVERY_N = 15;

type RightTab = 'suggestions' | 'brief' | 'summary';
type LeftTab = 'transcript' | 'context';
type Temperature = 'Cold' | 'Warm' | 'Hot';

function computeTemperature(suggestions: CopilotSuggestion[]): Temperature {
  let score = 0;
  for (const s of suggestions) {
    if (s.type === 'closing') score += 3;
    else if (s.type === 'solution' && s.confidence === 'high') score += 1;
    else if (s.type === 'question' && s.confidence === 'high') score += 0.5;
    else if (s.type === 'warning') score -= 2;
  }
  if (score >= 5) return 'Hot';
  if (score >= 2) return 'Warm';
  return 'Cold';
}

const TEMP_STYLE: Record<Temperature, { color: string; bg: string; dot: string }> = {
  Cold: { color: '#4a9eff', bg: '#020810', dot: '#4a9eff' },
  Warm: { color: '#e8a020', bg: '#180e02', dot: '#e8a020' },
  Hot:  { color: '#38d4a0', bg: '#021008', dot: '#38d4a0' },
};

export default function CopilotPage() {
  const router = useRouter();

  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => typeof window !== 'undefined' && isSpeechRecognitionSupported());

  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [suggestions, setSuggestions] = useState<CopilotSuggestion[]>([]);
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [currentStateMap, setCurrentStateMap] = useState<CurrentStateMap | null>(null);
  const [extractingState, setExtractingState] = useState(false);
  const [briefHasNewData, setBriefHasNewData] = useState(false);

  const [context, setContext] = useState<CopilotContext>(DEFAULT_CONTEXT);
  const [leftTab, setLeftTab] = useState<LeftTab>('transcript');
  const [rightTab, setRightTab] = useState<RightTab>('suggestions');

  const stopFnRef = useRef<(() => void) | null>(null);
  const suggestionDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullTranscriptRef = useRef('');
  const lastSummarizedAtRef = useRef(0);
  const lastExtractedAtRef = useRef(0);
  const sessionIdRef = useRef<string | null>(null);
  const summaryRef = useRef<SummaryType | null>(null);
  const currentStateMapRef = useRef<CurrentStateMap | null>(null);

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

  // Keep refs in sync for use in cleanup
  useEffect(() => { summaryRef.current = summary; }, [summary]);
  useEffect(() => { currentStateMapRef.current = currentStateMap; }, [currentStateMap]);

  const triggerSummary = useCallback(async (transcript: string) => {
    if (summarizing || transcript.trim().length < 80) return;
    setSummarizing(true);
    try {
      const s = await getMeetingSummary(transcript);
      setSummary(s);
      if (sessionIdRef.current) await updateSessionSummary(sessionIdRef.current, s);
    } catch {}
    setSummarizing(false);
  }, [summarizing]);

  const triggerStateExtraction = useCallback(async (transcript: string) => {
    if (extractingState) return;
    setExtractingState(true);
    try {
      const map = await extractCurrentState(transcript);
      setCurrentStateMap(map);
      setBriefHasNewData(true);
      if (sessionIdRef.current) await updateSessionStateMap(sessionIdRef.current, map);
    } catch {}
    setExtractingState(false);
  }, [extractingState]);

  const handleSegment = useCallback((text: string) => {
    const segment: TranscriptSegment = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      timestamp: Date.now(),
    };

    if (sessionIdRef.current) saveSegment(sessionIdRef.current, segment);

    setSegments(prev => {
      const next = [...prev, segment];
      const full = next.map(s => s.text).join(' ');

      if (next.length - lastSummarizedAtRef.current >= SUMMARY_EVERY_N) {
        lastSummarizedAtRef.current = next.length;
        triggerSummary(full);
      }

      if (next.length - lastExtractedAtRef.current >= STATE_EVERY_N) {
        lastExtractedAtRef.current = next.length;
        triggerStateExtraction(full);
      }

      return next;
    });

    fullTranscriptRef.current += ' ' + text;

    // Debounce suggestion call 4s
    if (suggestionDebounceRef.current) clearTimeout(suggestionDebounceRef.current);
    suggestionDebounceRef.current = setTimeout(async () => {
      try {
        const newSuggestions = await getCopilotSuggestions(fullTranscriptRef.current, context);
        if (newSuggestions.length > 0) {
          setSuggestions(prev => {
            const merged = [...newSuggestions, ...prev].slice(0, MAX_SUGGESTIONS);
            if (sessionIdRef.current) saveSuggestions(sessionIdRef.current, newSuggestions);
            return merged;
          });
        }
      } catch {}
    }, 4000);
  }, [context, triggerSummary, triggerStateExtraction]);

  const toggleRecording = useCallback(async () => {
    if (recording) {
      stopFnRef.current?.();
      stopFnRef.current = null;
      setRecording(false);
      if (sessionIdRef.current) {
        await endSession(sessionIdRef.current, summaryRef.current, currentStateMapRef.current);
      }
    } else {
      const sid = await createSession();
      sessionIdRef.current = sid;
      const stop = startTranscription(handleSegment);
      stopFnRef.current = stop;
      setRecording(true);
    }
  }, [recording, handleSegment]);

  const handleReset = async () => {
    stopFnRef.current?.();
    stopFnRef.current = null;
    if (sessionIdRef.current) {
      await endSession(sessionIdRef.current, summaryRef.current, currentStateMapRef.current);
      sessionIdRef.current = null;
    }
    setRecording(false);
    setSegments([]);
    setSuggestions([]);
    setSummary(null);
    setCurrentStateMap(null);
    setBriefHasNewData(false);
    fullTranscriptRef.current = '';
    lastSummarizedAtRef.current = 0;
    lastExtractedAtRef.current = 0;
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
    position: 'relative' as const,
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#08090f', fontFamily: "'Outfit', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ width: '45%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1c2030' }}>

        <div style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 }}>
          <a href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3a4a60', textDecoration: 'none', flexShrink: 0 }}>
            ← Back
          </a>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#38d4a0', flex: 1 }}>
            Meeting Copilot
          </span>
          {/* Temperature indicator — only shows once recording starts and suggestions exist */}
          {recording && suggestions.length > 0 && (() => {
            const temp = computeTemperature(suggestions);
            const ts = TEMP_STYLE[temp];
            return (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: ts.color, background: ts.bg, border: `1px solid ${ts.dot}`, padding: '0.15rem 0.5rem', flexShrink: 0 }}>
                ● {temp}
              </span>
            );
          })()}
          <a
            href="/copilot/history"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3a4a60', textDecoration: 'none', flexShrink: 0 }}
          >
            History
          </a>
          <MicButton recording={recording} supported={supported} onToggle={toggleRecording} />
        </div>

        {!supported && (
          <div style={{ background: '#180e02', borderBottom: '1px solid #3a2808', color: '#e8a020', fontSize: '0.78rem', padding: '0.5rem 1.25rem', flexShrink: 0 }}>
            Requires Chrome or Edge for Web Speech API.
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid #1c2030', padding: '0 0.5rem', flexShrink: 0 }}>
          <button style={tabStyle(leftTab === 'transcript')} onClick={() => setLeftTab('transcript')}>
            Transcript {segments.length > 0 && `(${segments.length})`}
          </button>
          <button style={tabStyle(leftTab === 'context')} onClick={() => setLeftTab('context')}>
            Context
          </button>
        </div>

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

        <div style={{ padding: '0 0.5rem', borderBottom: '1px solid #1c2030', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex' }}>

            <button style={tabStyle(rightTab === 'suggestions')} onClick={() => setRightTab('suggestions')}>
              Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
            </button>

            {/* Client Brief tab with badge */}
            <button
              style={tabStyle(rightTab === 'brief')}
              onClick={() => { setRightTab('brief'); setBriefHasNewData(false); }}
            >
              Client Brief
              {briefHasNewData && rightTab !== 'brief' && (
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#4a9eff', marginLeft: 5, verticalAlign: 'middle', marginBottom: 1 }} />
              )}
            </button>

            <button style={tabStyle(rightTab === 'summary')} onClick={() => setRightTab('summary')}>
              Summary {summarizing && '…'}
            </button>
          </div>

          {/* Right-side controls per tab */}
          <div style={{ marginRight: '0.5rem' }}>
            {rightTab === 'suggestions' && suggestions.length > 0 && (
              <button
                onClick={() => setSuggestions([])}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: '#3a4a60', textTransform: 'uppercase', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
            {rightTab === 'brief' && segments.length >= 8 && (
              <button
                onClick={() => triggerStateExtraction(segments.map(s => s.text).join(' '))}
                disabled={extractingState}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: extractingState ? '#3a4a60' : '#4a9eff', textTransform: 'uppercase', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: extractingState ? 'not-allowed' : 'pointer' }}
              >
                {extractingState ? 'Updating…' : 'Refresh'}
              </button>
            )}
            {rightTab === 'summary' && segments.length >= 4 && (
              <button
                onClick={() => triggerSummary(segments.map(s => s.text).join(' '))}
                disabled={summarizing}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', color: summarizing ? '#3a4a60' : '#38d4a0', textTransform: 'uppercase', background: 'none', border: '1px solid #1c2030', padding: '0.2rem 0.5rem', cursor: summarizing ? 'not-allowed' : 'pointer' }}
              >
                {summarizing ? 'Updating…' : 'Refresh'}
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {rightTab === 'suggestions' && (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suggestions.length === 0 ? (
                <div style={{ color: '#2a3040', fontSize: '0.82rem', fontFamily: "'DM Mono', monospace", textAlign: 'center', marginTop: '3rem', lineHeight: 1.7 }}>
                  {recording
                    ? 'Listening… suggestions appear as the conversation develops'
                    : 'Start recording to receive real-time suggestions'}
                </div>
              ) : (
                suggestions.map(s => (
                  <SuggestionCard key={s.id} suggestion={s} onSendToWorkflow={handleSendToWorkflow} />
                ))
              )}
            </div>
          )}

          {rightTab === 'brief' && (
            <ClientBrief map={currentStateMap} extracting={extractingState} />
          )}

          {rightTab === 'summary' && (
            <MeetingSummary summary={summary} summarizing={summarizing} segmentCount={segments.length} />
          )}
        </div>

        <div style={{ padding: '0.6rem 1.25rem', borderTop: '1px solid #1c2030', flexShrink: 0 }}>
          <p style={{ fontSize: '0.7rem', color: '#2a3040', lineHeight: 1.5, margin: 0 }}>
            <strong style={{ color: '#3a4a60' }}>Mac audio:</strong> BlackHole → Multi-Output Device → Zoom output → browser mic to BlackHole.
          </p>
        </div>
      </div>

    </div>
  );
}
