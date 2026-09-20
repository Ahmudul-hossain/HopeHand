import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';

function NgoHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('http://localhost:4000/requests/history/ngo', {
        credentials: 'include',
      });
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.log(err);
      setHistory([]);
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
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/ngo-page" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <Link to="/pro-ngo" className="sidebar-link">
              <span className="sidebar-icon">👤</span>Profile
            </Link>
            <Link to="/food-requests" className="sidebar-link">
              <span className="sidebar-icon">🍱</span>Food Requests
            </Link>
            <Link to="/history-page" className="sidebar-link active">
              <span className="sidebar-icon">📜</span>History
            </Link>
            <Link to="/how-it-works" state={{ role: 'ngo' }} className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>How It Works
            </Link>
            <Link to="/about-us" state={{ role: 'ngo' }} className="sidebar-link">
              <span className="sidebar-icon">ℹ️</span>About Us
            </Link>
            <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <span className="sidebar-icon">↪️</span>Logout
            </a>
          </nav>
        </aside>

        <div className="dashboard-content">
          <section className="welcome-banner">
            <h2 className="welcome-name">Donation History</h2>
          </section>

          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>Donation History</h3>
                </div>
                <hr className="panel-divider" />
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Restaurant Name</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Food Packets</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan="5">Kono history nai ekhono.</td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr key={item._id}>
                          <td>{item.donationId?.restaurantId?.name || 'N/A'}</td>
                          <td>{item.donationId?.restaurantId?.contact || 'N/A'}</td>
                          <td>{item.donationId?.restaurantId?.address || 'N/A'}</td>
                          <td>{item.requestedPackets ?? 'N/A'}</td>
                          <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
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
export default NgoHistory;