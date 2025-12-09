import Link from "next/link";

export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-content">
  
          <div className="brand-section">
            <div className="brand-name">Flowvent</div>
            <p>Event Booking Platform</p>
            <div className="tagline"></div>
         
            </div>
          <div className="links-section">
            <Link href="/events">Events</Link>
            <Link href="/about">About</Link>
            <a href="https://www.instagram.com/flowvent_/" aria-label="Instagram">📸</a>
          </div>
          
          <div className="social-section">
           <p>Make every event count.</p>
          </div>
          
        </div>
        
        <div className="copyright">
          © {new Date().getFullYear()} Flowvent. All rights reserved.
        </div>
      </footer>
    );
  }
  