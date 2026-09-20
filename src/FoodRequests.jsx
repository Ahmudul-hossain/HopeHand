import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';

function FoodRequests() {
  const navigate = useNavigate();
  const ngo = { name: 'Food For All Foundation' };

  const [requests, setRequests] = useState([]);
  const [acceptedPopups, setAcceptedPopups] = useState([]);
  const [packetInputs, setPacketInputs] = useState({});
  const [hiddenIds, setHiddenIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDonations();
    checkAcceptedRequests();

    const interval = setInterval(() => {
      fetchDonations();
      checkAcceptedRequests();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  async function fetchDonations() {
    try {
      const res = await fetch('http://localhost:4000/donations', {
        credentials: 'include',
      });
      const data = await res.json();
      const donations = data.donations || [];
      const visible = donations.filter(
        (item) => item.remainingPackets > 0 && !hiddenIds.includes(item._id)
      );
      setRequests(visible);
    } catch (err) {
      console.log(err);
      setRequests([]);
    }
  }

  async function checkAcceptedRequests() {
    try {
      const res = await fetch('http://localhost:4000/requests/mine/new-accepted', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.requests && data.requests.length > 0) {
        setAcceptedPopups((prev) => [...prev, ...data.requests]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function closeAcceptedPopup() {
    setAcceptedPopups((prev) => prev.slice(1));
  }

  const handleAccept = async (donationId) => {
    const wanted = packetInputs[donationId];
    if (!wanted || Number(wanted) <= 0) {
      setErrorMsg('Please enter how many packets you want first.');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ donationId, requestedPackets: wanted }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setHiddenIds((prev) => [...prev, donationId]);
      setRequests((prev) => prev.filter((item) => item._id !== donationId));
    } catch (err) {
      console.log(err);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const handleDecline = (id) => {
    setHiddenIds((prev) => [...prev, id]);
    setRequests((prev) => prev.filter((item) => item._id !== id));
  };

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

      {errorMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff3f3',
            border: '1px solid #e05050',
            color: '#a30000',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          {errorMsg}
        </div>
      )}

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link to="/ngo-page" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <Link to="/pro-ngo" className="sidebar-link">
              <span className="sidebar-icon">👤</span>Profile
            </Link>
            <Link to="/food-requests" className="sidebar-link active">
              <span className="sidebar-icon">🍱</span>Food Requests
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
            <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
              <span className="sidebar-icon">↪️</span>Logout
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
                  <h3>Food Requests</h3>
                </div>
                <hr className="panel-divider" />
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Restaurant Name</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Packets Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="5">No food requests right now.</td>
                      </tr>
                    ) : (
                      requests.map((item) => (
                        <tr key={item._id}>
                          <td>{item.restaurantId?.name || 'N/A'}</td>
                          <td>{item.contact || 'N/A'}</td>
                          <td>{item.address || 'N/A'}</td>
                          <td>{item.remainingPackets}</td>
                          <td>
                            <input
                              type="number"
                              placeholder="packets"
                              style={{ width: '70px', marginRight: '5px' }}
                              value={packetInputs[item._id] || ''}
                              onChange={(e) => setPacketInputs({ ...packetInputs, [item._id]: e.target.value })}
                            />
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

      {acceptedPopups.length > 0 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={closeAcceptedPopup}>✕</button>
            <h2>🎉 Request Accepted!</h2>
            <p style={{ marginBottom: '10px' }}>
            Your request has been accepted by this restaurant. Please contact them now:
            </p>
            <div className="form-group">
              <label>Restaurant Contact</label>
              <p>{acceptedPopups[0]?.donationId?.contact || 'N/A'}</p>
            </div>
            <div className="form-group">
              <label>Address</label>
              <p>{acceptedPopups[0]?.donationId?.address || 'N/A'}</p>
            </div>
            <div className="form-group">
              <label>Packets</label>
              <p>{acceptedPopups[0]?.donationId?.packets ?? 'N/A'}</p>
            </div>
            <button className="btn btn-green" onClick={closeAcceptedPopup}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
export default FoodRequests;