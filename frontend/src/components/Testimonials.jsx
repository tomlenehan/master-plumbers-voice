import './Testimonials.css'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Master Plumbers saved us during a midnight pipe burst! They arrived within 30 minutes and fixed everything professionally. Highly recommend their emergency service!'
  },
  {
    name: 'Michael Chen',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'We use them for all our commercial plumbing needs. Their team is reliable, professional, and always completes the job on time. Best plumbing service in the city!'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Property Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Managing 50+ properties means I need a plumber I can trust. Master Plumbers has been our go-to for 3 years. Fair pricing and excellent workmanship every time.'
  }
]

function Testimonials() {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about our services.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="author-image"
                />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Emergency Service</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials