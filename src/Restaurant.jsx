import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearLogin } from './auth';
import DoorMenu from './sidebar';
import SettingsMenu from './SettingsMenu';
import Footer from './Footer';
import { useAuth } from './AuthContext';

function isToday(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

function Restaurant() {
  const navigate = useNavigate();
  const { logout: clearAuthUser } = useAuth();
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
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [deleteError, setDeleteError] = useState('');
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [acceptedHistory, setAcceptedHistory] = useState([]);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  useEffect(() => {
    fetchProfile();
    fetchDonations();
    fetchNgoRequestCount();
    fetchAcceptedHistory();

    const interval = setInterval(() => {
      fetchDonations();
      fetchNgoRequestCount();
      fetchAcceptedHistory();
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

  async function fetchDonations() {
    try {
      const res = await fetch('http://localhost:4000/donations/mine', {
        credentials: 'include',
      });
      const data = await res.json();
      setAvailableDonations(data.donations || []); 
      setLoadingDonations(false);
    } catch (err) {
      console.log(err);
      setLoadingDonations(false);
    }
  }

  async function fetchNgoRequestCount() {
    try {
      const res = await fetch('http://localhost:4000/requests/for-my-donations', {
        credentials: 'include',
      });
      const data = await res.json();
      setNgoRequestCount(data.requests.length);
      setRecentRequests(data.requests.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchAcceptedHistory() {
    try {
      const res = await fetch('http://localhost:4000/requests/history/restaurant', {
        credentials: 'include',
      });
      const data = await res.json();
      setAcceptedHistory(data.history || []);
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
    } catch (err) { }
    clearLogin();
    clearAuthUser();
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
    if (contact.trim() === '' || address.trim() === '' || packets.trim() === '' || duration.trim() === '') {
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
      const res = await fetch(`http://localhost:4000/donations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || 'Could not delete this donation');
        return;
      }
      setDeleteError('');
      setAvailableDonations(availableDonations.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
      setDeleteError('Server error, try again');
    }
  }

  const totalPacketsShared = availableDonations.reduce(
    (sum, item) => sum + (Number(item.packets || 0) - Number(item.remainingPackets || 0)),
    0
  );
  const monthlyGoal = restaurant.monthlyGoal || 200;
  const progressPercent = Math.min(100, Math.round((totalPacketsShared / monthlyGoal) * 100));
  const visibleDonations = showAllDonations ? availableDonations : availableDonations.slice(0, 2);

  const claimedToday = acceptedHistory.filter((item) => isToday(item.updatedAt)).length;

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
          <Link to="/pro-res" className="navbar-profile-btn" aria-label="Go to profile">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
            </svg>
          </Link>
          <SettingsMenu />
          <DoorMenu>
            <Link to="/home-page" className="sidebar-link active"><span className="sidebar-icon">🏠</span>Home</Link>
            <a href="#" className="sidebar-link" onClick={openModal}><span className="sidebar-icon">➕</span>Add Food Donation</a>
            <Link to="/pro-res" className="sidebar-link"><span className="sidebar-icon">👤</span>Profile</Link>
            <Link to="/ngo-requests" className="sidebar-link"><span className="sidebar-icon">🤝</span>NGO Requests</Link>
            <Link to="/res-history" className="sidebar-link"><span className="sidebar-icon">📜</span>History</Link>
            <Link to="/how-it-works" state={{ role: 'restaurant' }} className="sidebar-link"><span className="sidebar-icon">⚙️</span>How It Works</Link>
            <Link to="/about-us" state={{ role: 'restaurant' }} className="sidebar-link"><span className="sidebar-icon">ℹ️</span>About Us</Link>
            <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}><span className="sidebar-icon">↪️</span>Logout</a>
          </DoorMenu>
        </div>
      </header>

      <div className="rh-page">
        <section className="ngo-hero rh-hero">
          <div className="ngo-container ngo-hero-inner">
            <div className="ngo-hero-text">
              <h2>{getGreeting()}, {restaurant.name || 'Restaurant'}! 👋</h2>
              <p>Connect with NGOs, share surplus food and make a difference.</p>
              <button className="rh-add-btn" onClick={openModal}>+ Add New Donation</button>
            </div>

            <div className="ngo-hero-highlights">
              <div className="highlight-card">
                <span className="highlight-icon">🌱</span>
                <div className="highlight-text">
                  <h4>Reduce Food Waste</h4>
                  <p>Good food shouldn't go to waste. Let's share it.</p>
                </div>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon"><img src="/images/Community.png" alt="" /></span>
                <div className="highlight-text">
                  <h4>Support the Community</h4>
                  <p>Help people in need with fresh food.</p>
                </div>
              </div>
              <div className="highlight-card">
                <span className="highlight-icon">❤️</span>
                <div className="highlight-text">
                  <h4>Build a Stronger Community</h4>
                  <p>Together we can make a difference.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ngo-container ngo-hero-dash">
            <span className="ngo-dash-badge">Restaurant Portal</span>
            <h2>Restaurant Dashboard</h2>

            <div className="ngo-stats-row">
              <div className="ngo-stat-card">
                <div className="ngo-stat-top">
                  <span className="ngo-stat-label">ACTIVE DONATIONS</span>
                  <span className="ngo-stat-icon icon-green">🍽️</span>
                </div>
                <div className="ngo-stat-number">{availableDonations.length}</div>
                <span className="ngo-stat-sub sub-green">↑ Ready for collection</span>
              </div>

              <div className="ngo-stat-card">
                <div className="ngo-stat-top">
                  <span className="ngo-stat-label">AVAILABLE PACKETS</span>
                  <span className="ngo-stat-icon icon-orange">📦</span>
                </div>
                <div className="ngo-stat-number">
                  {availableDonations.reduce((sum, item) => sum + Number(item.remainingPackets || 0), 0)}
                </div>
                <span className="ngo-stat-sub sub-orange">Waiting to be shared</span>
              </div>

              <div className={`ngo-stat-card ${ngoRequestCount > 0 ? 'has-requests' : ''}`}>
                <div className="ngo-stat-top">
                  <span className="ngo-stat-label">NGO REQUESTS</span>
                  <span className="ngo-stat-icon icon-purple">🤝</span>
                </div>
                <div className="ngo-stat-number">{ngoRequestCount}</div>
                <span className="ngo-stat-sub sub-purple">Waiting for your response</span>
              </div>

              <div className="ngo-stat-card">
                <div className="ngo-stat-top">
                  <span className="ngo-stat-label">CLAIMED TODAY</span>
                  <span className="ngo-stat-icon icon-pink">❤️</span>
                </div>
                <div className="ngo-stat-number">{claimedToday}</div>
                <span className="ngo-stat-sub sub-pink">{claimedToday > 0 ? '✓ Meals claimed' : 'No meals claimed yet'}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-content">
          <section className="rh-row rh-row-middle">
            <div className="rh-panel">
              <div className="rh-panel-head">
                <h3>📦 Food Available for Donation</h3>
                <div className="rh-panel-links">
                  <a href="#" className="rh-link" onClick={openModal}>+ Add New Donation</a>
                  <a href="#" className="rh-link" onClick={(e) => { e.preventDefault(); setShowAllDonations(!showAllDonations); }}>
                    {showAllDonations ? 'Show Less ↑' : 'View All →'}
                  </a>
                </div>
              </div>

              {deleteError && <p style={{ color: 'red', marginBottom: '10px' }}>{deleteError}</p>}

              {loadingDonations ? (
                <div className="rh-donation-grid">
                  <div className="rh-donation-card"><div className="skeleton-bar"></div></div>
                  <div className="rh-donation-card"><div className="skeleton-bar"></div></div>
                </div>
              ) : availableDonations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No donations added yet.</p>
                </div>
              ) : (
                <div className="rh-donation-grid">
                  {visibleDonations.map((item, index) => (
                    <div className={`rh-donation-card ${index % 2 === 0 ? 'rh-card-green' : 'rh-card-orange'}`} key={item._id}>
                      <span className="rh-card-dots">⋮</span>
                      <span className="rh-card-icon">📦</span>
                      <p className="rh-card-packets"><span className="rh-card-number">{item.remainingPackets}</span> packets available</p>
                      <p className="rh-card-line"><span className="rh-line-icon">📞</span> {item.contact}</p>
                      <p className="rh-card-line"><span className="rh-line-icon">📍</span> {item.address}</p>
                      <p className="rh-card-line"><span className="rh-line-icon">🕒</span> {item.duration}</p>
                      <button className="rh-card-delete" onClick={() => removeDonation(item._id)}>🗑️ Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rh-panel">
              <div className="rh-panel-head">
                <h3 className="rh-activity-title">
                  <img src="/images/activity.png" alt="" className="rh-activity-img" />
                  Activity
                </h3>
              </div>
              {recentRequests.length === 0 ? (
                <div className="rh-empty-box">
                  <span className="rh-empty-circle">📝</span>
                  <p>No recent NGO activity yet.</p>
                </div>
              ) : (
                recentRequests.map((item) => (
                  <div className="activity-row" key={item._id}>
                    <img src="/images/activity.png" alt="" className="activity-dot-img" />
                    <p><strong>{item.ngoId?.name || 'An NGO'}</strong> requested {item.requestedPackets} packets</p>
                  </div>
                ))
              )}
            </div>

            <div className="rh-panel rh-impact-card">
              <div className="rh-panel-head">
                <h3 className="rh-activity-title">
                  <img src="/images/Community.png" alt="" className="rh-activity-img" />
                  Your Impact
                </h3>
              </div>
              <div className="rh-impact-body">
                <span className="rh-impact-icon">🌱</span>
                <div className="rh-impact-middle">
                  <p className="rh-impact-line"><span className="rh-impact-number">{totalPacketsShared}</span> packets shared so far.</p>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
                <div className="rh-impact-right">
                  <span className="rh-impact-percent">{progressPercent}%</span>
                  of this month's {monthlyGoal}-packet goal
                </div>
              </div>
              <div className="rh-community-note">
                <span>🌍</span>
                <p>
                  By sharing <strong>{totalPacketsShared}</strong> {totalPacketsShared === 1 ? 'packet' : 'packets'} so far,{' '}
                  {restaurant.name || 'your restaurant'} has kept good food out of the bin and helped local NGOs put a meal on the table for people who needed it most.
                </p>
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
              <input type="text" placeholder="e.g. 123-456-7890" value={contact}
                onChange={(e) => setContact(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input type="text" placeholder="e.g. Mirpur, Dhaka" value={address}
                onChange={(e) => setAddress(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Packets to Donate</label>
              <input type="text" placeholder="e.g. 20" value={packets}
                onChange={(e) => setPackets(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Time Duration</label>
              <input type="text" placeholder="e.g. 2:00 PM - 4:00 PM" value={duration}
                onChange={(e) => setDuration(e.target.value)} />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="btn btn-green" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}

      {showBackWarning && (
        <div className="back-warning-overlay">
          <div className="back-warning-box">
            <button className="back-warning-close" onClick={() => setShowBackWarning(false)}>✕</button>
            <div className="back-warning-icon">🔒</div>
            <h3>Can't Go Back</h3>
            <p>You need to logout to go back.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Restaurant;