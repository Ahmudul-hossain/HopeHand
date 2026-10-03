import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setLoggedIn } from './auth';
import { useAuth } from './AuthContext';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role;
  const { login: setAuthUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

      const actualDestination = data.user.role === 'ngo' ? '/ngo-page' : '/home-page';
      setLoggedIn(data.user.role);
      setAuthUser(data.user);
      setShowSuccess(true);

      setTimeout(() => {
        navigate(actualDestination, { replace: true });
      }, 1800);
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
        <div className="navbar-actions">
          <Link to="/res-ngo-selector" className="nav-login-btn">
           Register
         </Link>
         <Link to="/view-page" className="nav-login-btn">
           Home
         </Link>
       </div>
      </header>

      <section className="hero">
        <h2><span className="brand-green">{role === 'ngo' ? 'NGO ' : role === 'restaurant' ? 'Restaurant ' : ''}Login</span></h2>
        <div className="divider"></div>
      </section>

      <section className="registration-form">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder={role === 'ngo' ? 'e.g. ngo@gmail.com' : role === 'restaurant' ? 'e.g. restaurant@gmail.com' : 'e.g. name@gmail.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="e.g. ********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-green" disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/res-ngo-selector" className="brand-green">Register</Link>
          </p>
        </form>
      </section>

      {showSuccess && (
        <div className="success-popup">
          <div className="success-tick">✓</div>
          <p>Successfully logged in!</p>
        </div>
      )}
    </>
  );
}

export default Login;