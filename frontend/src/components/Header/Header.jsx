import { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/apiCalls/authApiCall";


export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const [toggle, setToggle] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const dispatch = useDispatch();


  // Log out Handler
  function logoutHandler() {
    setDropDown(false)
    dispatch(logout())
  }
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          <strong>BlogApp</strong>
          <i className="bi bi-journal-richtext"></i>
        </Link>
        <div className="header-menu" onClick={() => setToggle((prev) => !prev)}>
          {toggle ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <i className="bi bi-list"></i>
          )}
        </div>
      </div>
      <nav
        className="navbar"
        style={{
          clipPath: toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <ul className="nav-links">
          <Link to="/" onClick={() => setToggle(false)} className="nav-link">
            <i className="bi bi-house"></i>&nbsp;Home
          </Link>
          <Link
            to="/posts"
            onClick={() => setToggle(false)}
            className="nav-link"
          >
            <i className="bi bi-stickies"></i>&nbsp;Posts
          </Link>
          {user && (
            <Link
              to="/posts/createpost"
              onClick={() => setToggle(false)}
              className="nav-link"
            >
              <i className="bi bi-journal-plus"></i>&nbsp;Create
            </Link>
          )}
          {user?.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setToggle(false)}
              className="nav-link"
            >
              <i className="bi bi-person-check"></i>&nbsp;Admin Dashboard
            </Link>
          )}
        </ul>
      </nav>

      {user ? (
        <>
          <div
            onClick={() => setDropDown((prev) => !prev)}
            className="header-right-user-info"
          >
            <span className="header-right-username">{user?.username}</span>
            <img
              src={user?.profilephoto?.url}
              alt="user-photo"
              className="header-right-user-photo"
            />
            {dropDown && (
              <div className="header-right-dropdown">
                <Link
                  to={`/profile/${user._id}`}
                  className="header-dropdown-item"
                  onClick={() => setDropDown(false)}
                >
                  <i className="bi bi-file-person"></i>
                  <span>Profile</span>
                </Link>
                <div onClick={logoutHandler} className="header-dropdown-item">
                  <i className="bi bi-box-arrow-in-left"></i>
                  <span>Log out</span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="header-right">
            <Link to="/login" className="header-right-link">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Login</span>
            </Link>
            <Link to="/register" className="header-right-link">
              <i className="bi bi-person-plus"></i>
              <span>Register</span>
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
