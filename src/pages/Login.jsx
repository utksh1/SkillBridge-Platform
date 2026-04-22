import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login and redirect to onboarding first
    navigate('/onboarding');
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

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input type="email" placeholder="student@university.edu" required />
                <i className="fa-regular fa-envelope input-icon"></i>
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••••••" required />
                <i 
                  className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} input-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{cursor: 'pointer'}}
                ></i>
              </div>
            </div>

            <div className="login-actions row-between">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="link-blue forgot-link">Forgot password?</a>
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
