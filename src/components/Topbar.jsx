import { useState } from 'react';

function Topbar() {
  const [search, setSearch] = useState('');

  return (
    <header className="slim-topbar">
      <div className="slim-search-bar">
        <i className="fa-solid fa-search"></i>
        <input 
          type="text" 
          placeholder="Search..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="slim-topbar-right">
        <button className="slim-icon-btn" style={{ position: 'relative' }}>
          <i className="fa-regular fa-bell"></i>
          <span className="slim-notification-badge">5</span>
        </button>
        <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="slim-topbar-avatar" />
      </div>
    </header>
  );
}

export default Topbar;
