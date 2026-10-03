import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Registration() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role ?? 'ngo';
  const isNgo = role === 'ngo';
  const nameLabel = isNgo ? 'NGO / Organization Name' : 'Restaurant Name';
  const namePlaceholder = isNgo ? 'e.g. Food For All Foundation' : 'e.g. Green Leaf Restaurant';
  const heroTitle = isNgo ? 'NGO / Organization' : 'Restaurant';

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, contact, address, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setShowSuccess(true);

      setTimeout(() => { navigate('/log-in', { state: { role } }); }, 2000);
    } catch (err) { setError('Something went wrong. Please try again.'); setLoading(false); } }

  return (
    <>
      <header className="navbar">
        <div className="logo"> <img src="/images/logo-icon.png" alt="HopeHand logo" />
          <div className="logo-text">
            <h1><span className="hope">Hope</span><span className="hand">Hand</span></h1>
            <p>Sharing Food, Sharing Hope</p> </div> </div>

      <div className="navbar-actions"> <Link to="/log-in" state={{ role }} className="nav-login-btn"> Log in </Link>
        <Link to="/view-page" className="nav-login-btn"> Home </Link> </div> </header>

      <section className="hero">
     <h2>{heroTitle} <span className="brand-green">Registration</span></h2>
     <div className="divider"></div> </section>

    <section className="registration-form">
      <form onSubmit={handleRegister}> <div className="form-group">
        <label htmlFor="name">{nameLabel}</label>
          <input type="text" id="name" placeholder={namePlaceholder} value={name} 
              onChange={(e) => setName(e.target.value)} required /> </div>

        <div className="form-group"> <label htmlFor="contact">Contact No</label>
          <input type="text" id="contact" placeholder="e.g. 1234567890" value={contact}
              onChange={(e) => setContact(e.target.value)} required /> </div>

        <div className="form-group"> <label htmlFor="address">Address</label>
          <input type="text" id="address" placeholder="e.g. 123, Kallyanpur" value={address}
              onChange={(e) => setAddress(e.target.value)} required /> </div>

        <div className="form-group"> <label htmlFor="email">Email Address</label>
          <input type="email" id="email" placeholder={isNgo ? 'e.g. ngo@gmail.com' : 'e.g. restaurant@gmail.com'} value={email}
              onChange={(e) => setEmail(e.target.value)} required /> </div>

        <div className="form-group"> <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input type={showPassword ? 'text' : 'password'} id="password" placeholder="Enter a password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              <EyeIcon open={showPassword} />
            </button>
          </div> </div>

        <div className="form-group"> <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-wrap">
            <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" placeholder="Re-enter your password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}>
              <EyeIcon open={showConfirm} />
            </button>
          </div> </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="btn btn-green" disabled={loading}>
            {loading ? 'Creating...' : 'Create →'} </button>

           <p style={{ marginTop: '1rem', textAlign: 'center' }}>Already have an account?{' '}
          <Link to="/log-in" state={{ role }} className="brand-green">Login</Link> </p> </form> </section>

    {showSuccess && ( <div className="success-popup"> <div className="success-tick">✓</div>
        <p>Your registration is complete, thanks for joining HopeHand!</p> </div>
    )}
    </>
  );
}
export default Registration;