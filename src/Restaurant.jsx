import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';

function Restaurant() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [packets, setPackets] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [availableDonations, setAvailableDonations] = useState([]);
  const [ngoRequestCount, setNgoRequestCount] = useState(0);
  const [showBackWarning, setShowBackWarning] = useState(false);
  const [restaurant, setRestaurant] = useState({ name: '' });

  useEffect(() => {
    fetchProfile();
    fetchDonations();
    fetchNgoRequestCount();

    const interval = setInterval(() => {
      fetchDonations();
      fetchNgoRequestCount();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    function handlePopState() {
      window.history.pushState(null, '', window.location.href);
      setShowBackWarning(true);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  //Bipasha
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
//End

  async function fetchDonations() {
    try {
      const res = await fetch('http://localhost:4000/donations/mine', {
        credentials: 'include',
      });
      const data = await res.json();
      setAvailableDonations(data.donations);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchNgoRequestCount() {
    try {
      const res = await fetch('http://localhost:4000/requests/for-my-donations', {
        credentials: 'include',
      });
      const data = await res.json();
      setNgoRequestCount(data.requests.length);
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
    navigate('/log-in', { state: { role: 'restaurant' }, replace: true });
  }

  function openModal(e) {
    e.preventDefault();
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setContact('');
    setAddress('');
    setPackets('');
    setDuration('');
    setError('');
  }

  async function handleConfirm() {
    if (
      contact.trim() === '' || address.trim() === '' || packets.trim() === '' || duration.trim() === ''
    ) {
      setError('needed to fill up all the boxes');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contact, address, packets, duration }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setAvailableDonations([...availableDonations, data.donation]);
      closeModal();
    } catch (err) {
      setError('Server error, try again');
    }
  }

  async function removeDonation(id) {
    try {
      await fetch(`http://localhost:4000/donations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setAvailableDonations(availableDonations.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
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
            <Link to="/home-page" className="sidebar-link active">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <a href="#" className="sidebar-link" onClick={openModal}>
              <span className="sidebar-icon">➕</span>Add Food Donation
            </a>
            <Link to="/pro-res" className="sidebar-link">
              <span className="sidebar-icon">👤</span>Profile
            </Link>
            <Link to="/ngo-requests" className="sidebar-link">
              <span className="sidebar-icon">📩</span>NGO Requests
            </Link>
            <Link to="/res-history" className="sidebar-link">
              <span className="sidebar-icon">📜</span>History
            </Link>
            <Link to="/how-it-works" state={{ role: 'restaurant' }} className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>How It Works
            </Link>
            <Link to="/about-us" state={{ role: 'restaurant' }} className="sidebar-link">
              <span className="sidebar-icon">ℹ️</span>About Us
            </Link>
            <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <span className="sidebar-icon">↪️</span>Logout
            </a>
          </nav>
        </aside>

        <div className="dashboard-content">
          <section className="welcome-banner">
            <p className="welcome-label">Welcome to</p>
            <h2 className="welcome-name">{restaurant.name}!</h2>
          </section>

          <section className="content-columns">
            <div className="main-column">

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon">🍽️</div>
                  <div className="stat-info">
                    <span className="stat-number">{availableDonations.length}</span>
                    <span className="stat-label">Active Donations</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {availableDonations.reduce((sum, item) => sum + Number(item.remainingPackets || 0), 0)}
                    </span>
                    <span className="stat-label">Total Packets</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-info">
                    <span className="stat-number">{ngoRequestCount}</span>
                    <span className="stat-label">NGO Requests</span>
                  </div>
                </div>
              </div>

              <div className="donations-panel">
                <div className="panel-header">
                  <h3>Food Available for Donation</h3>
                </div>
                <hr className="panel-divider" />
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Packets Available</th>
                      <th>Time Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableDonations.length === 0 ? (
                      <tr>
                        <td colSpan="5">
                          <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <p>No donations added yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      availableDonations.map((item) => (
                        <tr key={item._id}>
                          <td>{item.contact}</td>
                          <td>{item.address}</td>
                          <td><span className="packets-badge">{item.remainingPackets}</span></td>
                          <td>🕒 {item.duration}</td>
                          <td>
                            <button className="delete-btn" onClick={() => removeDonation(item._id)}>🗑️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </section>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2>Add Food Donation</h2>

            <div className="form-group">
              <label>Contact No</label>
              <input
                type="text"
                placeholder="e.g. 123-456-7890"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="e.g. Mirpur, Dhaka"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Packets to Donate</label>
              <input
                type="text"
                placeholder="e.g. 20"
                value={packets}
                onChange={(e) => setPackets(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Time Duration</label>
              <input
                type="text"
                placeholder="e.g. 2:00 PM - 4:00 PM"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="btn btn-green" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}
      {showBackWarning && (
        <div className="back-warning-overlay">
          <div className="back-warning-box">
            <button
              className="back-warning-close"
              onClick={() => setShowBackWarning(false)}
            >
              ✕
            </button>
            <div className="back-warning-icon">🔒</div>
            <h3>Can't Go Back</h3>
            <p>You need to logout to go back.</p>
          </div>
        </div>
      )}
      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/how-it-works"  className="footer-link">How It Works</Link>
          <Link to="/about-us" className="footer-link">About Us</Link>
        </div>
      </footer>
    </>
  );
}
export default Restaurant;