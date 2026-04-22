import data from '../data/mockData.json';
import { useState } from 'react';

const CREDITS = data.credits;

const STATUS_MAP = {
  verified: { label: 'Verified', className: 'mp-status-verified' },
  pending: { label: 'Pending Review', className: 'mp-status-pending' },
  rejected: { label: 'Rejected', className: 'mp-status-rejected' },
};

function CreditCard({ credit }) {
  const status = STATUS_MAP[credit.status];
  return (
    <div className="mp-card">
      <div className="mp-card-top">
        <span className={`mp-status-badge ${status.className}`}>{status.label}</span>
        <button className="mp-menu-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
      </div>
      <div className="mp-card-header">
        <div className="mp-company-logo" style={{ backgroundColor: credit.issuerColor }}>
          {credit.issuerInitial}
        </div>
        <div>
          <h3 className="mp-card-title">{credit.title}</h3>
          <span className="mp-company-name">{credit.issuer}</span>
        </div>
      </div>
      <div className="mp-meta-row">
        <span className="mp-meta-chip"><i className="fa-regular fa-clock"></i> {credit.hours}</span>
        <span className="mp-meta-chip"><i className="fa-regular fa-calendar"></i> {credit.submittedDate}</span>
      </div>
      <div className="mp-tags">
        {credit.skills.map((skill, i) => (
          <span key={i} className="mp-tag" style={{ color: '#2563EB' }}>{skill}</span>
        ))}
      </div>
      <div className="mp-card-actions">
        <button className="mp-btn-outline">View Proof</button>
        <button className="mp-btn-filled">Details</button>
      </div>
    </div>
  );
}

function Credits() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? CREDITS
    : CREDITS.filter(c => c.status === filter);

  return (
    <div className="mp-page">
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Skill Credits</h1>
          <p className="mp-page-subtitle">Submit and track your verified learning credentials</p>
        </div>
        <button className="mp-find-btn" style={{ marginLeft: 'auto' }}>
          <i className="fa-solid fa-plus"></i> Submit New Credit
        </button>
      </div>

      <div className="mp-filter-bar">
        <div className="mp-tab-filters">
          <button className={`mp-tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Credits</button>
          <button className={`mp-tab-btn ${filter === 'verified' ? 'active' : ''}`} onClick={() => setFilter('verified')}>Verified</button>
          <button className={`mp-tab-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`mp-tab-btn ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>Rejected</button>
        </div>
      </div>

      <div className="mp-card-grid mp-card-grid-full">
        {filtered.map((credit) => (
          <CreditCard key={credit.id} credit={credit} />
        ))}
      </div>
    </div>
  );
}

export default Credits;
