import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../supabase";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (!supabase) {
      setError(
        "Supabase is not configured. Please check your environment variables."
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signupError) {
        setError(
          signupError.message
        );
        return;
      }

      if (data?.session) {
        navigate("/");
        return;
      }

      setMessage(
        "Account created successfully. Please check your email to confirm your account."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            💪
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Create your fitness account
          </p>

        </div>

        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        {message && (
          <div className="alert success-alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Enter your email"
              autoComplete="email"
            />

          </div>

          <div className="form-group">

            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
            />

          </div>

          <div className="form-group">

            <label htmlFor="confirm-password">
              Confirm Password
            </label>

            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Confirm password"
              autoComplete="new-password"
            />

          </div>

          <button
            type="submit"
            className="primary-button auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Sign Up"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Signup;