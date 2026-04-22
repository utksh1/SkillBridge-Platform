import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    // Simulate signup and go to onboarding
    navigate('/onboarding');
  };

  return (
    <div className="login-split-layout">
      {/* Left Side: Form */}
      <div className="login-left">
        <div className="login-form-container">
          <div className="login-logo">
            <i className="fa-solid fa-bridge"></i> SkillBridge
          </div>
          
          <h1 className="login-title">Create an account</h1>
          <p className="login-subtitle">
            Already have a SkillBridge account? <Link to="/login" className="link-blue">Log in now</Link>
          </p>

          <form onSubmit={handleSignup} className="login-form">
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input type="text" placeholder="Alex Morgan" required />
                <i className="fa-regular fa-user input-icon"></i>
              </div>
            </div>

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

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••••••" required />
                <i 
                  className={`fa-regular ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} input-icon`}
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{cursor: 'pointer'}}
                ></i>
              </div>
            </div>

            <div className="row-between" style={{ marginBottom: '24px' }}>
              <label className="checkbox-label" style={{ alignItems: 'flex-start' }}>
                <input type="checkbox" required style={{ marginTop: '2px' }} />
                <span style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  I agree to the <a href="#" className="link-blue">Terms of Service</a> and <a href="#" className="link-blue">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="login-btn">Sign up</button>
          </form>
          
          <div className="login-footer-settings">
             <i className="fa-solid fa-shield-halved"></i> Privacy Protected
          </div>
        </div>
      </div>

      {/* Right Side: Same Illustration */}
      <div className="login-right">
        <div className="illustration-wrapper">
          <img src="/login_illustration.png" alt="Student with laptop mapping skills to careers" className="hero-illustration" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
