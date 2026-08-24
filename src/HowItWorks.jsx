import { Link } from 'react-router-dom';

function HowItWorks() {
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
        <h2>How It <span className="brand-green">Works</span></h2>
        <div className="divider"></div>
      </section>
<div className="how-it-works-diagram">
  <div className="how-step step-started">Get Started</div>
  <div className="how-arrow how-arrow-h arrow-h1">→</div>
  <div className="how-step step-register">Register</div>

  <div className="how-arrow how-arrow-v arrow-v1">↓</div>
  <div className="how-arrow how-arrow-v arrow-v2">↓</div>

  <div className="how-step step-profile">Your profile<br />has been created</div>
  <div className="how-arrow how-arrow-h arrow-h2">←</div>
  <div className="how-step step-login">Login</div>
</div>
  
      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/aboutus" className="footer-link">About Us</Link>
        </div>
      </footer>
    </>
  );
}
export default HowItWorks;