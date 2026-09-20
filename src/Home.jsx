import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const steps = [
    {
      icon: "/images/res-pic.png",
      title: "Restaurants share",
      text: "Local food businesses tell us when good surplus food is ready."
    },
    {
      icon: "/images/car-icon.png",
      title: "We collect",
      text: "HopeHand volunteers pick it up safely and quickly."
    },
    {
      icon: "/images/ngo-pic.png",
      title: "NGOs receive",
      text: "Trusted community partners get the food ready to share."
    },
    {
      icon: "/images/icon1.png",
      title: "Community enjoys",
      text: "Families and neighbors get a warm, nourishing meal."
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  function showNextStep() {
    setCurrentStep((currentStep + 1) % steps.length);
  }

  function showPrevStep() {
    setCurrentStep((currentStep - 1 + steps.length) % steps.length);
  }

  return (
    <>
       <section className="home-hero">
        <div className="home-hero-content">
        <img src="/images/logo-icon.png" alt="HopeHand logo" className="hero-logo" />
         <h2>Share Food, <span className="hand">Share Hope.</span></h2>
         <p>We connect generous restaurants with trusted community partners, turning extra food into nourishing meals.</p>
         <Link to="/res-ngo-selector" className="btn btn-green btn-hero">Get Started →</Link>
        </div>
        </section>

      <section className="home-steps">
        <p className="section-tag">Simple From Start To Finish</p>
        <h2>Good food finds a good home</h2>
        <p className="section-subtext">Four small steps create one meaningful local connection.</p>

        <div className="steps-carousel">
          <button className="carousel-arrow" onClick={showPrevStep}>←</button>

          <div className="steps-track-wrap">
            <div
              className="steps-track"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}
            >
              {steps.map((step, index) => (
                <div className="step-card" key={step.title}>
                  <span className="step-count">{String(index + 1).padStart(2, '0')}</span>
                  <div className="step-icon-wrap">
                    <img src={step.icon} alt={step.title} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-arrow" onClick={showNextStep}>→</button>
        </div>
      </section>

      <section className="home-impact">
        <p className="section-tag">Why It Matters</p>
        <h2>Every shared meal does more</h2>

        <div className="impact-list">
          <div className="impact-row">
            <img src="/images/dish-icon.png" alt="Reduce waste" />
            <div className="impact-text">
              <h3>Reduce waste</h3>
              <p>Give quality surplus food a useful second journey.</p>
            </div>
          </div>
          <div className="impact-row">
            <img src="/images/logo-icon.png" alt="Nourish people" />
            <div className="impact-text">
              <h3>Nourish people</h3>
              <p>Help nutritious meals reach neighbors who need them.</p>
            </div>
          </div>
          <div className="impact-row">
            <img src="/images/people-icon.png" alt="Build community" />
            <div className="impact-text">
              <h3>Build community</h3>
              <p>Bring local businesses, volunteers, and families together.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer site-footer-lg">
        <div className="footer-col">
          <h4><span className="footer-hope">Hope</span><span className="hand">Hand</span></h4>
          <p>Sharing Food, Sharing Hope</p>
          <p>Every meal shared is a step towards a hunger-free community.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/how-it-works" className="footer-link">How It Works</Link>
          <Link to="/about-us" className="footer-link">About Us</Link>
        </div>
      </footer>
    </>
  );
}

export default Home;