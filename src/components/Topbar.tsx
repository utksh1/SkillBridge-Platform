import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/mockData.json';
import { getApplicationReminders } from '../data/applicationUtils';
import { getStoredProfile } from '../data/profileUtils';

function Topbar() {
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const reminderCount = getApplicationReminders().length;
  const profile = getStoredProfile();

  const results = useMemo(() => {
    if (search.trim().length <= 1) return [];

    const normalizedSearch = search.toLowerCase();
    const jobResults = data.projects
      .filter(j => j.title.toLowerCase().includes(normalizedSearch))
      .slice(0, 3)
      .map(j => ({ ...j, type: 'job', link: `/jobs/${j.id}` }));

    const courseResults = data.courses
      .filter(c => c.title.toLowerCase().includes(normalizedSearch))
      .slice(0, 3)
      .map(c => ({ ...c, type: 'course', link: `/courses/${c.id}` }));

    return [...jobResults, ...courseResults];
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="slim-topbar">
      <div className="slim-search-bar" ref={searchRef}>
        <i className="fa-solid fa-search"></i>
        <input 
          type="text" 
          placeholder="Search task"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowResults(e.target.value.trim().length > 1);
          }}
          onFocus={() => setShowResults(search.trim().length > 1)}
        />
        <div className="search-shortcut">⌘ F</div>
        {showResults && results.length > 0 && (
          <div className="search-dropdown">
            {results.map((res, i) => (
              <Link
                key={i}
                to={res.link}
                className="search-result-item"
                onClick={() => {
                  setSearch('');
                  setShowResults(false);
                }}
              >
                <div className="res-icon">
                  <i className={res.type === 'job' ? 'fa-solid fa-briefcase' : 'fa-solid fa-book'}></i>
                </div>
                <div className="res-info">
                  <span className="res-title">{res.title}</span>
                  <span className="res-type">{res.type === 'job' ? res.company : 'Skill Pathway'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="slim-topbar-right">
        <Link to="/applications" className="slim-icon-btn" title="Messages">
          <i className="fa-regular fa-envelope"></i>
        </Link>
        <Link to="/applications" className="slim-icon-btn" title="Application reminders" style={{ position: 'relative' }}>
          <i className="fa-regular fa-bell"></i>
          <span className="slim-notification-badge">{reminderCount || 0}</span>
        </Link>
        <Link to="/settings" className="slim-profile-pill" title="Profile settings">
          <img src={profile.avatar || "https://i.pravatar.cc/150?img=12"} alt={profile.name} className="slim-topbar-avatar" />
          <span>
            <strong>{profile.name}</strong>
            <small>{profile.email}</small>
          </span>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
