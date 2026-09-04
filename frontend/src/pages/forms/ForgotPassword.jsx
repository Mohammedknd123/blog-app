import "./Forms.css";
import { useState } from "react";
import { toast } from "react-toastify";
import {useDispatch} from 'react-redux'
import { forgotPassword } from "../../redux/apiCalls/passwordApiCall";

export default function ForgotPassword() {
  const dispatch = useDispatch()

  const [email, setEmail] = useState("");

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (email.trim() === "") return toast.error("Email is empty");
    dispatch(forgotPassword(email))
  };
  return (
    <section className="form-container">
      <h1 className="form-title">Forgot Password</h1>
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
        <button type="submit" className="form-btn">
          Submit
        </button>
      </form>
    </section>
  );
}
