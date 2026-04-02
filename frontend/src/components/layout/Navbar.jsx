import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/tasks', label: 'Tasks' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          TaskFlow
        </Link>

        <nav className="navbar-links">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`navbar-link ${location.pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="navbar-right">
          <div className="navbar-user" onClick={() => setMenuOpen((v) => !v)}>
            <div className="navbar-avatar">{initials}</div>
            <span className="navbar-username">{user?.name?.split(' ')[0]}</span>
            <span className="navbar-chevron">{menuOpen ? '▲' : '▼'}</span>
          </div>

          {menuOpen && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-email">{user?.email}</div>
              <div className="navbar-dropdown-divider" />
              <Link to="/profile" className="navbar-dropdown-item" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          )}
        </div>

        <button className="navbar-mobile-btn" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <Link to="/profile" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <button className="navbar-mobile-link danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
