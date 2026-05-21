export function SentryFallback() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '2rem',
      textAlign: 'center', fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        We have been notified and are looking into it.
      </p>
      <a href="/" style={{ color: '#1a4f8a', textDecoration: 'underline' }}>
        Return to homepage
      </a>
    </div>
  )
}
