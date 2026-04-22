import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: '/', icon: 'fa-solid fa-border-all', label: 'Dashboard', badge: null },
    { to: '/courses', icon: 'fa-solid fa-book-open', label: 'Courses', badge: 12 },
    { to: '/projects', icon: 'fa-solid fa-briefcase', label: 'Projects', badge: 8 },
    { to: '/credits', icon: 'fa-solid fa-award', label: 'Credits', badge: 3 },
    { to: '/portfolio', icon: 'fa-solid fa-id-card', label: 'Portfolio', badge: null },
  ];

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
            className={`slim-nav-item ${path === item.to ? 'active' : ''}`}
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
        <Link to="/login" className="slim-nav-item" title="Logout">
          <i className="fa-solid fa-right-from-bracket"></i>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
