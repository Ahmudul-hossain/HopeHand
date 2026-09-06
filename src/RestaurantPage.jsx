import { useState } from 'react';
import { Link } from 'react-router-dom';

function Restaurant() {
const [history, setHistory] = useState([
    { id: 1, ngo: 'Helping Hands NGO', contact: '01234567890', address: 'Mirpur, Dhaka', packets: 25 },
    { id: 2, ngo: 'Bright Future Foundation', contact: '01234567890', address: 'Dhanmondi, Dhaka', packets: 18 },
    { id: 3, ngo: 'Food for All', contact: '01234567890', address: 'Uttara, Dhaka', packets: 30 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [packets, setPackets] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [availableDonations, setAvailableDonations] = useState([]);
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

  function handleConfirm() {
    if (
      contact.trim() === '' ||address.trim() === '' ||packets.trim() === '' ||duration.trim() === ''
    ) {
      setError('needed to fill up all the boxes');
      return;
    }
    const newDonation = {
      id: Date.now(),
      contact: contact,
      address: address,
      packets: packets,
      duration: duration,
    };

    setAvailableDonations([...availableDonations, newDonation]);
    closeModal();
  }
  function removeDonation(id) {
    setAvailableDonations(availableDonations.filter((item) => item.id !== id));
  }
  function removeHistoryItem(id) {
    setHistory(history.filter((item) => item.id !== id));
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
            <Link to="/homepage" className="sidebar-link active">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <a href="#" className="sidebar-link" onClick={openModal}>
              <span className="sidebar-icon">➕</span>Add Food Donation
            </a>
            <Link to="/profileRes" className="sidebar-link">
              <span className="sidebar-icon">👤</span>Profile
            </Link>
            <Link to="/how-it-works" className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>How It Works
            </Link>
            <Link to="/aboutus" className="sidebar-link">
              <span className="sidebar-icon">ℹ️</span>About Us
            </Link>
            <Link to="/" className="sidebar-link logout-link">
              <span className="sidebar-icon">↪️</span>Logout
             </Link>
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
                  <h3>Available Donations</h3>
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
                        <td colSpan="5">No donations added yet.</td>
                      </tr>
                    ) : (
                      availableDonations.map((item) => (
                        <tr key={item.id}>
                          <td>{item.contact}</td>
                          <td>{item.address}</td>
                          <td>{item.packets}</td>
                          <td>{item.duration}</td>
                          <td>
                            <button className="delete-btn" onClick={() => removeDonation(item.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>My History</h3>
                </div>
                <hr className="panel-divider" />
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>NGO Name</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Packets Donated</th>
                       <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.ngo}</td>
                        <td>{item.contact}</td>
                        <td>{item.address}</td>
                        <td>{item.packets}</td>
                        <td>
                           <button className="delete-btn" onClick={() => removeHistoryItem(item.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
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
      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
      </footer>
    </>
  );
}
export default Restaurant;