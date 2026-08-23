import { Link, useLocation } from 'react-router-dom';

function Registration() {
  const location = useLocation();
  const role = location.state?.role; 
  const isNgo = role === 'ngo';
  const nameLabel = isNgo ? 'NGO / Organization Name' : 'Restaurant Name';
  const namePlaceholder = isNgo ? 'e.g. Food For All Foundation' : 'e.g. Green Leaf Restaurant';
  const heroTitle = isNgo ? 'NGO/Others' : 'Registration';
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
      <section className="hero">
        <h2><span className="brand-green">{heroTitle}</span></h2>
      
        <div className="divider"></div>
      </section>
      <section className="registration-form">
        <form>
          <div className="form-group">
            <label htmlFor="name">{nameLabel}</label>
            <input type="text" id="name" name="name" placeholder={namePlaceholder} required />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact No</label>
            <input type="text" id="contact" name="contact" placeholder="e.g. 1234567890" required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" placeholder="e.g. 123, Kallyanpur" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="e.g. janina@gmail.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter a password" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" required />
          </div>
          <Link to="/login" state={{ role: role }} className="btn btn-green" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }} >
            Create →
          </Link>
        </form>
      </section>
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
export default Registration;