import { Link } from 'react-router-dom';
function Home() {
  return (
    <>
      <section className="hero-main">
        <img src="/images/first-image.jpg" className="hero-img" />
        <Link to="/RestaurantNGOSelector" className="btn btn-green btn-hero">Get Started →</Link>
      </section>
      <footer className="site-footer">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/how-it-works" className="footer-link">How It Works</Link>
          <Link to="/aboutus" className="footer-link">About Us</Link>
        </div>
      </footer>
    </>
  );
}

export default Home;