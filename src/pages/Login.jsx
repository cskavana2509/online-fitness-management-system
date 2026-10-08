import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
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
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (data?.user) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      setError(
        "Unable to login. Please try again."
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
            Fitness Management
          </h1>

          <p>
            Login to your account
          </p>

        </div>

        {error && (
          <div className="alert error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
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

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter your password"
              autoComplete="current-password"
            />

          </div>

          <button
            type="submit"
            className="primary-button auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Sign Up
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;