import { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { clearLogin } from './auth';

function ProfileNgo() {
const navigate = useNavigate();
const [ngo, setNgo] = useState({
  name: "",
  contact: "",
  email: "",
  address: "",
});

/*Bipasha*/
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
    } catch (err) {
    }
  }
  fetchProfile();
}, []);
/*End*/

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setNgo({ ...ngo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

/*misty*/
  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // backend na thakleo frontend theke logout hoye jabe
    }
    clearLogin();
    navigate('/log-in', { state: { role: 'ngo' }, replace: true });
  }
/*End*/

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src="/images/logo-icon.png" alt="HopeHand logo" />

          <div className="logo-text">
            <h1>
              <span className="hope">Hope</span>
              <span className="hand">Hand</span>
            </h1>

            <p>Sharing Food, Sharing Hope</p>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
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

            <Link
              to="/how-it-works"
              state={{ role: "ngo" }}
              className="sidebar-link"
            >
              <span className="sidebar-icon">⚙️</span>
              How It Works
            </Link>

            <Link
              to="/about-us"
              state={{ role: "ngo" }}
              className="sidebar-link"
            >
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
            <h2 className="welcome-name">{ngo.name}</h2>
          </section>

          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>NGO Details</h3>
                </div>

                <hr className="panel-divider" />

                <div className="detail-row">
                  <span className="detail-label">NGO / Organization Name</span>

                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={ngo.name}
                      onChange={handleChange}
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-value">{ngo.name}</span>
                  )}
                </div>

                <div className="detail-row">
                  <span className="detail-label">Contact No</span>

                  {isEditing ? (
                    <input
                      type="text"
                      name="contact"
                      value={ngo.contact}
                      onChange={handleChange}
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-value">{ngo.contact}</span>
                  )}
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email Address</span>

                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={ngo.email}
                      onChange={handleChange}
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-value">{ngo.email}</span>
                  )}
                </div>

                <div className="detail-row">
                  <span className="detail-label">Address</span>

                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={ngo.address}
                      onChange={handleChange}
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-value">{ngo.address}</span>
                  )}
                </div>

                <div className="profile-actions">
                  {!isEditing ? (
                    <a
                      href="#"
                      className="btn btn-green"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditing(true);
                      }}
                    >
                      Edit Profile
                    </a>
                  ) : (
                    <a
                      href="#"
                      className="btn btn-orange"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSave();
                      }}
                    >
                      Save Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-col">
          <h4>
            <span className="footer-hope">Hope</span>
            <span className="hand">Hand</span>
          </h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/how-it-works" className="footer-link">How It Works</Link>
          <Link to="/about-us" className="footer-link">About Us</Link>
        </div>
      </footer>

      {showSuccess && (
        <div className="success-popup">
          <div className="success-tick">✔</div>
          <p>Profile updated successfully!</p>
        </div>
      )}
    </>
  );
}

export default ProfileNgo;