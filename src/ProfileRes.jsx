import { Link } from 'react-router-dom';

function ProfileRes() {
  const restaurant = {
    name: 'Amader Kitchen',
    contact: '1234567890',
    email: 'amar@gmail.com',
    address: '123 Kallaynpur',
  };
  
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
            <Link to="/restaurant" className="sidebar-link">
              <span className="sidebar-icon">🏠</span>Home
            </Link>
            <Link to="/homepage" className="sidebar-link">
              <span className="sidebar-icon">➕</span>Add Food Donation
            </Link>
            <Link to="/profileRes" className="sidebar-link active">
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
            <h2 className="welcome-name">{restaurant.name}</h2>
          </section>

          <section className="content-columns">
            <div className="main-column">
              <div className="donations-panel">
                <div className="panel-header">
                  <h3>Resturant Details</h3>
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
      </footer>
    </>
  );
}

export default ProfileRes;