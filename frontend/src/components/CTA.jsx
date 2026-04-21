import './CTA.css'

function CTA({ onCallClick }) {
  const handleCall = (e) => {
    e.preventDefault()
    if (onCallClick) onCallClick()
  }

  return (
    <section id="contact" className="section cta">
      <div className="container">
        <div className="cta-wrapper">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Fix Your Plumbing Problems?
            </h2>
            <p className="cta-description">
              Don't let plumbing issues disrupt your day. Our expert team is ready 
              to help 24/7. Get a free quote today and experience the Master Plumbers difference!
            </p>
            <div className="cta-phones">
              <a href="tel:+14845500890" className="phone-link" onClick={handleCall} >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>(973) 865-3494</span>
              </a>
            </div>
            <a href="tel:+14845500890" className="btn btn-primary btn-large cta-button" onClick={handleCall}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Call Us Now
            </a>
          </div>
          <div className="cta-image">
            <img 
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=600&fit=crop" 
              alt="Professional plumber with tools"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA