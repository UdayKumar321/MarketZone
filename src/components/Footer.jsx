import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <span className="small text-muted">© 2026 MarketZone. Built for modern sellers & shoppers.</span>
        <div className="footer-links d-flex flex-wrap gap-3">
          <Link className="footer-link text-muted" to="/">Home</Link>
          <Link className="footer-link text-muted" to="/products">Products</Link>
          <Link className="footer-link text-muted" to="/orders">Orders</Link>
          <Link className="footer-link text-muted" to="/login">Login</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
