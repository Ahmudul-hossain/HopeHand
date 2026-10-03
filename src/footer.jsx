import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-col footer-brand">
          <div className="footer-logo-row">
            <img src="/images/footer.png" alt="HopeHand" className="footer-icon" />
            <div>
              <h4>
                <span className="footer-hope">Hope</span>
                <span className="footer-hand">Hand</span>
              </h4>
              <p className="footer-tagline">Sharing Food, Sharing Hope</p>
            </div>
          </div>
          <p className="footer-desc">
            Connecting restaurants, NGOs, and communities to reduce food
            waste and support people in need.
          </p>
        </div>

        <div className="footer-col">
          <h4><span className="footer-icon-inline">🌿</span> Quick Links
          </h4><Link to="/view-page" className="footer-link"><span className="footer-chevron">›</span> Home</Link>
          <Link to="/how-it-works" className="footer-link"><span className="footer-chevron">›</span> How It Works</Link>
          <Link to="/about-us" className="footer-link"><span className="footer-chevron">›</span> About Us</Link>
        </div>

        <div className="footer-col footer-contact">
         <h4><span className="footer-icon-inline">📞</span> Contact Us</h4>
          <p className="footer-contact-row"><span className="footer-icon-inline">✉</span> hopehand@gmail.com</p>
          <p className="footer-contact-row"><span className="footer-icon-inline">📍</span> Bangladesh</p>
        </div>
      </div>

      <div className="footer-bottom"><p>© 2026 HopeHand. All rights reserved.</p></div>
    </footer>
  );
}

export default Footer;