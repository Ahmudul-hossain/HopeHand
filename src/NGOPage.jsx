import { Link } from 'react-router-dom';

function NgoDash() {
  const ngo = { name: 'Food For All Foundation' };

  const donations = [
    { id: 1, restaurant: 'Amader Kitchen', contact: '01234567890', address: 'Kallayanpur, Dhaka', packets: 20 },
    { id: 2, restaurant: 'Bismillah Hotel', contact: '01987654321', address: 'Mirpur, Dhaka', packets: 15 },
    { id: 3, restaurant: 'Star Kabab', contact: '01712345678', address: 'Dhanmondi, Dhaka', packets: 12 },
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
            <Link to="/ngopage" className="sidebar-link active">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <Link to="/profileNGO" className="sidebar-link">
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
        
            <h2 className="welcome-name">{ngo.name}</h2>
          </section>
          
          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>Available Food Donations</h3>
                </div>
                <hr className="panel-divider" />
                <table className="donations-table">
                  <thead>
                    <tr>
                      <th>Restaurant Name</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Food Packets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((item) => (
                      <tr key={item.id}>
                        <td>{item.restaurant}</td>
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
export default NgoDash;