import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';
import DoorMenu from './sidebar';
import SettingsMenu from './SettingsMenu';
import Footer from './Footer';
import { useAuth } from './AuthContext';

const CONTACT_PATTERN = /^[0-9]{10,15}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELDS = [
  { name: 'name', label: 'Restaurant Name', type: 'text', icon: '🍽️' },
  { name: 'contact', label: 'Contact No', type: 'text', icon: '📞', placeholder: 'e.g. 1234567890' },
  { name: 'email', label: 'Email Address', type: 'email', icon: '✉️' },
  { name: 'address', label: 'Address', type: 'text', icon: '📍' },
  { name: 'monthlyGoal', label: 'Target Packets This Month', type: 'number', icon: '🎯', min: 1, wide: true },
];

function ProfileRes() {
  const navigate = useNavigate();
  const { logout: clearAuthUser } = useAuth();

  const [restaurant, setRestaurant] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    monthlyGoal: '',
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
          setRestaurant({ ...data.user, monthlyGoal: data.user.monthlyGoal || 200 });
        }
      } catch (err) { }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  }

  async function handleSaveProfile() {
    if (FIELDS.some(({ name }) => String(restaurant[name] ?? '').trim() === '')) {
      setProfileMsg('All fields must be filled');
      return;
    }

    if (!CONTACT_PATTERN.test(restaurant.contact)) {
      setProfileMsg('Contact number must be 10 to 15 digits only');
      return;
    }

    if (!EMAIL_PATTERN.test(restaurant.email)) {
      setProfileMsg('Please give a valid email address');
      return;
    }

    if (!(Number(restaurant.monthlyGoal) > 0)) {
      setProfileMsg('Please give a valid goal number');
      return;
    }

    try {
      // 1st: name, contact, address, email save
      const res = await fetch('http://localhost:4000/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: restaurant.name,
          contact: restaurant.contact,
          address: restaurant.address,
          email: restaurant.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileMsg(data.error || 'Something went wrong');
        return;
      }

      // 2nd: monthly goal save
      const goalRes = await fetch('http://localhost:4000/auth/goal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ monthlyGoal: restaurant.monthlyGoal }),
      });
      const goalData = await goalRes.json();
      if (!goalRes.ok) {
        setProfileMsg(goalData.error || 'Goal could not be saved');
        return;
      }

      setRestaurant(goalData.user);
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
    navigate('/log-in', { state: { role: 'restaurant' }, replace: true });
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
          <Link to="/home-page" className="back-toggle" aria-label="Back to dashboard">
            <img src="/images/back-button.png" alt="" />
          </Link>

          <Link to="/pro-res" className="navbar-profile-btn" aria-label="Go to profile">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
            </svg>
          </Link>

          <SettingsMenu />

          <DoorMenu>
            <Link to="/home-page" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>
              Home
            </Link>

            <Link to="/home-page" className="sidebar-link">
              <span className="sidebar-icon">➕</span>
              Add Food Donation
            </Link>

            <Link to="/pro-res" className="sidebar-link active">
              <span className="sidebar-icon">👤</span>
              Profile
            </Link>

            <Link to="/ngo-requests" className="sidebar-link">
              <span className="sidebar-icon">📩</span>
              NGO Requests
            </Link>

            <Link to="/res-history" className="sidebar-link">
              <span className="sidebar-icon">📜</span>
              History
            </Link>

            <Link to="/how-it-works" state={{ role: 'restaurant' }} className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>
              How It Works
            </Link>

            <Link to="/about-us" state={{ role: 'restaurant' }} className="sidebar-link">
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
            <img src="/images/Restaurent.png" alt="Restaurant logo" className="rp-avatar" />

            <div className="rp-title">
              <h2>{restaurant.name || 'Restaurant'}</h2>
              <span className="rp-badge">Restaurant Partner</span>
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
            <h3>Restaurant Details</h3>

            <div className="rp-grid">
              {FIELDS.map(({ name, label, icon, wide, ...inputProps }) => (
                <div className={`rp-card ${wide ? 'rp-card-wide' : ''}`} key={name}>
                  <span className="rp-card-icon">{icon}</span>
                  <div className="rp-card-body">
                    <label className="rp-label" htmlFor={name}>{label}</label>
                    <input
                      {...inputProps}
                      id={name}
                      name={name}
                      className={`rp-input ${isEditing ? '' : 'rp-input-view'}`}
                      value={restaurant[name]}
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

export default ProfileRes;