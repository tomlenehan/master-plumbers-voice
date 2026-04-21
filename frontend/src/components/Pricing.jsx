import './Pricing.css'

const plans = [
  {
    name: 'Basic',
    price: '89',
    period: 'per service',
    description: 'Perfect for minor repairs and maintenance',
    features: [
      'Leak detection & repair',
      'Faucet installation',
      'Drain cleaning',
      'Toilet repair',
      '90-day warranty'
    ],
    popular: false,
    cta: 'Get Started'
  },
  {
    name: 'Professional',
    price: '149',
    period: 'per service',
    description: 'Ideal for homeowners with regular needs',
    features: [
      'Everything in Basic',
      'Pipe repair & replacement',
      'Water heater service',
      'Sewer line inspection',
      '1-year warranty',
      'Priority scheduling'
    ],
    popular: true,
    cta: 'Most Popular'
  },
  {
    name: 'Commercial',
    price: '299',
    period: 'per service',
    description: 'Comprehensive solutions for businesses',
    features: [
      'Everything in Professional',
      'Commercial installations',
      '24/7 emergency service',
      'Preventive maintenance',
      '2-year warranty',
      'Dedicated account manager'
    ],
    popular: false,
    cta: 'Contact Us'
  }
]

function Pricing() {
  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Pricing</span>
          <h2 className="section-title">Transparent Pricing Plans</h2>
          <p className="section-subtitle">
            No hidden fees. No surprises. Get quality plumbing services at fair, 
            upfront prices.
          </p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <div className="pricing-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="plan-feature">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} plan-cta`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing