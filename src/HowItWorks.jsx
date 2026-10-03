import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRole, clearLogin } from './auth';
import DoorMenu from './sidebar';
import Footer from './Footer';

function HowItWorks() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role || getRole();
  const backTo = role === 'restaurant' ? '/home-page' : role === 'ngo' ? '/ngo-page' : null;

  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
    }
    clearLogin();
    navigate('/log-in', { state: { role }, replace: true });
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
        {backTo ? (
          <div className="navbar-actions">
            <Link to={backTo} className="back-toggle" aria-label="Back to dashboard">
              <img src="/images/back-button.png" alt="" />
            </Link>
            <DoorMenu>
              {role === 'restaurant' ? (
                <>
                  <Link to="/home-page" className="sidebar-link"><span className="sidebar-icon">🏠</span>Home</Link>
                  <Link to="/home-page" className="sidebar-link"><span className="sidebar-icon">➕</span>Add Food Donation</Link>
                  <Link to="/pro-res" className="sidebar-link"><span className="sidebar-icon">👤</span>Profile</Link>
                  <Link to="/ngo-requests" className="sidebar-link"><span className="sidebar-icon">📩</span>NGO Requests</Link>
                  <Link to="/res-history" className="sidebar-link"><span className="sidebar-icon">📜</span>History</Link>
                  <Link to="/how-it-works" state={{ role: 'restaurant' }} className="sidebar-link active"><span className="sidebar-icon">⚙️</span>How It Works</Link>
                  <Link to="/about-us" state={{ role: 'restaurant' }} className="sidebar-link"><span className="sidebar-icon">ℹ️</span>About Us</Link>
                </>
              ) : (
                <>
                  <Link to="/ngo-page" className="sidebar-link"><span className="sidebar-icon">🏠</span>Home</Link>
                  <Link to="/pro-ngo" className="sidebar-link"><span className="sidebar-icon">👤</span>Profile</Link>
                  <Link to="/food-requests" className="sidebar-link"><span className="sidebar-icon">🍱</span>Food Requests</Link>
                  <Link to="/history-page" className="sidebar-link"><span className="sidebar-icon">📜</span>History</Link>
                  <Link to="/how-it-works" state={{ role: 'ngo' }} className="sidebar-link active"><span className="sidebar-icon">⚙️</span>How It Works</Link>
                  <Link to="/about-us" state={{ role: 'ngo' }} className="sidebar-link"><span className="sidebar-icon">ℹ️</span>About Us</Link>
                </>
              )}
              <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                <span className="sidebar-icon">↪️</span>Logout
              </a>
            </DoorMenu>
          </div>
        ) : (
          <div className="navbar-actions">
            <Link to="/reg-page" className="nav-login-btn">Register</Link>
            <Link to="/log-in" className="nav-login-btn">Log in</Link>
            <Link to="/view-page" className="nav-login-btn">Home</Link>
            <Link to="/about-us" className="nav-login-btn">About Us</Link>
          </div>
        )}
      </header>

      <section className="hiw-logo-section">
        <img src="/images/new-logo.png" alt="HopeHand" className="hiw-new-logo" />
        <h2 className="hiw-title">
          How <span className="hope">Hope</span><span className="hand">Hand</span> Works
        </h2>
      </section>

      <div className="how-it-works-diagram">
        <div className="how-step-row">
          <div className="how-step-box">
            <img src="/images/tree.png" alt="Get Started" className="how-step-icon" />
            <h4>Get Started</h4>
            <p>Explore what HopeHand is all about and begin your journey.</p>
          </div>
          <div className="how-step-box">
            <img src="/images/user.png" alt="Register" className="how-step-icon" />
            <h4>Register</h4>
            <p>Create your account with just a few details.</p>
          </div>
          <div className="how-step-box">
            <img src="/images/lock.png" alt="Login" className="how-step-icon" />
            <h4>Login</h4>
            <p>Access your account and explore the community.</p>
          </div>
          <div className="how-step-box">
            <img src="/images/people-love.png" alt="Profile Created" className="how-step-icon" />
            <h4>Your Profile Has Been Created</h4>
            <p>Now you're ready to share and make a difference!</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
export default HowItWorks;