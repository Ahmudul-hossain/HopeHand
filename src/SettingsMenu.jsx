import { useState, useEffect } from 'react';

function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [activeBox, setActiveBox] = useState(null); // 'complain' | 'help' | null

  // login kora user er role: 'restaurant' ba 'ngo'
  const [role, setRole] = useState('');
  const [targetName, setTargetName] = useState('');
  const [complainText, setComplainText] = useState('');
  const [complainMsg, setComplainMsg] = useState('');

  // restaurant hole NGO er name, NGO hole Restaurant er name complain korbe
  const targetLabel = role === 'ngo' ? 'Restaurant' : 'NGO';

  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setRole(data.user.role);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchRole();
  }, []);

  function openBox(box) {
    setActiveBox(box);
    setOpen(false);
  }

  function closeModal() {
    setActiveBox(null);
    setComplainMsg('');
  }

  async function handleSubmitComplain() {
    if (targetName.trim() === '' || complainText.trim() === '') {
      setComplainMsg('Please fill both fields');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetName, message: complainText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setComplainMsg(data.error || 'Something went wrong');
        return;
      }
      setComplainMsg('Complaint submitted!');
      setTargetName('');
      setComplainText('');
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setComplainMsg('Server error, try again');
    }
  }

  return (
    <>
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Settings"
      >
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
        <span className="settings-dot"></span>
      </button>

      {open && (
        <div className="door-backdrop" onClick={() => setOpen(false)} aria-hidden="true"></div>
      )}

      <aside className={`door-drawer settings-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <h3 className="settings-drawer-title">⚙️ Settings</h3>
        <div className="settings-options">
          <button type="button" className="settings-option-box" onClick={() => openBox('complain')}>
            <span className="settings-option-icon">📝</span>
            <span className="settings-option-title">Complain Box</span>
            <span className="settings-option-desc">Report an issue with any {targetLabel}</span>
          </button>

          <button type="button" className="settings-option-box" onClick={() => openBox('help')}>
            <span className="settings-option-icon">❓</span>
            <span className="settings-option-title">Help &amp; Support</span>
            <span className="settings-option-desc">Get help using HopeHand</span>
          </button>
        </div>
        <p className="settings-drawer-footer">HopeHand · Sharing Food, Sharing Hope</p>
      </aside>

      {activeBox === 'complain' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2>📝 Complain Box</h2>

            <div className="form-group">
              <label>{targetLabel} Name</label>
              <input
                type="text"
                placeholder={`Which ${targetLabel} is this about?`}
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Your Complaint</label>
              <textarea
                rows="4"
                placeholder="Describe what happened..."
                value={complainText}
                onChange={(e) => setComplainText(e.target.value)}
              ></textarea>
            </div>

            {complainMsg && (
              <p style={{ color: complainMsg === 'Complaint submitted!' ? '#1a7a3c' : 'red', marginBottom: '10px' }}>
                {complainMsg}
              </p>
            )}

            <button className="btn btn-green" onClick={handleSubmitComplain}>Submit Complaint</button>
          </div>
        </div>
      )}

      {activeBox === 'help' && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2>❓ Help &amp; Support</h2>
            <p style={{ marginBottom: '16px', color: '#555' }}>
              Need help using HopeHand? Reach out to us:
            </p>
            <div className="form-group">
              <label>Email</label>
              <p>support@hopehand.com</p>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <p>+880 1XXXXXXXXX</p>
            </div>
            <button className="btn btn-green" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsMenu;