import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';

function NgoRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();

    const interval = setInterval(() => {
      fetchRequests();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch('http://localhost:4000/requests/for-my-donations', {
        credentials: 'include',
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.log(err);
      setRequests([]);
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

  async function handleAccept(id) {
    try {
      await fetch(`http://localhost:4000/requests/${id}/accept`, {
        method: 'PATCH',
        credentials: 'include',
      });
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDecline(id) {
    try {
      await fetch(`http://localhost:4000/requests/${id}/decline`, {
        method: 'PATCH',
        credentials: 'include',
      });
      fetchRequests();
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
            <Link to="/ngo-page" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <Link to="/ngo-page" className="sidebar-link">
              <span className="sidebar-icon">➕</span>Add Food Donation
            </Link>
            <Link to="/pro-ngo" className="sidebar-link">
              <span className="sidebar-icon">👤</span>Profile
            </Link>
            <Link to="/ngo-requests" className="sidebar-link active">
              <span className="sidebar-icon">📩</span>NGO Requests
            </Link>
            <Link to="/history-page" className="sidebar-link">
              <span className="sidebar-icon">📜</span>History
            </Link>
            <Link to="/how-it-works" state={{ role: 'ngo' }} className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>How It Works
            </Link>
            <Link to="/about-us" state={{ role: 'ngo' }} className="sidebar-link">
              <span className="sidebar-icon">ℹ️</span>About Us
            </Link>
            <a
              href="#"
              className="sidebar-link logout-link"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <span className="sidebar-icon">↪️</span>Logout
            </a>
          </nav>
        </aside>

        <div className="dashboard-content">
          <section className="welcome-banner">
            <p className="welcome-label">Welcome to</p>
            <h2 className="welcome-name">Amader Kitchen!</h2>
          </section>

          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>NGO Requests</h3>
                </div>
                <hr className="panel-divider" />
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>NGO Name</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>For Donation</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="6">No NGO requests right now.</td>
                      </tr>
                    ) : (
                      requests.map((item) => (
                        <tr key={item._id}>
                          <td>{item.ngoId?.name || 'N/A'}</td>
                          <td>{item.ngoId?.contact || 'N/A'}</td>
                          <td>{item.ngoId?.address || 'N/A'}</td>
                          <td>
                            {item.donationId?.address || 'N/A'} ({item.donationId?.packets ?? 'N/A'} packets)
                          </td>
                          <td>{item.status || 'N/A'}</td>
                          <td>
                            <button className="btn btn-green" onClick={() => handleAccept(item._id)}>
                              Accept
                            </button>
                            <button className="btn btn-orange" onClick={() => handleDecline(item._id)}>
                              Decline
                            </button>
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

export default NgoRequests;