import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          RealNest
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">
                  My Listings
                </NavLink>
              </li>
            )}
            {user?.role === 'ROLE_ADMIN' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li className="nav-item d-flex align-items-center me-3 text-muted">
                  Hi, {user?.name}
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
