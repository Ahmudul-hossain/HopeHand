import { Link } from 'react-router-dom';

function RoleSelector() {
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
        <div className="dashboard-content">
          <section className="hero">
            <h2>Join <span className="brand-green">HopeHand</span></h2>
            <p>Choose your role to Register</p>
            <div className="divider"></div>
          </section>
          <section className="card-container">
            <div className="card card-resturant">
              <div className="card-icon">🍽️</div>
              <h3>Resturant</h3>
              <p>Donate leftover food</p>
              <Link to="/registration" state={{ role: 'restaurant' }} className="btn btn-green">Continue as Restaurant →</Link>
            </div>
            <div className="card card-ngo">
              <div className="card-icon">👥</div>
              <h3>NGO/Otherts</h3>
              <p>Receive foord for those in need</p>
              <Link to="/registration" state={{ role: 'ngo' }} className="btn btn-orange">Continue as NGO/Others →</Link>
            </div>
          </section>
        </div>
      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Connecting restaurants with NGOs to reduce food waste and help communities.</p>
        </div>
        <div className="footer-col">
        </div>
      </footer>
    </>
  );
}
export default RoleSelector;