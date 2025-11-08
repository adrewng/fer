import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container">
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Reading Books
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/TruongNNSE193452/AllBooks"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                All Books
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/TruongNNSE193452/UnReadBook"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                UnRead Books
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
