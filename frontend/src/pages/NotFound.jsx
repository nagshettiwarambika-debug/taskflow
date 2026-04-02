import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    background: 'var(--bg-base)',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: '4rem', lineHeight: 1 }}>⚡</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.04em' }}>404</h1>
    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Page not found</h2>
    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 300 }}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 8 }}>
      ← Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
