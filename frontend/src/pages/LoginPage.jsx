import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";
import { signupWithTracking, loginWithTracking } from "../api/auth.js";
import { toastSuccess } from "../utils/toast.js";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  async function handleSubmit(e) {
    // Prevent duplicate submissions caused by React StrictMode double‑mount
    if (loading) return;
    console.log("LOGIN_SUBMIT");
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        if (mode === "signup") {
          await signupWithTracking(name, email, password);
          toastSuccess("Account created successfully! Welcome to Cortex.");
        } else {
          await loginWithTracking(email, password);
          toastSuccess("Logged in successfully!");
        }
      setPassword("");
    } catch (err) {
      // Error toast is already shown in api/client.js for API failures
      // Only set inline error for client-side validation errors
      if (err.message.startsWith("Validation")) {
        setError(err.message);
      }
    } finally {
      setLoading(false);

    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Cortex</h1>
        <p className="muted">Log in to manage notes, folders, and tags</p>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Log in" : "Sign up"}</h2>

        {mode === "signup" && (
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="password-label">
          Password
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={loading}>
          {loading
            ? mode === "login"
              ? "Logging in…"
              : "Creating account…"
            : mode === "login"
              ? "Log in"
              : "Create account & log in"}
        </button>

        <p className="muted switch-mode">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button type="button" className="link" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="link" onClick={() => setMode("login")}>
                Log in
              </button>
            </>
          )}
        </p>
      </form>
    </main>
  );
}