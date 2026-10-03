import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';
import DoorMenu from './sidebar';
import SettingsMenu from './SettingsMenu';
import Footer from './Footer';
import { useAuth } from './AuthContext'; 

function NgoRequests() {
  const navigate = useNavigate();
  const { logout: clearAuthUser } = useAuth(); 
  const [requests, setRequests] = useState([]);
  const [restaurant, setRestaurant] = useState({ name: '' });
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchRequests();

    const interval = setInterval(fetchRequests, 4000);
    return () => clearInterval(interval);
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch('http://localhost:4000/auth/me', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setRestaurant(data.user);
      }
    } catch (err) { }
  }

  async function fetchRequests() {
    try {
      const res = await fetch('http://localhost:4000/requests/for-my-donations', {
        credentials: 'include',
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      setRequests([]);
    }
  }

  async function handleAction(id, action) {
    try {
      const res = await fetch(`http://localhost:4000/requests/${id}/${action}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Something went wrong');
        return;
      }
      setActionError('');
      fetchRequests();
    } catch (err) {
      setActionError('Server error, try again');
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

            <Link to="/pro-res" className="sidebar-link">
              <span className="sidebar-icon">👤</span>
              Profile
            </Link>

            <Link to="/ngo-requests" className="sidebar-link active">
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

      <div className="dashboard-content">
        <section className="welcome-banner">
          <div className="welcome-avatar">
            {restaurant.name ? restaurant.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="welcome-text">
            <p className="welcome-label">NGOs that are Requesting for Food Donation from </p>
            <h2 className="welcome-name">{restaurant.name || 'Your Restaurant'}</h2>
          </div>
        </section>

        <section className="content-columns">
          <div className="main-column">
            <div className="panel-header">
              <h3>NGO Requests</h3>
            </div>
            <hr className="panel-divider" />

            {actionError && <p style={{ color: 'red', marginBottom: '10px' }}>{actionError}</p>}

            {requests.length === 0 ? (
              <div className="empty-state"><p>No NGO requests right now.</p></div>
            ) : (
              <div className="ngo-request-grid">
                {requests.map((item) => (
                  <div className="ngo-request-box" key={item._id}>
                    <h4>{item.ngoId?.name || 'N/A'}</h4>
                    <p>📞 {item.ngoId?.contact || 'N/A'}</p>
                    <p>📍 {item.ngoId?.address || 'N/A'}</p>
                    {/* BODLANO: donationId.packets na, requestedPackets */}
                    <p>📦 Requested: {item.requestedPackets ?? 'N/A'} packets (from {item.donationId?.address || 'N/A'})</p>
                    <div className="ngo-request-actions">
                      <button className="btn btn-green" onClick={() => handleAction(item._id, 'accept')}>Accept</button>
                      <button className="btn btn-orange" onClick={() => handleAction(item._id, 'decline')}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default NgoRequests;