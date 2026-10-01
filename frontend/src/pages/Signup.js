import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Eye, EyeOff, ArrowRight } from "lucide-react";

function Signup() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);

const [form, setForm] = useState({
name: "",
email: "",
password: ""
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setLoading(true);

try {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
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
        <span className="eyebrow">BEGIN YOUR JOURNEY</span>

        <h1>Create your mind space.</h1>

        <p>
          Build a space to understand your thoughts,
          protect your focus and explore ideas.
        </p>
      </div>

      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Your name</label>

          <input
            type="text"
            name="name"
            placeholder="Alex Morgan"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Email address</label>

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>

          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
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
            {loading
              ? "Creating..."
              : "Create my space"}
          </span>

          <ArrowRight size={18} />
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <p className="auth-footer">
        Already have an account?{" "}
        <Link to="/login">Sign in</Link>
      </p>
    </div>

    <p className="auth-note">
      Your personal space for thoughts and focus.
    </p>
  </div>
</div>

);
}

export default Signup;