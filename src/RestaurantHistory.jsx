import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';
import DoorMenu from './sidebar';
import SettingsMenu from './SettingsMenu';
import Footer from './Footer';
import { useAuth } from './AuthContext'; 

function RestaurantHistory() {
  const navigate = useNavigate();
  const { logout: clearAuthUser } = useAuth(); 
  const [history, setHistory] = useState([]);
  const [restaurant, setRestaurant] = useState({ name: '' });

  useEffect(() => {
    fetchHistory();
    fetchProfile();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('http://localhost:4000/requests/history/restaurant', {
        credentials: 'include',
      });
      const data = await res.json();
      setHistory(data.history || []); // BODLANO: data.history na thakle [] hobe
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch('http://localhost:4000/auth/me', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setRestaurant(data.user);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // history theke ekta entry delete kora
  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:4000/requests/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
    }
    clearLogin();
    clearAuthUser(); // NOTUN
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

          <Link to="/ngo-requests" className="sidebar-link">
            <span className="sidebar-icon">📩</span>
            NGO Requests
          </Link>

          <Link to="/res-history" className="sidebar-link active">
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
              <p className="welcome-label">Donation History for</p>
              <h2 className="welcome-name">{restaurant.name || 'Your Restaurant'}</h2>
            </div>
          </section>

          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel history-panel">
                <div className="panel-header">
                  <h3>My History</h3>
                </div>
                <hr className="panel-divider" />
                {history.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>no history right now</p>
                  </div>
                ) : (
                  <div className="donation-box-grid">
                    {history.map((item) => (
                      <div className="donation-box" key={item._id}>
                        <p>🏢 {item.ngoId.name}</p>
                        <p>📞 {item.ngoId.contact}</p>
                        <p>📍 {item.ngoId.address}</p>
                        <p>📦 <span className="packets-badge">{item.requestedPackets}</span> packets donated</p>
                        <div className="donation-box-actions">
                          <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      <Footer />
    </>
  );
}
export default RestaurantHistory;