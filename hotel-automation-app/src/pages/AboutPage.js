import React from 'react';
import '../styles/About.css';
import profile from '../data/yogesh.jpeg';
import '@fortawesome/fontawesome-free/css/all.min.css';


function AboutPage() {
  return (
    <div>
    
      <section className="about-us-section">
        <div className="about-us-container">
          <div className="about-us-text">
            <h2>About Us</h2>
            <div className='about-flex'>
              <div className="about-us-image">
                <img src={profile} alt="About Us" />

              </div>
              <div className='about-us-all'>
                <h3>Gate Qualifier, Web Developer, 3 Star Coder-JAVA</h3>
                <p>
                  Experienced in blending design and technology with a knack for solving problems. Well-versed in Java, ReactJS, and JUnit, among other modern tools. Enthusiastic about bringing new projects to life and ensuring their success. Skilled at understanding business needs and turning them into practical solutions. Excited to kickstart my career as a junior software engineer with a respected tech-driven company.</p>
                <a
                  href="https://drive.google.com/file/d/1IlODen5XdmSEhnswclDSjT8-92lNf3oL/view?usp=drive_link"
                  className="read-more-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </a>
                <div className="social-icons">
                  <a href="https://www.facebook.com/yogesh.toshniwal.16?mibextid=ZbWKwL" className="social-icon facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/yogesh-toshniwal-877a03227/" className="social-icon linkedin">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="https://www.instagram.com/yogesh.toshniwal.16/" className="social-icon instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://leetcode.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                    <i class="cib-leetcode"></i>
                  </a>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default AboutPage
