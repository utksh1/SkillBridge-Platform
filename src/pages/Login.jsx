import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hasCompletedOnboarding, setAuthenticated } from '../data/profileUtils';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Mock user data validation
    if (email === 'alex@skillbridge.edu' && password === 'password123') {
      setAuthenticated(true);
      navigate(hasCompletedOnboarding() ? '/' : '/onboarding');
    } else {
      setError('Invalid email or password. Use alex@skillbridge.edu / password123');
    }
  };

  return (
    <div className="login-split-layout">
      {/* Left Side: Form */}
      <div className="login-left">
        <div className="login-form-container">
          <div className="login-logo">
            <i className="fa-solid fa-bridge"></i> SkillBridge <span className="logo-subtext">| student portal</span>
          </div>
          
          <h1 className="login-title">Log in to SkillBridge</h1>
          <p className="login-subtitle">
            Don't have a SkillBridge account yet? <Link to="/signup" className="link-blue">Sign up now</Link>
          </p>

          {error && (
            <div className="login-error-box">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          {resetMessage && (
            <div className="login-info-box">
              <i className="fa-solid fa-circle-info"></i> {resetMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="alex@skillbridge.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="fa-regular fa-envelope input-icon"></i>
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} input-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{cursor: 'pointer'}}
                ></i>
              </div>
            </div>

            <div className="mock-creds-hint">
              <i className="fa-solid fa-circle-info"></i> Mock: <strong>alex@skillbridge.edu</strong> / <strong>password123</strong>
            </div>

            <div className="login-actions row-between">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="link-blue forgot-link forgot-link-btn"
                onClick={() => {
                  setError('');
                  setResetMessage('Password reset instructions have been queued for the mock account.');
                }}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-btn">Log in</button>
          </form>
          
          <div className="login-footer-settings">
             <i className="fa-solid fa-cookie"></i> Cookie Settings
          </div>
        </div>
      </div>

      {/* Right Side: Illustration */}
      <div className="login-right">
        <div className="illustration-wrapper">
          <img src="/login_illustration.png" alt="Student with laptop mapping skills to careers" className="hero-illustration" />
        </div>
      </div>
    </div>
  );
}

export default Login;
