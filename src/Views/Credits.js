// src/Views/Credits.js
import React, {useEffect, useRef} from 'react';
import './Credits.css';

export default function Credits({ visible, onMount }) {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('🟢 Credits mounted with visible prop:', visible);
    if (onMount) onMount();
  }, [visible, onMount]);

  return (
    <div ref={containerRef} className={`credits-container${visible ? ' visible' : ''}`}>
      <div className="credits-content">
        <div className="credits-grid">
          {/* Description Section */}
          <div className="credits-section">
            <h2 className="credits-heading">Description</h2>
            <p className="credits-text">
              Globalization is claimed to have a homogenizing effect, reducing pronounced local cultural differences. Indoor living spaces are
among the most vivid expressions of local culture, yet they remain underexplored in this context. Our visual AI framework,
utilizing a unique dataset of over 400,000 Airbnb images, investigates the diversity in living spaces across 80 cities. By
employing deep learning classification models, Gradient-Weighted Class Activation Mapping techniques, and statistical
analysis, we demonstrate that geographic proximity and the extent of globalization significantly correlate with the visual
characteristics of indoor spaces (R = 0.19 to 0.32).
            </p>
            <p className="credits-text">
              Our results indicate that despite global pressures and trends towards
cultural homogenization, local identities and cultural distinctions nevertheless remain.
            </p>
          </div>

          {/* Team Section */}
          <div className="credits-section">
            <h2 className="credits-heading">Team</h2>
            
            <h3 className="team-org">MIT Senseable City Lab</h3>
            <div className="team-member">
              <span className="member-name">Carlo Ratti</span>
              <span className="member-role">Director</span>
            </div>
            
            <div className="team-member">
              <span className="member-name">Martina Mazzarello</span>
              <span className="member-role">Research Lead</span>
            </div>
            <div className="team-member">
              <span className="member-name">Fabio Duarte</span>
            </div>
            <div className="team-member">
              <span className="member-name">Javad Eshtiyagh</span>
            </div>
            <div className="team-member">
              <span className="member-name">Mikita Klimenka</span>
            </div>
            <div className="team-member">
              <span className="member-name">Paolo Santi</span>
            </div>
            <div className="team-member">
              <span className="member-name">Rohit Sanatani</span>
            </div>

            <div className="team-member">
              <span className="member-name">David Lafond</span>
              <span className="member-role">Visualization & Web</span>
            </div>

            <h3 className="team-org">Tsinghua University</h3>
            <div className="team-member">
              <span className="member-name">Yanhua Yao</span>
            </div>

            <h3 className="team-org">University of Toronto</h3>
            <div className="team-member">
              <span className="member-name">Richard Florida</span>
            </div>
          </div>

          {/* Publications Section */}
          <div className="credits-section">
            <h2 className="credits-heading">Publications</h2>
            <p className="publication-authors">
              Mazzarello M., Klimenka M., Sanatani R., Eshtiyagh J., 
              Yao Y., Santi P., Duarte F., Florida R., Ratti C. (2025)
            </p>
            <a href="https://www.nature.com" className="publication-title" target="_blank" rel="noopener noreferrer">
              A Geography of indoors for analyzing global ways of
living using computer vision
            </a>
            <p className="publication-venue">Scientific Reports</p>

            <h2 className="credits-heading press-heading">Press</h2>
            <a href="mailto:senseable-press@mit.edu" className="press-download">Download the Press Material</a>
            <p className="press-usage">
              The material on this website can be used freely in 
              any publication provided that:
            </p>
            <ol className="press-conditions">
              <li>it is duly credited as a project by the MIT Senseable City Lab</li>
              <li>a PDF copy of the publication is sent to senseable-press@mit.edu</li>
            </ol>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-info">
            <h2 className="credits-heading">Contact</h2>
            <p className="contact-label">For more information,</p>
            <a href="mailto:senseable-contacts@mit.edu" className="contact-email">
              senseable-contacts@mit.edu
            </a>
            
            <div className="lab-logo">
              <img src="/assets/images/scl_logo_black.png" alt="Senseable City Lab" />
            </div>
            
            <a href="https://senseable.mit.edu/accessibility" className="accessibility-link">Accessibility</a>
          </div>
        </div>
      </div>
    </div>
  );
}