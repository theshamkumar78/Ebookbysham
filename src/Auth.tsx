
import { useState, type FormEvent } from "react";
import { supabase } from "./supabase";
import { Mail, Lock, User, ArrowRight, X } from "lucide-react";

type AuthProps = {
  onLogin: () => void;
  onClose: () => void;
  initialMode: "login" | "signup";
};

export default function Auth({
  onLogin,
  onClose,
  initialMode,
}: AuthProps) {
  const [mode, setMode] = useState<"login" | "signup" | "reset">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (error) throw error;

        if (data.session) {
          onLogin();
        } else {
          setMessage("Account created! Please check your email.");
        }
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onLogin();
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });

        if (error) throw error;
        setMessage("Password reset link has been sent to your email.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
          aria-label="Back to homepage"
        >
          <X size={20} />
        </button>

        <a href="#home" className="auth-logo">
          <img
            src="/pakelibrary-logo.png"
            alt="PakeLibrary"
          />
        </a>

        <h1>
          {mode === "signup"
            ? "Create your account"
            : mode === "reset"
            ? "Reset password"
            : "Welcome back"}
        </h1>

        <p className="auth-subtitle">
          {mode === "signup"
            ? "Join our learning community."
            : mode === "reset"
            ? "Enter your email to receive a reset link."
            : "Login to continue your learning journey."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="auth-field">
              <span>Full Name</span>
              <div>
                <User size={19} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </label>
          )}

          <label className="auth-field">
            <span>Email Address</span>
            <div>
              <Mail size={19} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          {mode !== "reset" && (
            <label className="auth-field">
              <span>Password</span>
              <div>
                <Lock size={19} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>
            </label>
          )}

          {mode === "login" && (
            <button
              type="button"
              className="forgot-link"
              onClick={() => {
                setMode("reset");
                setError("");
                setMessage("");
              }}
            >
              Forgot password?
            </button>
          )}

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-success">{message}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create Account"
              : mode === "reset"
              ? "Send Reset Link"
              : "Login"}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Login
              </button>
            </>
          ) : (
            <>
              {mode === "reset" ? "Remember your password?" : "New to PakeLibrary?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "reset" ? "login" : "signup");
                  setError("");
                  setMessage("");
                }}
              >
                {mode === "reset" ? "Login" : "Sign Up"}
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
