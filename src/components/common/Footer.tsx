import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/milestones", label: "Milestones" },
  { to: "/timescales", label: "Timescales" },
  { to: "/settings", label: "Settings" },
  { to: "/about", label: "About" },
] as const;

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__brand-mark" aria-hidden="true" />
          <div className="footer__brand-copy">
            <span className="footer__title">Kronoscope</span>
            <p className="footer__text">
              A quiet interface for exploring personal time, global events, and deep timescales.
            </p>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          {FOOTER_LINKS.map(link => (
            <Link key={link.to} to={link.to} className="footer__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer__meta">
          <span>Copyright {new Date().getFullYear()} Kronoscope</span>
          <span>Built by Niccolo Mei Innocenti</span>
          <a href="mailto:meinicco@gmail.com">Gmail</a>
          <a href="https://instagram.com/smeolos" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
