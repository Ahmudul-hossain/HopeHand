import { Link } from 'react-router-dom';
import Footer from './Footer';

function ResturantNGOSelector() {
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

        {/* Log In button in the top-right header */}
        <div className="navbar-actions">
          <div className="navbar-actions selector-nav">
          <Link to="/log-in" state={{ role: 'restaurant' }} className="nav-login-btn">Log in as Restaurant</Link>
          <Link to="/log-in" state={{ role: 'ngo' }} className="nav-login-btn">Log in as NGO</Link>
          <Link to="/view-page" className="nav-login-btn">Home</Link>
          <Link to="/how-it-works" className="nav-login-btn">How It Works</Link>
          <Link to="/about-us" className="nav-login-btn">About Us</Link>
       </div>
       </div>
      </header>

      <div className="dashboard-content">
        <section className="hero">
          <h2>Join <span className="brand-green">Hope</span><span className="hand">Hand</span></h2>
          <p>Be a part of a kind community that connects food with people in need.</p>
          <div className= "divider"></div>
        </section>

        {/* Role Cards */}
        <section className="card-container">
          {/* Restaurant Block */}
          <div className="card card-resturant">
            <div className="card-icon icon-restaurant">
              <img src="/images/Restaurent.png" alt="Restaurant icon" />
            </div>
            <h3>Restaurant</h3>
            <p>Donate leftover food and make a difference.</p>
            <Link to="/reg-page" state={{ role: 'restaurant' }} className="btn btn-green" >Continue as Restaurant → </Link>
          </div>

          {/* NGO / Others Block */}
          <div className="card card-ngo">
            <div className="card-icon icon-ngo">
              <img src="/images/Ngo.png" alt="NGO icon" />
            </div>
            <h3>NGO/Others</h3>
            <p>Receive food for those in need.</p>
            <Link
              to="/reg-page"
              state={{ role: 'ngo' }}
              className="btn btn-orange"
            >
              Continue as NGO/Others →
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default ResturantNGOSelector;