'use client';

interface MicButtonProps {
  recording: boolean;
  supported: boolean;
  onToggle: () => void;
}

export function MicButton({ recording, supported, onToggle }: MicButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={!supported}
      title={recording ? 'Stop recording' : 'Start recording'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: recording ? '#1a0808' : '#0e1018',
        border: `1px solid ${recording ? '#e85858' : '#1c2030'}`,
        color: recording ? '#e85858' : '#58647a',
        fontFamily: "'Outfit', sans-serif",
        fontSize: '0.88rem',
        fontWeight: 600,
        padding: '0.65rem 1.25rem',
        cursor: supported ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s',
        opacity: supported ? 1 : 0.4,
      }}
    >
      <span style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: recording ? '#e85858' : '#3a4a60',
        display: 'inline-block',
        animation: recording ? 'pulse 1s infinite' : 'none',
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      {recording ? 'Stop' : 'Start Recording'}
    </button>
  );
}
