import { useEffect, useState } from "react";
import { api, getToken, setToken } from "./api/client.js";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTags() {
    const result = await api("/api/v1/tags");
    setTags(result.data ?? []);
  }

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    loadTags()
      .catch((err) => {
        setError(err.message);
        handleLogout();
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await api("/api/v1/auth/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
      }

      const loginResult = await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(loginResult.token);
      setIsLoggedIn(true);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTag(e) {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setError("");
    setLoading(true);

    try {
      await api("/api/v1/tags", {
        method: "POST",
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      setNewTagName("");
      await loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setIsLoggedIn(false);
    setTags([]);
    setError("");
  }

  if (!isLoggedIn) {
    return (
      <main className="app">
        <header className="app-header">
          <h1>Cortex</h1>
          <p className="muted">Step C — login, then load your tags</p>
        </header>

        <form className="card" onSubmit={handleAuthSubmit}>
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
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
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
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="app">
      <header className="app-header row">
        <div>
          <h1>Your tags</h1>
          <p className="muted">{email}</p>
        </div>
        <button type="button" className="btn" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <form className="card row-form" onSubmit={handleCreateTag}>
        <input
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          maxLength={100}
        />
        <button type="submit" className="btn primary" disabled={loading}>
          Add tag
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="card">
        {loading && tags.length === 0 ? (
          <p className="muted">Loading tags…</p>
        ) : tags.length === 0 ? (
          <p className="muted">No tags yet. Create one above.</p>
        ) : (
          <ul className="tag-list">
            {tags.map((tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
