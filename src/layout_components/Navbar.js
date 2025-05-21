import { NavLink } from 'react-router-dom';
import '../nav.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-link">Add Predictors</NavLink>
      <NavLink to="/page2" className="nav-link">Univariate Pre-testing</NavLink>
    </nav>
  );
}
