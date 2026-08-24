import { Link } from 'react-router-dom';

function Restaurant() {
  const history = [
    { id: 1, ngo: 'Helping Hands NGO', contact: '01234567890', address: 'Mirpur, Dhaka', packets: 25 },
    { id: 2, ngo: 'Bright Future Foundation', contact: '01234567890', address: 'Dhanmondi, Dhaka', packets: 18 },
    { id: 3, ngo: 'Food for All', contact: '01234567890', address: 'Uttara, Dhaka', packets: 30 },
  ];
  
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
            <a href="#" className="sidebar-link" onClick={(e) => e.preventDefault()}>
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
            <a href="#" className="sidebar-link logout-link" onClick={(e) => e.preventDefault()}>
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
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.ngo}</td>
                        <td>{item.contact}</td>
                        <td>{item.address}</td>
                        <td>{item.packets}</td>
                      </tr>
                    ))}
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
      </footer>
    </>
  );
}

export default Restaurant;