import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRole, clearLogin } from './auth';
import DoorMenu from './sidebar';
import Footer from './Footer';

const TEAM = [
  { initial: 'M', name: 'Sadia Ismail Misty', id: '00724105101134', email: 'sadia.cse.00724105101134@aust.edu' },
  { initial: 'B', name: 'Monjila Akter Bipasha', id: '00724105101148', email: 'monjila.cse.00724105101148@aust.edu' },
  { initial: 'A', name: 'Ahmudul Hossain', id: '00724105101146', email: 'ahmudul.cse.00724105101146@aust.edu' },
];

function AboutUs() {
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
                  <Link to="/how-it-works" state={{ role: 'restaurant' }} className="sidebar-link"><span className="sidebar-icon">⚙️</span>How It Works</Link>
                  <Link to="/about-us" state={{ role: 'restaurant' }} className="sidebar-link active"><span className="sidebar-icon">ℹ️</span>About Us</Link>
                </>
              ) : (
                <>
                  <Link to="/ngo-page" className="sidebar-link"><span className="sidebar-icon">🏠</span>Home</Link>
                  <Link to="/pro-ngo" className="sidebar-link"><span className="sidebar-icon">👤</span>Profile</Link>
                  <Link to="/food-requests" className="sidebar-link"><span className="sidebar-icon">🍱</span>Food Requests</Link>
                  <Link to="/history-page" className="sidebar-link"><span className="sidebar-icon">📜</span>History</Link>
                  <Link to="/how-it-works" state={{ role: 'ngo' }} className="sidebar-link"><span className="sidebar-icon">⚙️</span>How It Works</Link>
                  <Link to="/about-us" state={{ role: 'ngo' }} className="sidebar-link active"><span className="sidebar-icon">ℹ️</span>About Us</Link>
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
            <Link to="/how-it-works" className="nav-login-btn">How It Works</Link>
          </div>
        )}
      </header>

      <main className="au-page">
        <section className="au-hero">
          <img src="/images/team.png" alt="Our Team" className="au-hero-icon" />
          <h2>Meet Our <span className="brand-green">Team</span></h2>
          <div className="divider"></div>
          <p>The students behind HopeHand, built for CSE-2200 at AUST.</p>
        </section>

               <section className="au-grid">
          {TEAM.map((member) => (
            <article className="au-card" key={member.id}>
              <div className="au-avatar">{member.initial}</div>
              <p className="au-name">Name : {member.name}</p>
              <p className="au-line">ID : {member.id}</p>
              <p className="au-line">Email : {member.email}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
export default AboutUs;