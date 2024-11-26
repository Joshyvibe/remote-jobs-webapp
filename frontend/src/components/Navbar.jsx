import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import "../styles/Navbar.css";
import { useAuthentication } from "../auth";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const { isAuthorized, logout } = useAuthentication();

    const handleLogout = () => {
        logout();
        setMenuOpen(false); // Close menu after logout
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo-link">
                <img src={logo} alt="Logo" className="navbar-logo" />
            </Link>

            <div
                className={`hamburger ${menuOpen ? "active" : ""}`}
                onClick={toggleMenu}
            >
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className={`navbar-menu ${menuOpen ? "show" : ""}`}>
                <ul className="navbar-menu-left">
                    <li>
                        <Link to="/jobs" onClick={toggleMenu}>Jobs</Link>
                    </li>
                    <li>
                        <Link to="/companies" onClick={toggleMenu}>Companies</Link>
                    </li>
                </ul>
                <ul className="navbar-menu-right">
                    {isAuthorized ? (
                        <>
                            <li>
                                <Link to="/profile" onClick={toggleMenu}>Profile</Link>
                            </li>
                            <li>
                                <Link to="#" onClick={handleLogout} className="button-link">Logout</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/register" className="button-link" onClick={toggleMenu}>Post Now! It's free</Link>
                            </li>
                            <li>
                                <Link to="/login" className="button-link-login" onClick={toggleMenu}>Sign In</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
