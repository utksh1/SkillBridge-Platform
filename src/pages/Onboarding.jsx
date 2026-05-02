import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Plus, Sparkles } from 'lucide-react';
import {
  GOAL_OPTIONS,
  TARGET_ROLE_OPTIONS,
  WORK_MODE_OPTIONS,
  getStoredProfile,
  saveStoredProfile,
} from '../data/profileUtils';

const ROLE_SKILLS = {
  frontend: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Accessibility', 'Design Systems', 'Testing', 'APIs'],
  data: ['SQL', 'Python', 'Power BI', 'Excel', 'Statistics', 'Data Cleaning', 'Dashboards', 'Storytelling'],
  marketing: ['SEO', 'Google Ads', 'Content Strategy', 'Analytics', 'Email Marketing', 'Copywriting', 'Social Media', 'A/B Testing'],
  product: ['Roadmapping', 'User Research', 'Analytics', 'Prioritization', 'Stakeholder Management', 'Wireframing', 'Agile', 'Launch Planning'],
};

const STEPS = [
  { key: 'role', label: 'Role' },
  { key: 'skills', label: 'Skills' },
  { key: 'goals', label: 'Goals' },
  { key: 'mode', label: 'Work Mode' },
  { key: 'review', label: 'Review' },
];

const getRoleIconClass = (roleKey) => {
  if (roleKey === 'frontend') return 'fa-brands fa-react';
  if (roleKey === 'data') return 'fa-solid fa-database';
  if (roleKey === 'marketing') return 'fa-solid fa-bullhorn';
  return 'fa-solid fa-box-open';
};

