import { Link, useLocation } from 'react-router-dom';

function Login() {
  const location = useLocation();
  const role = location.state?.role; 
  const destination = role === 'ngo' ? '/ngopage' : '/restaurant';

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
        <h2><span className="brand-green">Login</span></h2>
        <div className="divider"></div>
      </section>

      <section className="registration-form">
        <form>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="e.g. resturantname@gmail.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="e.g. ********" required />
          </div>
          <Link to={destination} className="btn btn-green">Login →</Link>
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

export default Login;