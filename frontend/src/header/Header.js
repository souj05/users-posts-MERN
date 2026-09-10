import { NavLink } from "react-router-dom";

function Header(props) {
  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <a
          href="https://www.linkedin.com/in/Sowjanya-tadimarri/"
          target="_blank"
          rel="noreferrer"
          className="logo"
        >
          verte<span className="logo-x">X</span>
        </a>

        <ul className="nav">
          {props.userIsAuthenticated ? (
            <>
              <li>
                <NavLink to="/create">New Post</NavLink>
              </li>
              <li>
                <button className="link-btn" onClick={props.onLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Signup</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;
