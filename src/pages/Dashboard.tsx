import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/mockData.json';
import { getApplicationReminders, getApplicationStatusClass, getStoredApplications } from '../data/applicationUtils';
import { getGoalMeta, getStoredProfile, getTargetRoleMeta, getWorkModeMeta } from '../data/profileUtils';
import { getStoredSavedJobs } from '../data/savedJobsUtils';

const ACTION_LINKS = [
  { match: 'Missing Skill', to: '/courses', label: 'Learn Skill', variant: 'filled' },
  { match: 'Submit Proof', to: '/portfolio', label: 'Submit Proof', variant: 'outline' },
  { match: 'Enroll', to: '/courses', label: 'Open Course', variant: 'filled' },
  { match: 'Complete', to: '/courses', label: 'Continue Learning', variant: 'filled' },
  { match: 'Take', to: '/portfolio', label: 'Prepare Proof', variant: 'outline' },
  { match: 'Learn', to: '/courses', label: 'Start Learning', variant: 'filled' },
  { match: 'Join', to: '/portfolio', label: 'Build Proof', variant: 'outline' },
  { match: 'Verify', to: '/portfolio', label: 'Review Verification', variant: 'filled' },
  { match: 'Upgrade', to: '/portfolio', label: 'Improve Portfolio', variant: 'filled' },
  { match: 'Explore', to: '/jobs', label: 'Explore Jobs', variant: 'outline' },
];

