import { Link } from "react-router-dom";
import "./Forms.css";
import { useState } from "react";
import {useDispatch} from 'react-redux'
import { toast } from "react-toastify";
import { loginUser } from "../../redux/apiCalls/authApiCall";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (email.trim() === "") return toast.error("Email is empty");
    if (password.trim() === "") return toast.error("Password is empty");
    dispatch(loginUser({email, password}))
  };
  return (
    <section className="form-container">
      <h1 className="form-title">Login to your account</h1>
      <form onSubmit={formSubmitHandler} className="form">
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="form-btn">
          Login
        </button>
      </form>
      <div className="form-footer">
        Did you forget your password?{" "}
        <Link to="/forgot-password">Forgot Passwoed</Link>
      </div>
    </section>
  );
}
