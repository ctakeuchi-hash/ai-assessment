'use client';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#08090f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif",
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#38d4a0', marginBottom: '1rem' }}>
          Client Discovery Suite
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f0ead8', lineHeight: 1.08, margin: 0 }}>
          Meeting Copilot
        </h1>
        <p style={{ color: '#58647a', fontSize: '0.9rem', marginTop: '0.75rem', maxWidth: 400 }}>
          Two tools for sharper discovery calls — used together or independently.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', width: '100%', maxWidth: 680 }}>

        <a href="/workflow" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#0e1018',
              border: '1px solid #1c2030',
              borderTop: '3px solid #e8a020',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#e8a020')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1c2030')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>◇</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8a020', marginBottom: '0.4rem' }}>
              Tool 1
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0ead8', margin: '0 0 0.5rem' }}>
              Workflow Visualizer
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#58647a', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
              Describe any business process in plain English. Get an instant interactive diagram.
            </p>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', color: '#3a4a60' }}>
              /workflow <span style={{ color: '#e8a020' }}>→</span>
            </div>
          </div>
        </a>

        <a href="/copilot" style={{ textDecoration: 'none' }}>
          <div
            style={{
              background: '#0e1018',
              border: '1px solid #1c2030',
              borderTop: '3px solid #38d4a0',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#38d4a0')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1c2030')}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>◎</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38d4a0', marginBottom: '0.4rem' }}>
              Tool 2
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#f0ead8', margin: '0 0 0.5rem' }}>
              Meeting Copilot
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#58647a', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
              Live transcript + real-time AI suggestions during Zoom calls. Surfaces solutions, questions, and workflow ideas.
            </p>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', color: '#3a4a60' }}>
              /copilot <span style={{ color: '#38d4a0' }}>→</span>
            </div>
          </div>
        </a>
      </div>

      {/* Keyboard hints */}
      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { key: 'W', label: 'Open Visualizer' },
          { key: 'C', label: 'Open Copilot' },
        ].map(({ key, label }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <kbd style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', background: '#1c2030', border: '1px solid #2a3040', borderRadius: 3, padding: '0.15rem 0.4rem', color: '#58647a' }}>
              {key}
            </kbd>
            <span style={{ fontSize: '0.75rem', color: '#3a4a60' }}>{label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
