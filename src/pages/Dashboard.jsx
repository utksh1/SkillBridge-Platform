import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/mockData.json';

function Dashboard() {
  const { stats, recommendedActions, creditRegistry, activities, deadlines, activeProjects } = data.dashboard;
  const [readiness, setReadiness] = useState(0);

  useEffect(() => {
    const targetReadiness = stats.find((stat) => stat.progress)?.value ?? 0;
    setTimeout(() => setReadiness(targetReadiness), 300);
  }, [stats]);

  return (
    <div className="mp-page">
      {/* Page Header */}
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Dashboard</h1>
          <p className="mp-page-subtitle">Welcome back, Alex! Track your progress and next steps.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dash-stats-row">
        {stats.map((stat) => {
          const value = stat.progress ? readiness : stat.value;

          return (
            <div className="dash-stat-card" key={stat.label}>
              <div className="dash-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className="dash-stat-info">
                <span className="dash-stat-value">{value}{stat.suffix || ''}</span>
                <span className="dash-stat-label">{stat.label}</span>
              </div>
              {stat.progress && (
                <div className="dash-stat-bar">
                  <div className="dash-stat-bar-fill" style={{ width: `${readiness}%`, background: stat.color }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="dash-two-col">
        {/* Left Column */}
        <div className="dash-col">
          {/* Recommended Actions */}
          <div className="mp-card">
            <div className="mp-card-top" style={{ marginBottom: '0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recommended Next Steps</h3>
              <button className="mp-btn-outline" style={{ flex: 'none', padding: '6px 14px' }}>View All</button>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendedActions.map((action) => (
                <div className="dash-action-item" key={action.title}>
                  <div className="dash-action-icon" style={{ background: action.bg, color: action.color }}>
                    <i className={action.icon}></i>
                  </div>
                  <div className="dash-action-info">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                  <button
                    className={action.variant === 'outline' ? 'mp-btn-outline' : 'mp-btn-filled'}
                    style={{ flex: 'none', padding: '6px 16px' }}
                  >
                    {action.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Credit Registry */}
          <div className="mp-card">
            <div className="mp-card-top" style={{ marginBottom: '0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Credit Registry</h3>
              <Link to="/credits" className="link-blue" style={{ fontSize: '0.85rem' }}>View All <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {creditRegistry.map((credit) => (
                <div className="dash-credit-row" key={credit.title}>
                  <div
                    className="mp-company-logo"
                    style={{ backgroundColor: credit.issuerColor, width: '38px', height: '38px', minWidth: '38px', fontSize: '0.9rem' }}
                  >
                    {credit.issuerInitial}
                  </div>
                  <div className="dash-credit-info">
                    <h4>{credit.title}</h4>
                    <span>{credit.issuer} • {credit.time}</span>
                  </div>
                  <span className={`mp-status-badge mp-status-${credit.status}`}>{credit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mp-card">
            <div className="mp-card-top" style={{ marginBottom: '0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Activity</h3>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activities.map((activity, i) => (
                <div key={i} className="dash-activity-item">
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

        {/* Right Column */}
        <div className="dash-col">
          {/* Active Projects */}
          <div className="mp-card">
            <div className="mp-card-top" style={{ marginBottom: '0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Active Projects</h3>
              <Link to="/projects" className="link-blue" style={{ fontSize: '0.85rem' }}>Marketplace <i className="fa-solid fa-arrow-right"></i></Link>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeProjects.map((proj, i) => (
                <div key={i} className="dash-project-card">
                  <div className="mp-card-header">
                    <div className="mp-company-logo" style={{ backgroundColor: proj.companyColor, width: '40px', height: '40px' }}>
                      <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div>
                      <h3 className="mp-card-title">{proj.title}</h3>
                      <span className="mp-company-name">{proj.company}</span>
                    </div>
                  </div>
                  <div className="mp-meta-row">
                    <span className="mp-meta-chip"><i className="fa-regular fa-clock"></i> {proj.due}</span>
                    <span className="mp-meta-chip"><i className="fa-solid fa-code-branch"></i> {proj.milestone}</span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#6B7280', marginBottom: '6px' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600 }}>{proj.progress}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${proj.progress}%`, height: '100%', background: proj.companyColor, borderRadius: '4px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                  <div className="mp-card-actions" style={{ marginTop: '16px' }}>
                    <button className="mp-btn-outline">Details</button>
                    <button className="mp-btn-filled">Workspace</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="mp-card">
            <div className="mp-card-top" style={{ marginBottom: '0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Upcoming Deadlines</h3>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deadlines.map((deadline, i) => (
                <div key={i} className="dash-deadline-item">
                  <div className="dash-deadline-info">
                    <h4>{deadline.title}</h4>
                    <p className="dash-deadline-due">{deadline.due}</p>
                  </div>
                  <span className={`mp-status-badge ${deadline.priority === 'High' ? 'mp-status-rejected' : deadline.priority === 'Medium' ? 'mp-status-pending' : 'mp-status-verified'}`}>
                    {deadline.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
