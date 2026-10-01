import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Eye, EyeOff, ArrowRight } from "lucide-react";

function Login() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setLoading(true);

try {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  navigate("/dashboard");
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}

};

return (
<div className="auth-page">
<div className="auth-glow auth-glow-one" />
<div className="auth-glow auth-glow-two" />

  <div className="auth-container">
    <div className="brand">
      <div className="brand-icon">
        <Brain size={25} />
      </div>

      <span>MindOS</span>
    </div>

    <div className="auth-card">
      <div className="auth-header">
        <span className="eyebrow">WELCOME BACK</span>

        <h1>Enter your mind space.</h1>

        <p>
          Your thoughts, focus and ideas — all in one place.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email address</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <div className="label-row">
            <label>Password</label>

            <button
              type="button"
              className="forgot-button"
            >
              Forgot password?
            </button>
          </div>

          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          <span>
            {loading ? "Entering..." : "Enter MindOS"}
          </span>

          <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <p className="auth-footer">
        Don't have an account?{" "}
        <Link to="/signup">Create one</Link>
      </p>
    </div>

    <p className="auth-note">
      A private space for reflection, focus and learning.
    </p>
  </div>
</div>

);
}

export default Login;