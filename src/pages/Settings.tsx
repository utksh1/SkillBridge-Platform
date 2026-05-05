import { useState } from 'react';
import { getStoredPortfolio, saveStoredPortfolio } from '../data/portfolioUtils';
import {
  GOAL_OPTIONS,
  TARGET_ROLE_OPTIONS,
  WORK_MODE_OPTIONS,
  getStoredProfile,
  saveStoredProfile,
} from '../data/profileUtils';

function Settings() {
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [portfolio, setPortfolio] = useState(() => getStoredPortfolio());
  const [saveState, setSaveState] = useState('Saved');
  const [toastMessage, setToastMessage] = useState('');

  const updateProfile = (field, value) => {
    setSaveState('Unsaved');
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateGoal = (goalKey) => {
    setSaveState('Unsaved');
    setProfile((prev) => {
      const currentGoals = Array.isArray(prev.goals) ? prev.goals : [];
      const goals = currentGoals.includes(goalKey)
        ? currentGoals.filter((item) => item !== goalKey)
        : [...currentGoals, goalKey];

      return { ...prev, goals };
    });
  };

  const handleSkillsChange = (value) => {
    setSaveState('Unsaved');
    setProfile((prev) => ({
      ...prev,
      skills: value.split(',').map((skill) => skill.trim()).filter(Boolean),
    }));
  };

  const saveSettings = () => {
    const nextProfile = saveStoredProfile(profile);
    const nextPortfolio = saveStoredPortfolio({
      ...portfolio,
      profileUrl: profile.portfolioUrl,
      resumeUrl: profile.resumeUrl,
    });

    setProfile(nextProfile);
    setPortfolio(nextPortfolio);
    setSaveState('Saved');
    setToastMessage('Settings saved.');
  };

  return (
    <div className="mp-page">
      <div className="mp-page-header portfolio-editor-header">
        <div>
          <h1 className="mp-page-title">Profile Settings</h1>
          <p className="mp-page-subtitle">Manage the identity, goals, and preferences that power learning, proof, and Smart Apply.</p>
          {toastMessage && (
            <div className="ui-toast inline-toast" role="status">
              <i className="fa-solid fa-circle-check"></i> {toastMessage}
            </div>
          )}
        </div>
        <div className="portfolio-editor-actions">
          <span className={`portfolio-save-state ${saveState === 'Saved' ? 'saved' : 'unsaved'}`}>
            <i className={saveState === 'Saved' ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>
            {saveState}
          </span>
          <button type="button" className="mp-find-btn" onClick={saveSettings}>
            <i className="fa-solid fa-floppy-disk"></i> Save Settings
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <section className="mp-card portfolio-editor-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Profile</span>
              <h2>Identity for applications</h2>
            </div>
          </div>

          <div className="portfolio-form-grid">
            <div className="form-section">
              <div className="form-section-heading">
                <h3>Contact Profile</h3>
                <p>The identity used across dashboard, portfolio, and applications.</p>
              </div>
              <label className="job-form-field">
                <span>Full Name</span>
                <input value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} />
              </label>
              <label className="job-form-field">
                <span>Email</span>
                <input value={profile.email} onChange={(event) => updateProfile('email', event.target.value)} />
              </label>
              <label className="job-form-field">
                <span>Phone</span>
                <input value={profile.phone} onChange={(event) => updateProfile('phone', event.target.value)} />
              </label>
              <label className="job-form-field">
                <span>Location</span>
                <input value={profile.location} onChange={(event) => updateProfile('location', event.target.value)} />
              </label>
              <label className="job-form-field">
                <span>Education</span>
                <input value={profile.education} onChange={(event) => updateProfile('education', event.target.value)} />
              </label>
              <label className="job-form-field">
                <span>Headline</span>
                <input value={profile.headline} onChange={(event) => updateProfile('headline', event.target.value)} />
              </label>
            </div>

            <div className="form-section">
              <div className="form-section-heading">
                <h3>Application Assets</h3>
                <p>Links and skills used by Smart Apply.</p>
              </div>
              <label className="job-form-field">
                <span>Portfolio URL</span>
                <input value={profile.portfolioUrl} onChange={(event) => updateProfile('portfolioUrl', event.target.value)} />
              </label>
              <label className="job-form-field">
                <span>Resume URL</span>
                <input value={profile.resumeUrl} onChange={(event) => updateProfile('resumeUrl', event.target.value)} />
              </label>
              <label className="job-form-field portfolio-wide-field">
                <span>Skills</span>
                <input value={(profile.skills ?? []).join(', ')} onChange={(event) => handleSkillsChange(event.target.value)} />
              </label>
            </div>
          </div>
        </section>

        <section className="mp-card portfolio-editor-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Preferences</span>
              <h2>Role and search goals</h2>
            </div>
          </div>

          <div className="settings-grid">
            <div className="settings-group">
              <h3>Target role</h3>
              <div className="settings-option-grid">
                {Object.values(TARGET_ROLE_OPTIONS).map((role) => (
                  <button
                    key={role.key}
                    type="button"
                    className={`settings-chip ${profile.targetRole === role.key ? 'active' : ''}`}
                    onClick={() => updateProfile('targetRole', role.key)}
                  >
                    <strong>{role.label}</strong>
                    <span>{role.summary}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <h3>Preferred work mode</h3>
              <div className="settings-option-grid">
                {Object.values(WORK_MODE_OPTIONS).map((mode) => (
                  <button
                    key={mode.key}
                    type="button"
                    className={`settings-chip ${profile.workMode === mode.key ? 'active' : ''}`}
                    onClick={() => updateProfile('workMode', mode.key)}
                  >
                    <strong>{mode.label}</strong>
                    <span>{mode.summary}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <h3>Current goals</h3>
              <div className="settings-option-grid">
                {Object.values(GOAL_OPTIONS).map((goal) => (
                  <button
                    key={goal.key}
                    type="button"
                    className={`settings-chip ${(profile.goals ?? []).includes(goal.key) ? 'active' : ''}`}
                    onClick={() => updateGoal(goal.key)}
                  >
                    <strong>{goal.label}</strong>
                    <span>{goal.summary}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
