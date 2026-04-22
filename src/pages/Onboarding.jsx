import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleComplete = () => {
    if (selectedRole) {
      // Typically we'd save this to the DB here.
      navigate('/');
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <div className="auth-header">
           <h2>Choose Your Target Career</h2>
           <p>We'll map your dashboard readiness score to the skills required for this role.</p>
        </div>
        
        <div className="onboarding-grid">
           <div 
             className={`role-card ${selectedRole === 'frontend' ? 'selected' : ''}`}
             onClick={() => setSelectedRole('frontend')}
           >
              <i className="fa-brands fa-react"></i>
              <h3>Frontend Developer</h3>
              <p>React, CSS, JavaScript, UI/UX implementation.</p>
           </div>
           
           <div 
             className={`role-card ${selectedRole === 'data' ? 'selected' : ''}`}
             onClick={() => setSelectedRole('data')}
           >
              <i className="fa-solid fa-database"></i>
              <h3>Data Analyst</h3>
              <p>SQL, Python, Data Visualization, Excel.</p>
           </div>

           <div 
             className={`role-card ${selectedRole === 'marketing' ? 'selected' : ''}`}
             onClick={() => setSelectedRole('marketing')}
           >
              <i className="fa-solid fa-bullhorn"></i>
              <h3>Digital Marketer</h3>
              <p>SEO, Content Strategy, Analytics, Campaigns.</p>
           </div>

           <div 
             className={`role-card ${selectedRole === 'product' ? 'selected' : ''}`}
             onClick={() => setSelectedRole('product')}
           >
              <i className="fa-solid fa-box-open"></i>
              <h3>Product Manager</h3>
              <p>Agile, Roadmapping, Stakeholder Communicaton.</p>
           </div>
        </div>

        <button 
           className="primary-btn full-width" 
           disabled={!selectedRole}
           style={{ opacity: selectedRole ? 1 : 0.5, marginTop: '20px' }}
           onClick={handleComplete}
        >
           Generate My SkillBridge Profile
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
