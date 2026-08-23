import { Link } from 'react-router-dom';

function AboutUs() {
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
      <div className="page-container">
        <section className="section-heading">
          <h2>Meet Our Team</h2>
          <div className="divider"></div>
        </section>
        <div className="team-grid">
          <div className="team-card">
             <div className="team-avatar-placeholder">M</div>
            <div className="team-info">
              <p className="team-name">Name : Sadia Ismail Misty</p>
              <p className="team-role">ID : 00724105101134</p>
              <p className="team-email">Email : sadia.cse.00724105101134@aust.edu</p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-avatar-placeholder">B</div>
            <div className="team-info">
              <p className="team-name">Name : Monjila Akter Bipasha</p>
              <p className="team-role">ID : 00724105101148</p>
              <p className="team-email">Email : monjila.cse.00724105101148@aust.edu</p>
            </div>
          </div>
          <div className="team-card">
            <div className="team-avatar-placeholder">A</div>
            <div className="team-info">
              <p className="team-name">Name : Ahmudul Hossain</p>
              <p className="team-role">ID : 00724105101146</p>
              <p className="team-email">Email : ahmudul.cse.00724105101146@aust.edu</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/how-it-works" className="footer-link">How It Works</Link>
        </div>
      </footer>
    </>
  );
}
export default AboutUs;