import './Features.css'

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Emergency Repairs',
    description: '24/7 emergency plumbing services for burst pipes, leaks, and urgent repairs. Our team responds quickly to minimize damage.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Fast Response Time',
    description: 'We guarantee arrival within 60 minutes for emergency calls. Our local technicians are always ready to help you.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'Licensed & Insured',
    description: 'All our plumbers are fully licensed, bonded, and insured. Your property is protected, and our work is guaranteed.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Upfront Pricing',
    description: 'No hidden fees or surprise charges. We provide transparent, flat-rate pricing before any work begins.'
  }
]

function Features() {
  return (
    <section id="services" className="section features">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">Why Choose Master Plumbers?</h2>
          <p className="section-subtitle">
            We provide comprehensive plumbing solutions for residential and commercial properties 
            with a commitment to excellence and customer satisfaction.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <a href="#contact" className="feature-link">
                Learn More
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features