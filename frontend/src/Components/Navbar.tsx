import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../Utils/Auth";
import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  const token = getToken();
  const isLoggedIn = !!token;

  const username = token
    ? JSON.parse(atob(token.split(".")[1]))[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ]
    : "";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="navbar">

      <div className="logo">
        <span className="logo-text">
          Aybilar
        </span>

        <span>
          {username && ` - Välkommen ${username}`}
        </span>
      </div>

      <div className="nav-links">
        <Link to="/">Hem</Link>
        <Link to="/auctions">Auktioner</Link>
        <Link to="/create">Skapa auktion</Link>
        <Link to="/about">Om oss</Link>
        <Link to="/contact">Kontakt</Link>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logga ut
      </button>

    </nav>
  );
}