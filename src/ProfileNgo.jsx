import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';
import DoorMenu from './sidebar';
import Footer from './Footer';
import { useAuth } from './AuthContext';

const CONTACT_PATTERN = /^[0-9]{10,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = [
  { name: 'name', label: 'NGO / Organization Name', type: 'text', icon: '🏢' },
  { name: 'contact', label: 'Contact No', type: 'text', icon: '📞', placeholder: 'e.g. 1234567890' },
  { name: 'email', label: 'Email Address', type: 'email', icon: '✉️' },
  { name: 'address', label: 'Address', type: 'text', icon: '📍' },
];

function ProfileNgo() {
  const navigate = useNavigate();
  const { logout: clearAuthUser } = useAuth();

  const [ngo, setNgo] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setNgo(data.user);
        }
      } catch (err) { }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    setNgo({ ...ngo, [e.target.name]: e.target.value });
  }

  async function handleSaveProfile() {
    if (FIELDS.some(({ name }) => String(ngo[name] ?? '').trim() === '')) {
      setProfileMsg('All fields must be filled');
      return;
    }

    if (!CONTACT_PATTERN.test(ngo.contact)) {
      setProfileMsg('Contact number must be 10 to 15 digits only');
      return;
    }

    if (!EMAIL_PATTERN.test(ngo.email)) {
      setProfileMsg('Please give a valid email address');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: ngo.name,
          contact: ngo.contact,
          address: ngo.address,
          email: ngo.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg(data.error || 'Something went wrong');
        return;
      }

      setNgo(data.user);
      setIsEditing(false);
      setProfileMsg('Profile updated!');
      setTimeout(() => setProfileMsg(''), 2000);
    } catch (err) {
      setProfileMsg('Server error, try again');
    }
  }

  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) { }

    clearLogin();
    clearAuthUser();
    navigate('/log-in', { state: { role: 'ngo' }, replace: true });
  }

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src="/images/logo-icon.png" alt="HopeHand logo" />
          <div className="logo-text">
            <h1><span className="hope">Hope</span><span className="hand">Hand</span></h1>
            <p>Sharing Food, Sharing Hope</p>
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/ngo-page" className="back-toggle" aria-label="Back to dashboard">
            <img src="/images/back-button.png" alt="" />
          </Link>

          <Link to="/pro-ngo" className="navbar-profile-btn" aria-label="Go to profile">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
            </svg>
          </Link>

          <DoorMenu>
            <Link to="/ngo-page" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>
              Home
            </Link>

            <Link to="/pro-ngo" className="sidebar-link active">
              <span className="sidebar-icon">👤</span>
              Profile
            </Link>

            <Link to="/food-requests" className="sidebar-link">
              <span className="sidebar-icon">🍱</span>
              Food Requests
            </Link>

            <Link to="/history-page" className="sidebar-link">
              <span className="sidebar-icon">📜</span>
              History
            </Link>

            <Link to="/how-it-works" state={{ role: 'ngo' }} className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>
              How It Works
            </Link>

            <Link to="/about-us" state={{ role: 'ngo' }} className="sidebar-link">
              <span className="sidebar-icon">ℹ️</span>
              About Us
            </Link>

            <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <span className="sidebar-icon">↪️</span>
              Logout
            </a>
          </DoorMenu>
        </div>
      </header>

      <main className="rp-page">
        <div className="rp-banner"></div>

        <form
          className="rp-container"
          onSubmit={(e) => { e.preventDefault(); if (isEditing) handleSaveProfile(); }}
        >
          <div className="rp-header">
            <img src="/images/NGO_LOGO.jpg" alt="NGO logo" className="rp-avatar" />

            <div className="rp-title">
              <h2>{ngo.name || 'NGO'}</h2>
              <span className="rp-badge">NGO Partner</span>
            </div>

            <div className="rp-actions">
              {!isEditing ? (
                <button type="button" className="rp-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              ) : (
                <button type="button" className="rp-btn rp-btn-orange" onClick={handleSaveProfile}>
                  Save Profile
                </button>
              )}
            </div>
          </div>

          <section className="rp-section">
            <h3>NGO Details</h3>

            <div className="rp-grid">
              {FIELDS.map(({ name, label, icon, ...inputProps }) => (
                <div className="rp-card" key={name}>
                  <span className="rp-card-icon">{icon}</span>
                  <div className="rp-card-body">
                    <label className="rp-label" htmlFor={name}>{label}</label>
                    <input
                      {...inputProps}
                      id={name}
                      name={name}
                      className={`rp-input ${isEditing ? '' : 'rp-input-view'}`}
                      value={ngo[name]}
                      onChange={handleChange}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              ))}
            </div>

            {profileMsg && (
              <p className={`rp-msg ${profileMsg === 'Profile updated!' ? 'rp-msg-ok' : 'rp-msg-error'}`}>
                {profileMsg}
              </p>
            )}
          </section>
        </form>
      </main>

      <Footer />
    </>
  );
}

export default ProfileNgo;