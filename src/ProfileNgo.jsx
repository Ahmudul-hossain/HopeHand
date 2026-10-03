import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearLogin } from './auth';
import DoorMenu from './sidebar';
import Footer from './Footer';
import { useAuth } from './AuthContext'; // NOTUN

const contactRegex = /^0\d{10}$/;

const FIELDS = [
  { name: "name", label: "NGO / Organization Name", type: "text" },
  { name: "contact", label: "Contact No", type: "text", inputMode: "numeric", maxLength: 11 },
  { name: "email", label: "Email Address", type: "email" },
  { name: "address", label: "Address", type: "text" },
];

function ProfileNgo() {
  const navigate = useNavigate();
  const { logout: clearAuthUser } = useAuth(); // NOTUN
  const [ngo, setNgo] = useState({ name: "", contact: "", email: "", address: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  /*Bipasha*/
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setNgo(data.user);
        }
      } catch (err) { }
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "contact") {
      setNgo({ ...ngo, contact: value.replace(/\D/g, "").slice(0, 11) });
      setContactError("");
      return;
    }

    setNgo({ ...ngo, [name]: value });
  }

  function handleSave() {
    if (!contactRegex.test(ngo.contact)) {
      setContactError("Contact number must be 11 digits and start with 0.");
      return;
    }

    setContactError("");
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  }

  /*misty*/
  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // backend na thakleo frontend theke logout hoye jabe
    }
    clearLogin();
    clearAuthUser(); // NOTUN
    navigate('/log-in', { state: { role: 'ngo' }, replace: true });
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

        <DoorMenu>
          <Link to="/ngo-page" className="sidebar-link"><span className="sidebar-icon">🏠</span> Home</Link>
          <Link to="/pro-ngo" className="sidebar-link active"><span className="sidebar-icon">👤</span> Profile</Link>
          <Link to="/food-requests" className="sidebar-link"> <span className="sidebar-icon">🍱</span>Food Requests</Link>
          <Link to="/history-page" className="sidebar-link"><span className="sidebar-icon">📜</span>History</Link>
          <Link to="/how-it-works" state={{ role: 'ngo' }} className="sidebar-link"><span className="sidebar-icon">⚙️</span> How It Works</Link>
          <Link to="/about-us" state={{ role: 'ngo' }} className="sidebar-link"><span className="sidebar-icon">ℹ️</span>About Us </Link>
          <a href="#" className="sidebar-link logout-link" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            <span className="sidebar-icon">↪️</span>Logout
          </a>
        </DoorMenu>
      </header>

          <section className="hero">
        <img src="/images/NGO_LOGO.jpg" alt="NGO logo" className="team-icon" />
        <h2>NGO <span className="brand-green">Details</span></h2>
        <div className="divider"></div>
      </section>

      <section className="registration-form">
        <form onSubmit={(e) => { e.preventDefault(); if (isEditing) handleSave(); }}>
          {FIELDS.map(({ name, label, ...inputProps }) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                {...inputProps}
                id={name}
                name={name}
                value={ngo[name]}
                onChange={handleChange}
                readOnly={!isEditing}
              />
              {name === "contact" && contactError && (
                <p style={{ color: "red" }}>{contactError}</p>
              )}
            </div>
          ))}

          {!isEditing ? (
            <button type="button" className="btn btn-green" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button type="button" className="btn btn-orange" onClick={handleSave}>
              Save Profile
            </button>
          )}
        </form>
      </section>

      {showSuccess && (
        <div className="success-popup">
          <div className="success-tick">✓</div>
          <p>Profile saved successfully!</p>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProfileNgo;