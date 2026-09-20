import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';

function ProfileRes() {
  const navigate = useNavigate();

  // Restaurant data
  const [restaurant, setRestaurant] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  // Fetch profile on mount
  useEffect(() => {
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
        // handle error silently for now
      }
    }
    fetchProfile();
  }, []);

  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // ignore
    }
    clearLogin();
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
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
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
          </nav>
        </aside>

        <div className="dashboard-content">
          <section className="welcome-banner">
            <h2 className="welcome-name">{restaurant.name}</h2>
          </section>

          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>Restaurant Details</h3>
                </div>

                <hr className="panel-divider" />

                <div className="detail-row">
                  <span className="detail-label">Restaurant Name</span>
                  <span className="detail-value">{restaurant.name}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Contact No</span>
                  <span className="detail-value">{restaurant.contact}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{restaurant.email}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{restaurant.address}</span>
                </div>

                <div className="profile-actions">
                  <a href="#" className="btn btn-green">Edit Profile</a>
                  <a href="#" className="btn btn-orange">Save Profile</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/how-it-works" className="footer-link">How It Works</Link>
          <Link to="/about-us" className="footer-link">About Us</Link>
        </div>
      </footer>
    </>
  );
}

export default ProfileRes;