function Onboarding() {
  const navigate = useNavigate();
  const storedProfile = getStoredProfile();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState(storedProfile.targetRole ?? 'frontend');
  const [selectedSkills, setSelectedSkills] = useState(storedProfile.onboardingComplete ? storedProfile.skills ?? [] : []);
  const [selectedGoals, setSelectedGoals] = useState(storedProfile.onboardingComplete ? storedProfile.goals ?? [] : []);
  const [workMode, setWorkMode] = useState(storedProfile.onboardingComplete ? storedProfile.workMode ?? 'flexible' : 'flexible');
  const [customSkill, setCustomSkill] = useState('');

  const currentStep = STEPS[stepIndex];
  const roles = Object.values(TARGET_ROLE_OPTIONS);
  const goals = Object.values(GOAL_OPTIONS);
  const workModes = Object.values(WORK_MODE_OPTIONS);
  const suggestedSkills = useMemo(() => ROLE_SKILLS[selectedRole] ?? ROLE_SKILLS.frontend, [selectedRole]);
  const selectedRoleMeta = TARGET_ROLE_OPTIONS[selectedRole] ?? TARGET_ROLE_OPTIONS.frontend;
  const selectedWorkModeMeta = WORK_MODE_OPTIONS[workMode] ?? WORK_MODE_OPTIONS.flexible;
  const selectedGoalLabels = selectedGoals.map((goal) => GOAL_OPTIONS[goal]?.label).filter(Boolean);

  const canContinue = (
    (currentStep.key === 'role' && selectedRole) ||
    (currentStep.key === 'skills' && selectedSkills.length > 0) ||
    (currentStep.key === 'goals' && selectedGoals.length > 0) ||
    (currentStep.key === 'mode' && workMode) ||
    currentStep.key === 'review'
  );
  const completedStepCount = [
    Boolean(selectedRole),
    selectedSkills.length > 0,
    selectedGoals.length > 0,
    Boolean(workMode),
  ].filter(Boolean).length;

  const toggleSkill = (skill) => {
    setSelectedSkills((current) => (
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    ));
  };

  const toggleGoal = (goal) => {
    setSelectedGoals((current) => (
      current.includes(goal)
        ? current.filter((item) => item !== goal)
        : [...current, goal]
    ));
  };

  const handleAddSkill = () => {
    const nextSkill = customSkill.trim();
    if (!nextSkill || selectedSkills.includes(nextSkill)) return;
    setSelectedSkills((current) => [...current, nextSkill]);
    setCustomSkill('');
  };

  const goNext = () => {
    if (!canContinue) return;

    if (currentStep.key === 'review') {
      saveStoredProfile({
        targetRole: selectedRole,
        skills: selectedSkills,
        goals: selectedGoals,
        workMode,
        onboardingComplete: true,
        onboardedAt: new Date().toISOString(),
      });
      navigate('/');
      return;
    }

    setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <div className="onboarding-root">
      <main className="onboarding-shell">
        <section className="onboarding-visual">
          <div className="onboarding-brand">
            <span className="onboarding-logo"><i className="fa-solid fa-bridge"></i></span>
            <span>SkillBridge</span>
          </div>

          <div className="onboarding-visual-copy">
            <span className="onboarding-kicker">Student setup</span>
            <h1>Build your first personalized career loop.</h1>
            <p>{selectedRoleMeta.summary}</p>
          </div>

          <div className="onboarding-preview">
            <div>
              <span>Target</span>
              <strong>{selectedRoleMeta.label}</strong>
            </div>
            <div>
              <span>Work</span>
              <strong>{selectedWorkModeMeta.label}</strong>
            </div>
            <div>
              <span>Skills</span>
              <strong>{selectedSkills.length || 0} selected</strong>
            </div>
          </div>
        </section>

        <section className="onboarding-panel" aria-labelledby="onboarding-title">
          <div className="onboarding-progress">
            {STEPS.map((step, index) => (
              <button
                key={step.key}
                type="button"
                className={`onboarding-step-dot ${index === stepIndex ? 'active' : ''} ${index < stepIndex ? 'done' : ''}`}
                onClick={() => setStepIndex(Math.min(index, completedStepCount))}
                disabled={index > completedStepCount}
                aria-label={`Go to ${step.label}`}
              >
                {index < stepIndex ? <Check size={14} /> : index + 1}
              </button>
            ))}
          </div>

          <div className="onboarding-panel-heading">
            <span className="onboarding-kicker">{currentStep.label}</span>
            <h2 id="onboarding-title">
              {currentStep.key === 'role' && 'What role are you aiming for?'}
              {currentStep.key === 'skills' && 'Which skills should SkillBridge recognize?'}
              {currentStep.key === 'goals' && 'What should the dashboard prioritize?'}
              {currentStep.key === 'mode' && 'Where do you want to work?'}
              {currentStep.key === 'review' && 'Ready to personalize your dashboard?'}
            </h2>
          </div>

          {currentStep.key === 'role' && (
            <div className="onboarding-card-grid">
              {roles.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  className={`onboarding-choice-card ${selectedRole === role.key ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRole(role.key);
                    setSelectedSkills(ROLE_SKILLS[role.key].slice(0, 3));
                  }}
                >
                  <i className={getRoleIconClass(role.key)}></i>
                  <span>{role.label}</span>
                  <small>{role.summary}</small>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === 'skills' && (
            <div className="onboarding-stack">
              <div className="onboarding-chip-grid">
                {suggestedSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`onboarding-skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="onboarding-add-skill">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(event) => setCustomSkill(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add another skill"
                  aria-label="Add another skill"
                />
                <button type="button" onClick={handleAddSkill} aria-label="Add skill">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          {currentStep.key === 'goals' && (
            <div className="onboarding-card-grid two-column">
              {goals.map((goal) => (
                <button
                  key={goal.key}
                  type="button"
                  className={`onboarding-choice-card compact ${selectedGoals.includes(goal.key) ? 'selected' : ''}`}
                  onClick={() => toggleGoal(goal.key)}
                >
                  <span>{goal.label}</span>
                  <small>{goal.summary}</small>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === 'mode' && (
            <div className="onboarding-card-grid two-column">
              {workModes.map((mode) => (
                <button
                  key={mode.key}
                  type="button"
                  className={`onboarding-choice-card compact ${workMode === mode.key ? 'selected' : ''}`}
                  onClick={() => setWorkMode(mode.key)}
                >
                  <span>{mode.label}</span>
                  <small>{mode.summary}</small>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === 'review' && (
            <div className="onboarding-review">
              <div className="onboarding-review-hero">
                <Sparkles size={22} />
                <div>
                  <span>{selectedRoleMeta.label}</span>
                  <strong>{selectedWorkModeMeta.label}</strong>
                </div>
              </div>

              <div className="onboarding-review-list">
                <div>
                  <span>Skills</span>
                  <p>{selectedSkills.join(', ')}</p>
                </div>
                <div>
                  <span>Goals</span>
                  <p>{selectedGoalLabels.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          <div className="onboarding-actions">
            <button
              type="button"
              className="onboarding-nav-btn secondary"
              onClick={goBack}
              disabled={stepIndex === 0}
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="onboarding-nav-btn primary"
              onClick={goNext}
              disabled={!canContinue}
            >
              {currentStep.key === 'review' ? 'Open Dashboard' : 'Continue'}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Onboarding;
