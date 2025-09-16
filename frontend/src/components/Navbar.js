import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaTicketAlt, FaSignOutAlt, FaSearch } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo-link">
        <h2 className="logo">🚆 Rail-Ion</h2>
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/pnr" className={({ isActive }) => (isActive ? "active" : "")}>
            PNR Status
          </NavLink>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              <NavLink to="/search" className={({ isActive }) => (isActive ? "active-search" : "search-link")}>
                <FaSearch className="nav-icon" /> Search
              </NavLink>
            </li>

            <li className="profile-menu" ref={dropdownRef}>
              <button className="profile-toggle" onClick={toggleDropdown}>
                <FaUserCircle className="user-icon" />
                <span className="username">{username || "User"}</span>
              </button>
              {dropdownOpen && (
                <ul className="dropdown">
                  <li>
                    <NavLink to="/profile" onClick={() => setDropdownOpen(false)}>
                      <FaUserCircle className="dropdown-icon" /> Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/bookings" onClick={() => setDropdownOpen(false)}>
                      <FaTicketAlt className="dropdown-icon" /> My Bookings
                    </NavLink>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      <FaSignOutAlt className="dropdown-icon" /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;