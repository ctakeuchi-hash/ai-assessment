'use client';

interface CaptionBarProps {
  text: string;
  recording: boolean;
}

export function CaptionBar({ text, recording }: CaptionBarProps) {
  if (!recording) return null;

  return (
    <div
      style={{
        background: 'rgba(8, 9, 15, 0.95)',
        borderTop: '1px solid #1c2030',
        padding: '0.75rem 1.25rem',
        minHeight: 56,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {text ? (
        <p
          style={{
            margin: 0,
            fontSize: '1.05rem',
            color: '#f0ead8',
            lineHeight: 1.5,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          {text}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: '#38d4a0',
              marginLeft: 3,
              verticalAlign: 'middle',
              animation: 'blink 1s step-start infinite',
            }}
          />
          <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        </p>
      ) : (
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.65rem',
            color: '#2a3040',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ● listening…
        </span>
      )}
    </div>
  );
}
