import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { isAuthenticated, login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      setPassword("");
    } catch (err) {
      setError(err.message);
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

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={6}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={loading}>
          {loading
            ? "Working…"
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
