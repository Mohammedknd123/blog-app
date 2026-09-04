import "./Forms.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from "react-router-dom";
import { getResetPassword, resetPassword } from "../../redux/apiCalls/passwordApiCall";

export default function ResetPassword() {
  const dispatch = useDispatch()
  const {isError} = useSelector(state => state.password)
  const [password, setPassword] = useState("");

  const {userId, token} = useParams()

  useEffect(() => {
    dispatch(getResetPassword(userId, token))
  }, [userId, token, dispatch])

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (password.trim() === "") return toast.error("Password is empty");
    dispatch(resetPassword({password}, {userId, token}))
  };
  return (
    <section className="form-container">
      {isError ? (
        <h1>Not Founf</h1>
      ) : (
        <>
          <h1 className="form-title">Reset Password</h1>
          <form onSubmit={formSubmitHandler} className="form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-input"
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="form-btn">
              Submit
            </button>
          </form>
        </>
      )}
    </section>
  );
}
