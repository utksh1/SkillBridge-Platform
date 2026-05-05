import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APPLICATIONS_CHANGED_EVENT, getStoredApplications } from '../data/applicationUtils';
import { SAVED_JOBS_CHANGED_EVENT, getStoredSavedJobs } from '../data/savedJobsUtils';
import { setAuthenticated } from '../data/profileUtils';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [counts, setCounts] = useState(() => ({
    applications: getStoredApplications().length,
    savedJobs: getStoredSavedJobs().length,
  }));

  useEffect(() => {
    const refreshCounts = () => {
      setCounts({
        applications: getStoredApplications().length,
        savedJobs: getStoredSavedJobs().length,
      });
    };

    window.addEventListener(APPLICATIONS_CHANGED_EVENT, refreshCounts);
    window.addEventListener(SAVED_JOBS_CHANGED_EVENT, refreshCounts);

    return () => {
      window.removeEventListener(APPLICATIONS_CHANGED_EVENT, refreshCounts);
      window.removeEventListener(SAVED_JOBS_CHANGED_EVENT, refreshCounts);
    };
  }, []);

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  const navItems = [
    { to: '/', icon: 'fa-solid fa-table-columns', label: 'Dashboard', badge: null },
    { to: '/tasks', icon: 'fa-solid fa-list-check', label: 'Tasks', badge: 12 },
    { to: '/calendar', icon: 'fa-solid fa-calendar-days', label: 'Calendar', badge: null },
    { to: '/analytics', icon: 'fa-solid fa-chart-simple', label: 'Analytics', badge: null },
    { to: '/team', icon: 'fa-solid fa-users', label: 'Team', badge: null },
  ];

  const isActivePath = (target) => {
    if (target === '/') return path === '/';
    return path === target || path.startsWith(`${target}/`);
  };

  return (
    <aside className="slim-sidebar">
      <div className="slim-sidebar-logo">
        <div className="donezo-logo-icon">
          <div className="inner-dot"></div>
        </div>
        <strong>Donezo</strong>
      </div>

      <span className="slim-sidebar-label">MENU</span>
      <nav className="slim-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`slim-nav-item ${isActivePath(item.to) ? 'active' : ''}`}
            title={item.label}
          >
            <i className={item.icon}></i>
            <span className="slim-nav-label">{item.label}</span>
            {item.badge && (
              <span className="slim-nav-badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="slim-sidebar-bottom">
        <span className="slim-sidebar-label">GENERAL</span>
        <Link to="/settings" className="slim-nav-item" title="Settings">
          <i className="fa-solid fa-gear"></i>
          <span className="slim-nav-label">Settings</span>
        </Link>
        <Link to="/help" className="slim-nav-item" title="Help">
          <i className="fa-solid fa-circle-question"></i>
          <span className="slim-nav-label">Help</span>
        </Link>
        <button type="button" className="slim-nav-item" title="Logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="slim-nav-label">Logout</span>
        </button>
        <div className="slim-download-card">
          <div className="app-icon-wrap">
            <i className="fa-solid fa-mobile-screen-button"></i>
          </div>
          <strong>Download our Mobile App</strong>
          <small>Get easy in another way</small>
          <button type="button">Download</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
