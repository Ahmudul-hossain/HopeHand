import { useEffect, useRef, useState } from 'react';

function DoorMenu({ children }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    function closeWithEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', closeWithEscape);
    return () => window.removeEventListener('keydown', closeWithEscape);
  }, []);

  useEffect(() => {
    drawerRef.current?.toggleAttribute('inert', !open);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`door-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className="door-white"></span>
        <span className="door-half door-left"></span>
        <span className="door-half door-right"></span>
        <span className="door-knob">
          <img src="/images/side-bar-icon.png" alt="" />
        </span>
      </button>

      {open && (
        <div
          className="door-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <aside ref={drawerRef} className={`door-drawer ${open ? 'open' : ''}`}>
        <nav className="sidebar-nav" onClick={() => setOpen(false)}>
          {children}
        </nav>
      </aside>
    </>
  );
}

export default DoorMenu;