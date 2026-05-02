import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getEnrichedJob } from '../data/jobUtils';
import { isSavedJob, toggleSavedJob } from '../data/savedJobsUtils';

function JobDetails() {
  const { jobId } = useParams();
  const job = getEnrichedJob(jobId);
  const [saved, setSaved] = useState(() => (job ? isSavedJob(job.id) : false));

  if (!job) {
    return (
      <div className="mp-page">
        <div className="job-apply-shell">
          <div className="mp-card job-apply-card">
            <h1 className="mp-page-title">Job not found</h1>
            <Link to="/jobs" className="mp-btn-filled job-link-btn" style={{ maxWidth: '220px', marginTop: '20px' }}>
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-page">
      <div className="job-apply-shell">
        <section className="job-apply-hero">
          <Link to="/jobs" className="job-back-link">
            <i className="fa-solid fa-arrow-left"></i> Back to Marketplace
          </Link>

          <div className="job-apply-hero-main">
            <div className="job-apply-brand">
              <div className="mp-company-logo job-apply-logo" style={{ backgroundColor: job.companyColor }}>
                {job.companyInitial}
              </div>
              <div>
                <h1 className="job-apply-title">{job.title}</h1>
                <p className="job-apply-company">{job.company} • {job.location || 'Remote'}</p>
              </div>
            </div>

            <div className="job-apply-pills">
              <span className="mp-meta-chip"><i className="fa-regular fa-briefcase"></i> {job.type}</span>
              <span className="mp-meta-chip"><i className="fa-regular fa-building"></i> {job.mode || 'Remote'}</span>
              <span className="mp-meta-chip"><i className="fa-regular fa-money-bill-1"></i> {job.pay}</span>
              <span className="mp-meta-chip"><i className="fa-regular fa-calendar"></i> {job.experience}</span>
            </div>

            <div className="job-details-actions">
              <Link to={`/jobs/${job.id}/apply`} className="mp-btn-filled job-apply-main-btn">
                Apply for this role
              </Link>
              <button
                className="mp-btn-outline job-save-btn"
                type="button"
                onClick={() => {
                  const result = toggleSavedJob(job);
                  setSaved(result.saved);
                }}
              >
                <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}></i> {saved ? 'Saved' : 'Save Job'}
              </button>
            </div>
          </div>
        </section>

        <div className="job-apply-grid">
          <section className="mp-card job-apply-card">
            <div className="job-details-section">
              <h3>About the Role</h3>
              <p className="job-apply-summary">{job.description}</p>
            </div>

            {job.responsibilities && (
              <div className="job-details-section">
                <h3>Key Responsibilities</h3>
                <ul className="job-details-list">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && (
              <div className="job-details-section">
                <h3>Requirements</h3>
                <ul className="job-details-list">
                  {job.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="job-details-section">
              <h3>Skills & Technologies</h3>
              <div className="mp-tags">
                {job.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="mp-tag"
                    style={{ color: tag.color, backgroundColor: `${tag.color}14` }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <aside className="job-apply-side">
            <div className="mp-card job-apply-card">
              <div className="dash-section-top">
                <div>
                  <span className="dash-section-kicker">Company info</span>
                  <h2>About {job.company}</h2>
                </div>
              </div>
              <p style={{ color: '#64748B', lineHeight: '1.6', fontSize: '0.9rem' }}>
                {job.company} is a leading innovator in its field, dedicated to building world-class products 
                and fostering a culture of excellence and growth.
              </p>
              <div className="company-quick-stats">
                <div className="c-stat">
                  <span>Size</span>
                  <strong>1000+ Employees</strong>
                </div>
                <div className="c-stat">
                  <span>Industry</span>
                  <strong>Technology / SaaS</strong>
                </div>
              </div>
            </div>

            <div className="mp-card job-apply-card">
              <div className="dash-section-top">
                <div>
                  <span className="dash-section-kicker">Why apply?</span>
                  <h2>Benefits & Perks</h2>
                </div>
              </div>
              <ul className="job-apply-checklist">
                <li>Flexible working hours and remote options</li>
                <li>Comprehensive health and wellness programs</li>
                <li>Learning and development budget</li>
                <li>Performance-based bonuses and equity</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
