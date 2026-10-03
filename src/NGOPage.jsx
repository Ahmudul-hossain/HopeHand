import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearLogin } from "./auth";
import DoorMenu from "./sidebar";
import SettingsMenu from "./SettingsMenu";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";

const CARDS_PER_PAGE = 4;

const HIGHLIGHTS = [
  { icon: "🌿", title: "Less Food Waste", text: "A greener tomorrow" },
  { icon: "🤝", title: "More Support", text: "For those in need" },
  { icon: "❤️", title: "Stronger Community", text: "Together we care" },
];

function isToday(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

function NgoDash() {
  const navigate = useNavigate();
  const { user, logout: clearAuthUser } = useAuth();
  const [showBackWarning, setShowBackWarning] = useState(false);
  const [donations, setDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Carousel
  const totalPages = Math.max(1, Math.ceil(donations.length / CARDS_PER_PAGE));
  const donationPages = [];
  for (let i = 0; i < donations.length; i += CARDS_PER_PAGE) {
    donationPages.push(donations.slice(i, i + CARDS_PER_PAGE));
  }

  const showNextPage = () => setCurrentPage((p) => (p + 1) % totalPages);
  const showPrevPage = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(0);
  }, [totalPages, currentPage]);

  useEffect(() => {
    async function fetchDonations() {
      try {
        const res = await fetch("http://localhost:4000/donations", {
          credentials: "include",
        });
        const data = await res.json();
        setDonations(data.donations || []);
      } catch (err) {
        setDonations([]);
      }
    }
    fetchDonations();
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://localhost:4000/requests/history/ngo", {
          credentials: "include",
        });
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        setHistory([]);
      }
    }
    fetchHistory();
  }, []);

  // Block browser back button
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    function handlePopState() {
      window.history.pushState(null, "", window.location.href);
      setShowBackWarning(true);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Stats
  const availablePackets = donations.reduce(
    (sum, item) => sum + Number(item.remainingPackets || 0),
    0
  );
  const activeDonors = new Set(
    donations.map((item) => item.restaurantId?._id).filter(Boolean)
  ).size;
  const claimedToday = history.filter((item) => isToday(item.updatedAt)).length;
  const mealsServed = history.reduce(
    (sum, item) => sum + Number(item.requestedPackets || 0),
    0
  );

  const stats = [
    { label: "AVAILABLE PACKETS", icon: "🥡", iconClass: "icon-green", value: availablePackets, sub: "↑ Ready for collection", subClass: "sub-green" },
    { label: "ACTIVE DONORS", icon: "🍴", iconClass: "icon-orange", value: activeDonors, sub: "Across Mirpur & Dhaka", subClass: "sub-orange" },
    { label: "CLAIMED TODAY", icon: "✅", iconClass: "icon-green", value: claimedToday, sub: "✓ Meals rescued", subClass: "sub-green" },
    { label: "MEALS SERVED", icon: "❤️", iconClass: "icon-orange", value: mealsServed, sub: "Community impact", subClass: "sub-orange" },
  ];

  async function handleLogout() {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) { }

    clearLogin();
    clearAuthUser();
    navigate("/log-in", { state: { role: "ngo" }, replace: true });
  }

  return (
    <>
      <header className="navbar">
        <div className="logo">
          <img src="/images/logo-icon.png" alt="HopeHand logo" />

          <div className="logo-text">
            <h1>
              <span className="hope">Hope</span>
              <span className="hand">Hand</span>
            </h1>
            <p>Sharing Food, Sharing Hope</p>
          </div>
        </div>

        <div className="navbar-right">
          <Link to="/pro-ngo" className="navbar-profile-btn" aria-label="Go to profile">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
            </svg>
          </Link>

          <SettingsMenu />

          <DoorMenu>
            <Link to="/ngo-page" className="sidebar-link active">
              <span className="sidebar-icon">🏠</span>
              Home
            </Link>

            <Link to="/pro-ngo" className="sidebar-link">
              <span className="sidebar-icon">👤</span>
              Profile
            </Link>

            <Link to="/food-requests" className="sidebar-link">
              <span className="sidebar-icon">🍱</span>
              Food Requests
            </Link>

            <Link to="/history-page" className="sidebar-link">
              <span className="sidebar-icon">📜</span>
              History
            </Link>

            <Link to="/how-it-works" state={{ role: "ngo" }} className="sidebar-link">
              <span className="sidebar-icon">⚙️</span>
              How It Works
            </Link>

            <Link to="/about-us" state={{ role: "ngo" }} className="sidebar-link">
              <span className="sidebar-icon">ℹ️</span>
              About Us
            </Link>

            <a
              href="#"
              className="sidebar-link logout-link"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <span className="sidebar-icon">↪️</span>
              Logout
            </a>
          </DoorMenu>
        </div>
      </header>

      <main className="ngo-page">
        {/* Hero: banner image with text, glass boxes and the dashboard stats */}
        <section className="ngo-hero">
          <div className="ngo-container ngo-hero-inner">
            <div className="ngo-hero-text">
              <h2>Welcome, {user?.name || "NGO"}! 👋</h2>
              <p>
                Claim surplus food from local restaurants and bring hope to
                those in need.
              </p>
            </div>

            <div className="ngo-hero-highlights">
              {HIGHLIGHTS.map((item) => (
                <div className="highlight-card" key={item.title}>
                  <span className="highlight-icon">{item.icon}</span>
                  <div className="highlight-text">
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ngo-container ngo-hero-dash">
            <span className="ngo-dash-badge">NGO Portal</span>
            <h2>NGO Dashboard</h2>

            <div className="ngo-stats-row">
              {stats.map((stat) => (
                <div className="ngo-stat-card" key={stat.label}>
                  <div className="ngo-stat-top">
                    <span className="ngo-stat-label">{stat.label}</span>
                    <span className={`ngo-stat-icon ${stat.iconClass}`}>{stat.icon}</span>
                  </div>

                  <div className="ngo-stat-number">{stat.value}</div>

                  <span className={`ngo-stat-sub ${stat.subClass}`}>{stat.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donations: heading on the left, cards in a grid */}
        <section className="ngo-section ngo-section-donations">
          <div className="ngo-container">
            <div className="ngo-donations-grid">
              <div className="ngo-donations-intro">
                <p className="ngo-intro-tag">
                  <img src="/images/leaf.jpeg" alt="" />
                  Available Food Donations
                </p>
                <h2>Fresh Surplus Food from NGOs</h2>
                <p className="ngo-intro-text">
                  Fresh surplus food from local restaurants, ready to be
                  claimed and shared with those in need.
                </p>
                <span className="ngo-intro-line"></span>
              </div>

              {donations.length === 0 ? (
                <div className="empty-state ngo-empty">
                  <div className="empty-icon">📭</div>
                  <p>No food donations right now.</p>
                </div>
              ) : (
                donations.map((item) => (
                  <div className="food-card" key={item._id}>
                    <div className="food-card-top">
                      <div>
                        <span className="food-card-name">
                          {item.restaurantId?.name || "N/A"}
                        </span>
                        <span className="food-card-badge">Available</span>
                      </div>

                      <div className="food-card-packets">
                        <span className="food-card-packets-number">
                          {item.remainingPackets}
                        </span>
                        <span className="food-card-packets-label">packets</span>
                      </div>
                    </div>

                    <p className="food-card-location">
                      📍 {item.address || "N/A"}
                    </p>

                    <hr className="food-card-divider" />

                    <div className="food-card-row">
                      <span>⏰ Expiry:</span>
                      <span>{item.duration || "N/A"}</span>
                    </div>

                    <div className="food-card-row">
                      <span>📞 Contact:</span>
                      <span>{item.contact || "N/A"}</span>
                    </div>

                    <button
                      className="btn btn-green food-card-claim"
                      onClick={() => navigate("/food-requests")}
                    >
                      <img src="/images/Donation.jpeg" alt="" className="claim-icon" />
                      Claim Donation
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {showBackWarning && (
        <div className="back-warning-overlay">
          <div className="back-warning-box">
            <button
              className="back-warning-close"
              onClick={() => setShowBackWarning(false)}
            >
              ✕
            </button>

            <div className="back-warning-icon">🔒</div>
            <h3>Can't Go Back</h3>
            <p>You need to logout to go back.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default NgoDash;