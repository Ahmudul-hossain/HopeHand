import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('needed to give email and pass both');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const actualDestination = data.user.role === 'ngo' ? '/ngopage' : '/restaurant';
      navigate(actualDestination);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
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
      </header>

      <section className="hero">
        <h2><span className="brand-green">Login</span></h2>
        <div className="divider"></div>
      </section>

      <section className="registration-form">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. resturantname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="e.g. ********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-green" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/registration-page" state={{ role }} className="brand-green">Register</Link>
          </p>
        </form>
      </section>
    </>
  );
}

export default Login;