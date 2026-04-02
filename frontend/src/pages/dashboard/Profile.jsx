import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/authAPI';
import { format } from 'date-fns';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await authAPI.updateMe({ name: name.trim() });
      updateUser(data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <h1 className="profile-title">Profile</h1>

      <div className="profile-grid">
        {/* Identity card */}
        <div className="card profile-identity">
          <div className="profile-avatar-large">{initials}</div>
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">
            Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : '—'}
          </p>
        </div>

        {/* Edit form */}
        <div className="card profile-form-card">
          <h2 className="profile-section-title">Edit Profile</h2>

          {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>✓ {success}</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>⚠ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); setSuccess(''); }}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email cannot be changed.</span>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" /> Saving…</> : 'Save Changes'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0' }}>Danger Zone</div>

          <button
            className="btn btn-danger btn-full"
            onClick={() => { if (window.confirm('Sign out of your account?')) logout(); }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
