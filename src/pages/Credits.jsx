import { useMemo, useState } from 'react';
import { createProofSubmission, getStoredCredits } from '../data/creditsUtils';

const STATUS_MAP = {
  verified: { label: 'Verified', className: 'mp-status-verified' },
  pending: { label: 'Pending Review', className: 'mp-status-pending' },
  rejected: { label: 'Rejected', className: 'mp-status-rejected' },
};

const emptyProofForm = {
  title: '',
  issuer: '',
  hours: '',
  skills: '',
  proofUrl: '',
  notes: '',
  issuerColor: '#2563EB',
};

function CreditCard({ credit, onViewDetails }) {
  const status = STATUS_MAP[credit.status] ?? STATUS_MAP.pending;

  return (
    <div className="mp-card">
      <div className="mp-card-top">
        <span className={`mp-status-badge ${status.className}`}>{status.label}</span>
        <button type="button" className="mp-menu-btn" onClick={() => onViewDetails(credit)} aria-label={`View details for ${credit.title}`}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </button>
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
      {credit.notes && <p className="mp-description">{credit.notes}</p>}
      <div className="mp-card-actions">
        <a
          href={credit.proofUrl || '#'}
          className="mp-btn-outline job-link-btn"
          target={credit.proofUrl ? '_blank' : undefined}
          rel={credit.proofUrl ? 'noreferrer' : undefined}
        >
          View Proof
        </a>
        <button type="button" className="mp-btn-filled" onClick={() => onViewDetails(credit)}>Details</button>
      </div>
    </div>
  );
}

function Credits() {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [credits, setCredits] = useState(() => getStoredCredits());
  const [formData, setFormData] = useState(emptyProofForm);
  const [submitState, setSubmitState] = useState('idle');
  const [selectedCredit, setSelectedCredit] = useState(null);

  const filtered = useMemo(() => (
    filter === 'all'
      ? credits
      : credits.filter((credit) => credit.status === filter)
  ), [credits, filter]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextCredit = createProofSubmission(formData);
    setCredits((prev) => [nextCredit, ...prev]);
    setFormData(emptyProofForm);
    setSubmitState('submitted');
    setShowForm(false);
  };

  return (
    <div className="mp-page">
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Build Proof</h1>
          <p className="mp-page-subtitle">Turn completed learning and project work into proof employers can trust.</p>
        </div>
        <button className="mp-find-btn" style={{ marginLeft: 'auto' }} onClick={() => setShowForm((prev) => !prev)}>
          <i className="fa-solid fa-plus"></i> Submit New Proof
        </button>
      </div>

      {showForm && (
        <section className="mp-card portfolio-editor-panel proof-submit-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Proof submission</span>
              <h2>Add a new skill proof</h2>
            </div>
          </div>

          <form className="portfolio-form-grid" onSubmit={handleSubmit}>
            <label className="job-form-field">
              <span>Proof Title</span>
              <input value={formData.title} onChange={(event) => handleChange('title', event.target.value)} required />
            </label>
            <label className="job-form-field">
              <span>Issuer</span>
              <input value={formData.issuer} onChange={(event) => handleChange('issuer', event.target.value)} required />
            </label>
            <label className="job-form-field">
              <span>Hours Completed</span>
              <input type="number" min="1" value={formData.hours} onChange={(event) => handleChange('hours', event.target.value)} required />
            </label>
            <label className="job-form-field">
              <span>Proof Link</span>
              <input value={formData.proofUrl} onChange={(event) => handleChange('proofUrl', event.target.value)} placeholder="https://..." required />
            </label>
            <label className="job-form-field portfolio-wide-field">
              <span>Skills</span>
              <input value={formData.skills} onChange={(event) => handleChange('skills', event.target.value)} placeholder="React, UX, Analytics" required />
            </label>
            <label className="job-form-field portfolio-wide-field">
              <span>Context / Notes</span>
              <textarea rows="4" value={formData.notes} onChange={(event) => handleChange('notes', event.target.value)} placeholder="What did you build or learn, and why does it matter for your target role?" />
            </label>
            <button type="submit" className="mp-btn-filled job-submit-btn">Submit Proof</button>
          </form>
        </section>
      )}

      {submitState === 'submitted' && (
        <div className="proof-submit-toast">Proof submitted. It now appears in your proof tracker with `Pending Review` status.</div>
      )}

      <div className="mp-filter-bar">
        <div className="mp-tab-filters">
          <button className={`mp-tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Proof</button>
          <button className={`mp-tab-btn ${filter === 'verified' ? 'active' : ''}`} onClick={() => setFilter('verified')}>Verified</button>
          <button className={`mp-tab-btn ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending</button>
          <button className={`mp-tab-btn ${filter === 'rejected' ? 'active' : ''}`} onClick={() => setFilter('rejected')}>Rejected</button>
        </div>
      </div>

      {selectedCredit && (
        <section className="mp-card proof-detail-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Proof details</span>
              <h2>{selectedCredit.title}</h2>
            </div>
            <button type="button" className="mp-menu-btn" onClick={() => setSelectedCredit(null)} aria-label="Close proof details">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="proof-detail-grid">
            <div>
              <span>Issuer</span>
              <strong>{selectedCredit.issuer}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{STATUS_MAP[selectedCredit.status]?.label ?? selectedCredit.status}</strong>
            </div>
            <div>
              <span>Submitted</span>
              <strong>{selectedCredit.submittedDate}</strong>
            </div>
            <div>
              <span>Hours</span>
              <strong>{selectedCredit.hours}</strong>
            </div>
          </div>

          <div className="mp-tags">
            {selectedCredit.skills.map((skill) => (
              <span key={skill} className="mp-tag" style={{ color: '#2563EB' }}>{skill}</span>
            ))}
          </div>

          {selectedCredit.notes && <p className="mp-description">{selectedCredit.notes}</p>}
        </section>
      )}

      <div className="mp-card-grid mp-card-grid-full">
        {filtered.map((credit) => (
          <CreditCard key={credit.id} credit={credit} onViewDetails={setSelectedCredit} />
        ))}
        {filtered.length === 0 && (
          <div className="rich-empty-state">
            <h3>No proof in this status</h3>
            <p>Submit a new proof item or switch filters to review existing verified, pending, and rejected records.</p>
            <button type="button" className="mp-btn-filled job-link-btn" onClick={() => setShowForm(true)}>
              Submit New Proof
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Credits;
