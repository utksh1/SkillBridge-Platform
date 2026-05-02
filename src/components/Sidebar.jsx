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
    { to: '/', icon: 'fa-solid fa-border-all', label: 'Dashboard', badge: null },
    { to: '/courses', icon: 'fa-solid fa-book-open', label: 'Learn', badge: 12 },
    { to: '/portfolio', icon: 'fa-solid fa-award', label: 'Proof Portfolio', badge: 3 },
    { to: '/jobs', icon: 'fa-solid fa-briefcase', label: 'Jobs', badge: counts.savedJobs || null },
    { to: '/applications', icon: 'fa-solid fa-file-circle-check', label: 'Applications', badge: counts.applications || null },
  ];

  const isActivePath = (target) => {
    if (target === '/') return path === '/';
    return path === target || path.startsWith(`${target}/`);
  };

  return (
    <aside className="slim-sidebar">
      <div className="slim-sidebar-logo">
        <i className="fa-solid fa-bridge"></i>
      </div>
      
      <nav className="slim-sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`slim-nav-item ${isActivePath(item.to) ? 'active' : ''}`}
            title={item.label}
          >
            <i className={item.icon}></i>
            {item.badge && (
              <span className="slim-nav-badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="slim-sidebar-bottom">
        <Link to="/settings" className="slim-nav-item" title="Settings">
          <i className="fa-solid fa-gear"></i>
        </Link>
        <button type="button" className="slim-nav-item" title="Logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
