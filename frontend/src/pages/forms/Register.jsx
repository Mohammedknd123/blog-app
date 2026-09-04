import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/apiCalls/authApiCall";
import { authActions } from "../../redux/slices/authSlice";
import Swal from "sweetalert2";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { registerMessage } = useSelector((state) => state.auth);

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (username.trim() === "") return toast.error("Username is empty");
    if (email.trim() === "") return toast.error("Email is empty");
    if (password.trim() === "") return toast.error("Password is empty");
    dispatch(registerUser({ username, email, password }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (registerMessage) {
      Swal.fire({
        title: registerMessage,
        icon: "success",
      }).then((isOk) => {
        dispatch(authActions.clearRegisterMessage());
        if (isOk) {
          navigate("/login");
        }
      });
    }
  }, [registerMessage, dispatch, navigate]);

  return (
    <section className="form-container">
      <h1 className="form-title">Create new Account</h1>
      <form onSubmit={formSubmitHandler} className="form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-input"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-input"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-input"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="form-btn">
          Register
        </button>
      </form>
      <div className="form-footer">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </section>
  );
}
