import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-pattern"></div>
      </div>
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">★</span>
            <span>#1 Rated Plumbing Service in Philadelphia</span>
          </div>
          <h1 className="hero-title">
            Professional Plumbing Services<br />
            <span className="highlight">Across the USA</span>
          </h1>
          <p className="hero-description">
            A trusted and professional plumbing service in Philadelphia. Our customer-focused approach 
            guarantees exceptional plumbing solutions tailored to your specific needs. From emergency 
            repairs to complete installations, we've got you covered 24/7.
          </p>
          <div className="hero-cta">
            <a href="#contact" className="btn btn-primary btn-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Us Now
            </a>
            <a href="#services" className="btn btn-outline btn-large">
              Our Services
            </a>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span>24/7 Emergency Service</span>
            </div>
            <div className="hero-feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span>Licensed & Insured</span>
            </div>
            <div className="hero-feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span>Upfront Pricing</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=700&fit=crop" 
              alt="Professional plumber at work"
              className="main-image"
            />
            <div className="floating-card card-experience">
              <div className="card-number">15+</div>
              <div className="card-label">Years Experience</div>
            </div>
            <div className="floating-card card-rating">
              <div className="stars">★★★★★</div>
              <div className="card-label">500+ Reviews</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero