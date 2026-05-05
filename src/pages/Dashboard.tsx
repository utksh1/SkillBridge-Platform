import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/mockData.json';
import { getApplicationReminders, getStoredApplications } from '../data/applicationUtils';
import { getGoalMeta, getStoredProfile, getTargetRoleMeta, getWorkModeMeta } from '../data/profileUtils';
import { getStoredSavedJobs } from '../data/savedJobsUtils';

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
  const verifiedSkills = stats.find((stat) => stat.label === 'Verified Skills')?.value ?? 0;
  const activeProjectCount = stats.find((stat) => stat.label === 'Active Projects')?.value ?? activeProjects.length;
  const employerViews = stats.find((stat) => stat.label === 'Employer Views')?.value ?? 0;
  const completedItems = Math.max(10, creditRegistry.filter((credit) => credit.status === 'verified').length);
  const pendingItems = Math.max(2, deadlines.filter((deadline) => deadline.priority !== 'Low').length);

  useEffect(() => {
    const targetReadiness = stats.find((stat) => stat.progress)?.value ?? 0;
    const timer = window.setTimeout(() => setReadiness(targetReadiness), 280);

    return () => window.clearTimeout(timer);
  }, [stats]);

  const weekBars = [
    { day: 'S', value: 60, type: 'ghost' },
    { day: 'M', value: 70, type: 'filled' },
    { day: 'T', value: 55, type: 'soft', label: '74%' },
    { day: 'W', value: 82, type: 'dark' },
    { day: 'T', value: 68, type: 'ghost' },
    { day: 'F', value: 50, type: 'ghost' },
    { day: 'S', value: 64, type: 'ghost' },
  ];

  const dashboardCards = [
    {
      label: 'Total Proof',
      value: Math.max(24, verifiedSkills + profileSkills.length),
      note: 'Increased from last month',
      tone: 'primary',
      icon: 'fa-solid fa-arrow-up-right-from-square',
    },
    {
      label: 'Ended Projects',
      value: completedItems,
      note: 'Verified proof completed',
      icon: 'fa-solid fa-arrow-up-right-from-square',
    },
    {
      label: 'Running Projects',
      value: Math.max(12, activeProjectCount + savedJobs.length),
      note: `${workMode.shortLabel ?? workMode.label} focus`,
      icon: 'fa-solid fa-arrow-up-right-from-square',
    },
    {
      label: 'Pending Review',
      value: pendingItems,
      note: 'On discuss',
      icon: 'fa-solid fa-arrow-up-right-from-square',
    },
  ];

  const projectQueue = [
    { title: 'Project UI Design', due: '24 May 2024', icon: 'fa-solid fa-pen-nib', color: '#7DBE95' },
    { title: 'Illustration Donezo', due: '18 May 2024', icon: 'fa-solid fa-palette', color: '#1A3C2F' },
    { title: 'Landing Page Website', due: '22 May 2024', icon: 'fa-solid fa-code', color: '#7DBE95' },
  ];

  const teamRows = [
    { name: 'Alexandra Deff', avatar: 'https://i.pravatar.cc/100?img=12', task: 'Design Dashboard', status: 'Completed' },
    { name: 'Edwin Adenike', avatar: 'https://i.pravatar.cc/100?img=13', task: 'Illustration Donezo', status: 'In Progress' },
    { name: 'Isaac Oluwatemiloriun', avatar: 'https://i.pravatar.cc/100?img=14', task: 'Mobile App Illustration', status: 'Pending' },
    { name: 'David Oshodi', avatar: 'https://i.pravatar.cc/100?img=15', task: 'Illustration Character', status: 'In Progress' },
  ];

  return (
    <div className="mp-page dashboard-page donezo-dashboard">
      <section className="donezo-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>
        <div className="donezo-heading-actions">
          <Link to="/portfolio" className="donezo-btn donezo-btn-primary">
            <i className="fa-solid fa-plus"></i>
            Add Project
          </Link>
          <Link to="/jobs" className="donezo-btn donezo-btn-outline">
            Import Data
          </Link>
        </div>
      </section>

      <section className="donezo-stat-grid">
        <article className="donezo-stat-card primary">
          <div className="donezo-stat-top">
            <span>Total Projects</span>
            <span className="donezo-arrow"><i className="fa-solid fa-arrow-up-right-from-square"></i></span>
          </div>
          <strong>24</strong>
          <small>
            <i className="fa-solid fa-chart-line"></i>
            Increased from last month
          </small>
        </article>
        <article className="donezo-stat-card">
          <div className="donezo-stat-top">
            <span>Ended Projects</span>
            <span className="donezo-arrow"><i className="fa-solid fa-arrow-up-right-from-square"></i></span>
          </div>
          <strong>10</strong>
          <small>
            <i className="fa-solid fa-chart-line"></i>
            Increased from last month
          </small>
        </article>
        <article className="donezo-stat-card">
          <div className="donezo-stat-top">
            <span>Running Projects</span>
            <span className="donezo-arrow"><i className="fa-solid fa-arrow-up-right-from-square"></i></span>
          </div>
          <strong>12</strong>
          <small>
            <i className="fa-solid fa-chart-line"></i>
            Increased from last month
          </small>
        </article>
        <article className="donezo-stat-card">
          <div className="donezo-stat-top">
            <span>Pending Project</span>
            <span className="donezo-arrow"><i className="fa-solid fa-arrow-up-right-from-square"></i></span>
          </div>
          <strong>2</strong>
          <small>
            On Discuss
          </small>
        </article>
      </section>

      <section className="donezo-grid">
        <article className="donezo-panel donezo-analytics">
          <div className="donezo-panel-top">
            <h2>Project Analytics</h2>
          </div>
          <div className="donezo-bars">
            {weekBars.map((bar, index) => (
              <div className="donezo-bar-column" key={`${bar.day}-${index}`}>
                <div className="donezo-bar-wrap">
                  {bar.label && <span>{bar.label}</span>}
                  <div className={`donezo-bar ${bar.type}`} style={{ height: `${bar.value}%` }}></div>
                </div>
                <small>{bar.day}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="donezo-panel donezo-reminder">
          <div className="donezo-panel-top">
            <h2>Reminders</h2>
          </div>
          <h3>Meeting with Arc Company</h3>
          <p>Time : 02.00 pm - 04.00 pm</p>
          <Link to="/applications" className="donezo-meeting-btn">
            <i className="fa-solid fa-video"></i>
            Start Meeting
          </Link>
        </article>

        <article className="donezo-panel donezo-project-list">
          <div className="donezo-panel-top">
            <h2>Project</h2>
            <Link to="/portfolio" className="donezo-mini-btn">+ New</Link>
          </div>
          <div className="donezo-task-list">
            {projectQueue.map((project) => (
              <Link to="/courses" className="donezo-task-item" key={project.title}>
                <span style={{ color: project.color }}><i className={project.icon}></i></span>
                <div>
                  <strong>{project.title}</strong>
                  <small>Due date: {project.due}</small>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="donezo-panel donezo-team">
          <div className="donezo-panel-top">
            <h2>Team Collaboration</h2>
            <Link to="/portfolio" className="donezo-mini-btn">+ Add Member</Link>
          </div>
          <div className="donezo-team-list">
            {teamRows.map((row) => (
              <div className="donezo-team-row" key={row.name}>
                <img src={row.avatar} alt="" />
                <div>
                  <strong>{row.name}</strong>
                  <small>Working on {row.task}</small>
                </div>
                <span className={`donezo-status ${row.status.toLowerCase().replace(' ', '-')}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="donezo-panel donezo-progress">
          <div className="donezo-panel-top">
            <h2>Project Progress</h2>
          </div>
          <div className="donezo-gauge" style={{ '--readiness': readiness }}>
            <div className="donezo-gauge-inner">
              <strong>41%</strong>
              <span>Project Ended</span>
            </div>
          </div>
          <div className="donezo-legend">
            <span><i></i> Completed</span>
            <span><i></i> In Progress</span>
            <span><i></i> Pending</span>
          </div>
        </article>

        <article className="donezo-time-card">
          <span>Time Tracker</span>
          <strong>01:24:08</strong>
          <div>
            <button type="button" aria-label="Pause timer"><i className="fa-solid fa-pause"></i></button>
            <button type="button" aria-label="Stop timer"><i className="fa-solid fa-stop"></i></button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