function Dashboard() {
  const { stats, recommendedActions, creditRegistry, activities, deadlines, activeProjects } = data.dashboard;
  const [readiness, setReadiness] = useState(0);
  const [applications] = useState(() => getStoredApplications());
  const reminders = getApplicationReminders(applications);
  const savedJobs = getStoredSavedJobs();
  const profile = getStoredProfile();
  const targetRole = getTargetRoleMeta(profile.targetRole);
  const workMode = getWorkModeMeta(profile.workMode);
  const primaryGoal = getGoalMeta(profile.goals?.[0]);
  const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const bestNextMove = {
    interview: 'Turn one skill into interview-ready proof',
    portfolio: 'Package one project as a polished case study',
    jobSearch: `Explore ${workMode.label.toLowerCase()} ${targetRole.shortLabel.toLowerCase()} roles`,
    upskill: `Close one ${targetRole.shortLabel.toLowerCase()} skill gap this week`,
  }[primaryGoal.key] ?? 'Convert one learning win into visible proof';

  useEffect(() => {
    const targetReadiness = stats.find((stat) => stat.progress)?.value ?? 0;
    const timer = window.setTimeout(() => setReadiness(targetReadiness), 280);

    return () => window.clearTimeout(timer);
  }, [stats]);

  const heroStats = [
    { label: 'Skills', value: profileSkills.length },
    { label: 'Bookmarks', value: savedJobs.length },
    { label: 'Apply', value: applications.length },
  ];

  return (
    <div className="mp-page dashboard-page">
      <section className="dash-hero">
        <div className="dash-hero-copy">
          <span className="dash-hero-eyebrow">Learn - Build Proof - Apply</span>
          <h1 className="dash-hero-title">Everything here should move you toward your next {targetRole.shortLabel.toLowerCase()} role.</h1>
          <p className="dash-hero-subtitle">
            Welcome back, {profile.name.split(' ')[0]}. Your dashboard is now organized around one clear loop:
            learn the right skills, turn them into proof, and apply with confidence for {workMode.label.toLowerCase()} work.
          </p>

          {profileSkills.length > 0 && (
            <div className="dash-profile-skill-row">
              {profileSkills.slice(0, 5).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          )}

          <div className="dash-hero-actions">
            <Link to="/courses" className="mp-btn-filled dash-hero-btn">
              Continue Learning
            </Link>
            <Link to="/portfolio" className="mp-btn-outline dash-hero-btn">
              Refine Portfolio
            </Link>
            <Link to="/jobs" className="mp-btn-outline dash-hero-btn">
              Explore Jobs
            </Link>
          </div>

          <div className="dash-hero-strip">
            {heroStats.map((item) => (
              <div key={item.label} className="dash-hero-strip-item">
                <span className="dash-hero-strip-value">{item.value}</span>
                <span className="dash-hero-strip-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-hero-panel">
          <div className="dash-readiness-ring" style={{ '--readiness': readiness }}>
            <div className="dash-readiness-core">
              <span className="dash-readiness-value">{readiness}%</span>
              <span className="dash-readiness-label">Readiness</span>
            </div>
          </div>

          <div className="dash-hero-note">
            <div>
              <span className="dash-hero-note-kicker">{primaryGoal.label}</span>
              <h3>{bestNextMove}</h3>
            </div>
            <p>For your {targetRole.label} path, SkillBridge is tuned around your saved goals, skills, and work preference.</p>
          </div>
        </div>
      </section>

      <section className="dash-overview-grid">
        {stats.map((stat) => {
          const value = stat.progress ? readiness : stat.value;

          return (
            <article className="dash-overview-card" key={stat.label}>
              <div className="dash-overview-top">
                <div className="dash-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  <i className={stat.icon}></i>
                </div>
                <span className="dash-overview-trend" style={{ color: stat.color }}>
                  {stat.progress ? '+6 this month' : 'Updated today'}
                </span>
              </div>

              <div className="dash-stat-info">
                <span className="dash-stat-value">
                  {value}
                  {stat.suffix || ''}
                </span>
                <span className="dash-stat-label">{stat.label}</span>
              </div>

              {stat.progress && (
                <div className="dash-stat-bar">
                  <div className="dash-stat-bar-fill" style={{ width: `${readiness}%`, background: stat.color }}></div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="dash-main-grid">
        <div className="dash-main-col dash-main-col-wide">
          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Control center</span>
                <h2>Recommended Next Steps</h2>
              </div>
              <Link to="/applications" className="mp-btn-outline dash-inline-btn job-link-btn">
                Track Jobs
              </Link>
            </div>

            <div className="dash-action-list">
              {recommendedActions.slice(0, 4).map((action) => {
                const actionLink = ACTION_LINKS.find((item) => action.title.includes(item.match)) ?? {
                  to: '/jobs',
                  label: action.action,
                  variant: action.variant,
                };
                const buttonClass = actionLink.variant === 'outline' ? 'mp-btn-outline' : 'mp-btn-filled';

                return (
                  <div className="dash-action-item" key={action.title}>
                    <div className="dash-action-icon" style={{ background: action.bg, color: action.color }}>
                      <i className={action.icon}></i>
                    </div>
                    <div className="dash-action-info">
                      <h4>{action.title}</h4>
                      <p>{action.description}</p>
                    </div>
                    <Link to={actionLink.to} className={`${buttonClass} job-link-btn`}>
                      {actionLink.label}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Build proof</span>
                <h2>Projects In Progress</h2>
              </div>
              <Link to="/portfolio" className="link-blue dash-section-link">
                Portfolio <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="dash-project-grid">
              {activeProjects.map((proj, index) => (
                <div
                  key={`${proj.title}-${index}`}
                  className="dash-project-card"
                  style={{ '--project-accent': proj.companyColor }}
                >
                  <div className="dash-project-glow"></div>
                  <div className="mp-card-header">
                    <div className="mp-company-logo dash-project-logo" style={{ backgroundColor: proj.companyColor }}>
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                      <h3 className="mp-card-title">{proj.title}</h3>
                      <span className="mp-company-name">{proj.company}</span>
                    </div>
                  </div>

                  <div className="mp-meta-row">
                    <span className="mp-meta-chip">
                      <i className="fa-regular fa-clock"></i> {proj.due}
                    </span>
                    <span className="mp-meta-chip">
                      <i className="fa-solid fa-code-branch"></i> {proj.milestone}
                    </span>
                  </div>

                  <div className="dash-project-progress">
                    <div className="dash-project-progress-top">
                      <span>Progress</span>
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="dash-project-progress-bar">
                      <div className="dash-project-progress-fill" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                  </div>

                  <div className="mp-card-actions dash-project-actions">
                    <Link to="/portfolio" className="mp-btn-outline job-link-btn">Edit Portfolio</Link>
                    <Link to="/portfolio" className="mp-btn-filled job-link-btn">Verify Progress</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Apply to jobs</span>
                <h2>Applied Jobs</h2>
              </div>
              <Link to="/applications" className="link-blue dash-section-link">
                Tracker <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="dash-applied-list">
              {applications.slice(0, 4).map((app) => (
                <div className="dash-applied-item" key={app.id}>
                  <div className="mp-company-logo dash-applied-logo" style={{ backgroundColor: app.companyColor }}>
                    {app.companyInitial ?? app.company.charAt(0)}
                  </div>
                  <div className="dash-applied-info">
                    <h4>{app.title}</h4>
                    <p>{app.company} • Applied on {app.appliedDate}</p>
                  </div>
                  <span className={`mp-status-badge ${getApplicationStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="mp-empty-state">No active applications.</p>
              )}
            </div>
          </div>

          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Shortlist</span>
                <h2>Bookmarked Roles</h2>
              </div>
              <Link to="/jobs" className="link-blue dash-section-link">
                Open Jobs <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="dash-applied-list">
              {savedJobs.slice(0, 3).map((job) => (
                <div className="dash-applied-item" key={job.jobId}>
                  <div className="mp-company-logo dash-applied-logo" style={{ backgroundColor: job.companyColor }}>
                    {job.companyInitial ?? job.company.charAt(0)}
                  </div>
                  <div className="dash-applied-info">
                    <h4>{job.title}</h4>
                    <p>{job.company} • {job.location}</p>
                  </div>
                  <Link to={`/jobs/${job.jobId}`} className="mp-btn-outline job-link-btn">Open</Link>
                </div>
              ))}
              {savedJobs.length === 0 && (
                <p className="mp-empty-state">No bookmarked roles yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="dash-main-col">
          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Proof layer</span>
                <h2>Skill Verifications</h2>
              </div>
              <Link to="/portfolio" className="link-blue dash-section-link">
                View All <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>

            <div className="dash-credit-list">
              {creditRegistry.slice(0, 4).map((credit) => (
                <div className="dash-credit-row" key={credit.title}>
                  <div className="mp-company-logo dash-credit-logo" style={{ backgroundColor: credit.issuerColor }}>
                    {credit.issuerInitial}
                  </div>
                  <div className="dash-credit-info">
                    <h4>{credit.title}</h4>
                    <span>
                      {credit.issuer} • {credit.time}
                    </span>
                  </div>
                  <span className={`mp-status-badge mp-status-${credit.status}`}>{credit.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Follow-up queue</span>
                <h2>Application Reminders</h2>
              </div>
            </div>

            <div className="dash-deadline-list">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="dash-deadline-item">
                  <div className="dash-deadline-marker"></div>
                  <div className="dash-deadline-info">
                    <h4>{reminder.title}</h4>
                    <p className="dash-deadline-due">{reminder.description}</p>
                  </div>
                  <Link to={`/jobs/${reminder.jobId}`} className="mp-btn-outline job-link-btn">Open</Link>
                </div>
              ))}
              {reminders.length === 0 && (
                <p className="mp-empty-state">No reminders yet. Applications in progress will surface here.</p>
              )}
            </div>
          </div>

          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Watchlist</span>
                <h2>Upcoming Deadlines</h2>
              </div>
            </div>

            <div className="dash-deadline-list">
              {deadlines.map((deadline, index) => (
                <div key={`${deadline.title}-${index}`} className="dash-deadline-item">
                  <div className="dash-deadline-marker"></div>
                  <div className="dash-deadline-info">
                    <h4>{deadline.title}</h4>
                    <p className="dash-deadline-due">{deadline.due}</p>
                  </div>
                  <span
                    className={`mp-status-badge ${
                      deadline.priority === 'High'
                        ? 'mp-status-rejected'
                        : deadline.priority === 'Medium'
                          ? 'mp-status-pending'
                          : 'mp-status-verified'
                    }`}
                  >
                    {deadline.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mp-card dash-section-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Recent signal</span>
                <h2>Activity Feed</h2>
              </div>
            </div>

            <div className="dash-activity-list">
              {activities.slice(0, 5).map((activity, index) => (
                <div key={`${activity.text}-${index}`} className="dash-activity-item">
                  <div className={`dash-activity-icon ${activity.type}`}>
                    {activity.type === 'skill_added' && <i className="fa-solid fa-plus-circle"></i>}
                    {activity.type === 'project' && <i className="fa-solid fa-briefcase"></i>}
                    {activity.type === 'credit' && <i className="fa-solid fa-certificate"></i>}
                  </div>
                  <div className="dash-activity-info">
                    <p className="dash-activity-text">{activity.text}</p>
                    <span className="dash-activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
