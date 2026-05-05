import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { createOrUpdateApplication, getStoredApplicationByJobId } from '../data/applicationUtils';
import { getEnrichedJob } from '../data/jobUtils';
import { getStoredProfile, getTargetRoleMeta } from '../data/profileUtils';
import { buildPortfolioApplicationIntro, getRelevantCaseStudies, getStoredPortfolio } from '../data/portfolioUtils';

function JobApply() {
  const { jobId } = useParams();
  const job = getEnrichedJob(jobId);
  const jobForForm = job ?? { company: '', tags: [] };
  const profile = getStoredProfile();
  const portfolio = getStoredPortfolio();
  const targetRole = getTargetRoleMeta(profile.targetRole);
  const relevantCaseStudies = getRelevantCaseStudies(jobForForm, portfolio, 3);
  const existingApplication = getStoredApplicationByJobId(jobId);
  const [submitted, setSubmitted] = useState(Boolean(existingApplication));

  // Form state is prefilled from the saved profile to remove repetitive input work.
  const [formData, setFormData] = useState({
    fullName: existingApplication?.fullName || profile.name,
    email: existingApplication?.email || profile.email,
    phone: existingApplication?.phone || profile.phone,
    portfolio: existingApplication?.portfolio || portfolio.profileUrl || profile.portfolioUrl,
    resume: existingApplication?.resume || portfolio.resumeUrl || profile.resumeUrl,
    location: existingApplication?.location || profile.location,
    notice: existingApplication?.notice || 'Immediate',
    fit: existingApplication?.fit || buildPortfolioApplicationIntro(profile, jobForForm, portfolio),
  });

  if (!job) {
    return (
      <div className="mp-page">
        <div className="job-apply-shell">
          <div className="mp-card job-apply-card">
            <span className="dash-section-kicker">Application</span>
            <h1 className="mp-page-title" style={{ marginBottom: '10px' }}>Job not found</h1>
            <p className="mp-page-subtitle" style={{ marginBottom: '20px' }}>
              This job listing is no longer available or the link is incorrect.
            </p>
            <Link to="/jobs" className="mp-btn-filled job-link-btn" style={{ maxWidth: '220px' }}>
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createOrUpdateApplication({ job, formData });
    setSubmitted(true);
  };

  return (
    <div className="mp-page">
      <div className="job-apply-shell">
        <section className="job-apply-hero">
          <Link to={`/jobs/${job.id}`} className="job-back-link">
            <i className="fa-solid fa-arrow-left"></i> Back to Role Details
          </Link>

          <div className="job-apply-hero-main">
            <div className="job-apply-brand">
              <div className="mp-company-logo job-apply-logo" style={{ backgroundColor: job.companyColor }}>
                {job.companyInitial}
              </div>
              <div>
                <h1 className="job-apply-title">{job.title}</h1>
                <p className="job-apply-company">{job.company}</p>
              </div>
            </div>

            <div className="job-apply-pills">
              <span className="mp-meta-chip"><i className="fa-regular fa-briefcase"></i> {job.type}</span>
              <span className="mp-meta-chip"><i className="fa-regular fa-money-bill-1"></i> {job.pay}</span>
              <span className="mp-meta-chip"><i className="fa-regular fa-calendar"></i> {job.experience}</span>
              <span className="mp-meta-chip"><i className="fa-regular fa-clock"></i> {job.posted}</span>
            </div>

            <p className="job-apply-summary">{job.description}</p>

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

        <div className="job-apply-grid">
          <section className="mp-card job-apply-card">
            <div className="dash-section-top">
              <div>
                <span className="dash-section-kicker">Smart Application</span>
                <h2>Apply for this role</h2>
              </div>
              {!submitted && <span className="prefill-notice"><i className="fa-solid fa-wand-magic-sparkles"></i> Prefilled from your profile</span>}
            </div>

            {!submitted && (
              <div className="job-prefill-summary">
                <div className="job-prefill-item">
                  <span className="job-prefill-label">Target role</span>
                  <strong>{targetRole.label}</strong>
                </div>
                <div className="job-prefill-item">
                  <span className="job-prefill-label">Profile headline</span>
                  <strong>{profile.headline}</strong>
                </div>
                <div className="job-prefill-item">
                  <span className="job-prefill-label">Ready to send</span>
                  <strong>{relevantCaseStudies.length} portfolio proofs matched</strong>
                </div>
              </div>
            )}

            {submitted ? (
              <div className="job-apply-success">
                <div className="job-apply-success-icon">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3>Application submitted</h3>
                <p>
                  Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been queued for review.
                  You can track the status from your application tracker.
                </p>
                <div className="job-apply-success-actions">
                  <Link to="/applications" className="mp-btn-filled job-link-btn">Track Application</Link>
                  <button type="button" className="mp-btn-outline job-link-btn" onClick={() => setSubmitted(false)}>Edit Application</button>
                  <Link to="/jobs" className="mp-btn-outline job-link-btn">Browse More Jobs</Link>
                </div>
              </div>
            ) : (
              <form className="job-apply-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="form-section-heading">
                    <h3>Candidate Details</h3>
                    <p>Your contact information for this application.</p>
                  </div>
                  <label className="job-form-field">
                    <span>Full Name</span>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </label>
                  <label className="job-form-field">
                    <span>Email Address</span>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </label>
                  <label className="job-form-field">
                    <span>Phone Number</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </label>
                  <label className="job-form-field">
                    <span>Current Location</span>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                  </label>
                </div>

                <div className="form-section">
                  <div className="form-section-heading">
                    <h3>Role Links</h3>
                    <p>Portfolio, resume, and availability details.</p>
                  </div>
                  <label className="job-form-field">
                    <span>Portfolio URL</span>
                    <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} required />
                  </label>
                  <label className="job-form-field">
                    <span>Resume Link</span>
                    <input type="url" name="resume" value={formData.resume} onChange={handleInputChange} required />
                  </label>
                  <label className="job-form-field">
                    <span>Target Role</span>
                    <input type="text" value={targetRole.label} readOnly />
                  </label>
                  <label className="job-form-field">
                    <span>Notice Period</span>
                    <select name="notice" value={formData.notice} onChange={handleInputChange} required>
                      <option>Immediate</option>
                      <option>15 days</option>
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </label>
                </div>

                <div className="form-section">
                  <div className="form-section-heading">
                    <h3>Fit Summary</h3>
                    <p>The pitch that will travel with this application.</p>
                  </div>
                  <label className="job-form-field portfolio-wide-field">
                    <span>Why are you a good fit?</span>
                    <textarea
                      rows="6"
                      name="fit"
                      value={formData.fit}
                      onChange={handleInputChange}
                      placeholder="Share your relevant experience, strongest skills, and why you want this job."
                      required
                    ></textarea>
                  </label>
                </div>

                <button type="submit" className="mp-btn-filled job-submit-btn">Submit Application</button>
              </form>
            )}
          </section>

          <aside className="job-apply-side">
            <div className="mp-card job-apply-card">
              <div className="dash-section-top">
                <div>
                  <span className="dash-section-kicker">What happens next</span>
                  <h2>Application Timeline</h2>
                </div>
              </div>
              <div className="job-apply-timeline">
                <div className="job-apply-step">
                  <span className="job-apply-step-dot"></span>
                  <div>
                    <h4>Resume Review</h4>
                    <p>Hiring team checks your skills, portfolio, and role fit.</p>
                  </div>
                </div>
                <div className="job-apply-step">
                  <span className="job-apply-step-dot"></span>
                  <div>
                    <h4>Shortlisting</h4>
                    <p>Selected candidates move into a screening or recruiter round.</p>
                  </div>
                </div>
                <div className="job-apply-step">
                  <span className="job-apply-step-dot"></span>
                  <div>
                    <h4>Interview Loop</h4>
                    <p>Expect skill evaluation, portfolio discussion, and role-based questions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mp-card job-apply-card">
              <div className="dash-section-top">
                <div>
                  <span className="dash-section-kicker">Smart Apply proof</span>
                  <h2>Matched Portfolio Work</h2>
                </div>
              </div>
              <div className="job-proof-list">
                {relevantCaseStudies.map((item) => (
                  <div className="job-proof-item" key={item.id}>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.impact || item.project}</p>
                    </div>
                    {item.verified && <span>Verified</span>}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default JobApply;
