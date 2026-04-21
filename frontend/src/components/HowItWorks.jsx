import './HowItWorks.css'

const steps = [
  {
    number: '01',
    title: 'Book Online or Call',
    description: 'Schedule your service through our website or call us directly. We offer flexible appointment times to fit your schedule.'
  },
  {
    number: '02',
    title: 'Free Inspection',
    description: 'Our licensed plumber arrives on time, diagnoses the issue, and provides a transparent upfront quote before any work begins.'
  },
  {
    number: '03',
    title: 'Expert Repair',
    description: 'We complete the job using quality parts and proven techniques. All our work comes with a satisfaction guarantee.'
  },
  {
    number: '04',
    title: 'Follow-Up Support',
    description: 'We check in after the service to ensure everything is working perfectly. Our support team is always here to help.'
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Simple 4-Step Process</h2>
          <p className="section-subtitle">
            Getting your plumbing fixed has never been easier. We ensure a seamless experience 
            from consultation to completion.
          </p>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <svg viewBox="0 0 100 24" fill="none" preserveAspectRatio="none">
                    <path d="M0 12h90M80 4l10 8-10 8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks