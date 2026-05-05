import { useEffect, useMemo, useRef, useState } from 'react';
import { GlassmorphismPortfolioBlock } from '../components/ui/glassmorphism-portfolio-block-shadcnui';
import { createProofSubmission, getStoredCredits } from '../data/creditsUtils';
import { getPortfolioStats, getStoredPortfolio, saveStoredPortfolio } from '../data/portfolioUtils';
import { getStoredProfile, getTargetRoleMeta, saveStoredProfile } from '../data/profileUtils';

const STATUS_MAP = {
  verified: { label: 'Verified', className: 'mp-status-verified' },
  pending: { label: 'Pending Review', className: 'mp-status-pending' },
  rejected: { label: 'Rejected', className: 'mp-status-rejected' },
};

const ALL_PROOF_FILTER = 'all';

const emptyProofForm = {
  title: '',
  issuer: '',
  hours: '',
  skills: '',
  proofUrl: '',
  notes: '',
  issuerColor: '#2563EB',
};

const emptyCaseStudy = {
  title: 'New Case Study',
  project: 'Personal Project',
  projectColor: '#2563EB',
  type: 'Case Study',
  date: 'May 2026',
  verified: false,
  featured: true,
  skills: ['React', 'UX'],
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  role: 'Problem framing, design, and implementation',
  summary: 'Describe the problem, your approach, and the proof this project creates for hiring teams.',
  impact: 'Share a measurable result',
  link: 'https://alexmorgan.design/work/new-case-study',
};

function ProofCard({ credit, onViewDetails, onViewProof }) {
  const status = STATUS_MAP[credit.status] ?? STATUS_MAP.pending;

  return (
    <div className="mp-card proof-card">
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
        {credit.skills.map((skill) => (
          <span key={skill} className="mp-tag" style={{ color: '#2563EB' }}>{skill}</span>
        ))}
      </div>
      {credit.notes && <p className="mp-description">{credit.notes}</p>}
      <div className="mp-card-actions">
        <button type="button" className="mp-btn-outline job-link-btn" onClick={() => onViewProof(credit)}>
          View Proof
        </button>
        <button type="button" className="mp-btn-filled" onClick={() => onViewDetails(credit)}>Details</button>
      </div>
    </div>
  );
}

function Portfolio() {
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [portfolio, setPortfolio] = useState(() => getStoredPortfolio());
  const [selectedId, setSelectedId] = useState(portfolio.caseStudies[0]?.id ?? null);
  const [saveState, setSaveState] = useState('Saved');
  const [toastMessage, setToastMessage] = useState('');
  const [credits, setCredits] = useState(() => getStoredCredits());
  const [proofFilter, setProofFilter] = useState(ALL_PROOF_FILTER);
  const [showProofForm, setShowProofForm] = useState(false);
  const [proofFormData, setProofFormData] = useState(emptyProofForm);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const proofDetailRef = useRef(null);

  const targetRole = getTargetRoleMeta(profile.targetRole);
  const stats = useMemo(() => getPortfolioStats(portfolio), [portfolio]);
  const selectedCaseStudy = portfolio.caseStudies.find((item) => item.id === selectedId) ?? portfolio.caseStudies[0];
  const featuredProjects = portfolio.caseStudies.filter((item) => item.featured);
  const proofCounts = useMemo(() => ({
    total: credits.length,
    verified: credits.filter((credit) => credit.status === 'verified').length,
    pending: credits.filter((credit) => credit.status === 'pending').length,
  }), [credits]);
  const filteredCredits = useMemo(() => (
    proofFilter === ALL_PROOF_FILTER
      ? credits
      : credits.filter((credit) => credit.status === proofFilter)
  ), [credits, proofFilter]);

  useEffect(() => {
    if (selectedCredit) {
      proofDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCredit]);

  const updateProfile = (field, value) => {
    setSaveState('Unsaved');
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updatePortfolio = (field, value) => {
    setSaveState('Unsaved');
    setPortfolio((prev) => ({ ...prev, [field]: value }));
  };

  const updateCaseStudy = (id, patch) => {
    setSaveState('Unsaved');
    setPortfolio((prev) => ({
      ...prev,
      caseStudies: prev.caseStudies.map((item) => (
        item.id === id ? { ...item, ...patch } : item
      )),
    }));
  };

  const addCaseStudy = () => {
    const nextCaseStudy = {
      ...emptyCaseStudy,
      id: Date.now(),
    };

    setSaveState('Unsaved');
    setPortfolio((prev) => ({
      ...prev,
      caseStudies: [nextCaseStudy, ...prev.caseStudies],
    }));
    setSelectedId(nextCaseStudy.id);
  };

  const removeCaseStudy = (id) => {
    if (portfolio.caseStudies.length === 1) return;

    const nextCaseStudies = portfolio.caseStudies.filter((item) => item.id !== id);
    setSaveState('Unsaved');
    setPortfolio((prev) => ({ ...prev, caseStudies: nextCaseStudies }));
    setSelectedId(nextCaseStudies[0]?.id ?? null);
  };

  const handleSkillsChange = (value) => {
    updateCaseStudy(selectedCaseStudy.id, {
      skills: value.split(',').map((skill) => skill.trim()).filter(Boolean),
    });
  };

  const handleProofChange = (field, value) => {
    setProofFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProofSubmit = (event) => {
    event.preventDefault();
    const nextCredit = createProofSubmission(proofFormData);

    setCredits((prev) => [nextCredit, ...prev]);
    setProofFormData(emptyProofForm);
    setShowProofForm(false);
    setSelectedCredit(nextCredit);
    setToastMessage('Proof submitted and added to your portfolio workspace.');
  };

  const handleViewProof = (credit) => {
    if (credit.proofUrl) {
      window.open(credit.proofUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setSelectedCredit(credit);
  };

  const savePortfolio = () => {
    const nextProfile = saveStoredProfile({
      name: profile.name,
      headline: profile.headline,
      education: profile.education,
      portfolioUrl: portfolio.profileUrl,
      resumeUrl: portfolio.resumeUrl,
    });
    const nextPortfolio = saveStoredPortfolio(portfolio);

    setProfile(nextProfile);
    setPortfolio(nextPortfolio);
    setSaveState('Saved');
    setToastMessage('Portfolio saved.');
  };

  return (
    <div className="mp-page portfolio-editor-page">
      <div className="mp-page-header portfolio-editor-header">
        <div>
          <h1 className="mp-page-title">Proof Portfolio</h1>
          <p className="mp-page-subtitle">
            Manage your bio, case studies, verified proof, and Smart Apply bundle for {targetRole.shortLabel.toLowerCase()} roles.
          </p>
          {toastMessage && (
            <div className="ui-toast inline-toast" role="status">
              <i className="fa-solid fa-circle-check"></i> {toastMessage}
            </div>
          )}
        </div>
        <div className="portfolio-editor-actions">
          <span className={`portfolio-save-state ${saveState === 'Saved' ? 'saved' : 'unsaved'}`}>
            <i className={saveState === 'Saved' ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>
            {saveState}
          </span>
          <button type="button" className="mp-find-btn" onClick={savePortfolio}>
            <i className="fa-solid fa-floppy-disk"></i> Save Portfolio
          </button>
          <button type="button" className="mp-btn-outline proof-header-btn" onClick={() => setShowProofForm((prev) => !prev)}>
            <i className="fa-solid fa-plus"></i> Submit Proof
          </button>
        </div>
      </div>

      <section className="portfolio-glass-showcase">
        <GlassmorphismPortfolioBlock />
      </section>

      <section className="portfolio-summary-bar portfolio-editor-summary">
        <div className="portfolio-avatar-area">
          <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="portfolio-avatar" />
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.headline} - {profile.education}</p>
          </div>
        </div>
        <div className="portfolio-summary-stats">
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">{stats.skills}</span>
            <span className="portfolio-stat-label">Skills</span>
          </div>
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">{stats.artifacts}</span>
            <span className="portfolio-stat-label">Artifacts</span>
          </div>
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">{stats.featured}</span>
            <span className="portfolio-stat-label">Smart Apply</span>
          </div>
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">{proofCounts.verified}</span>
            <span className="portfolio-stat-label">Verified Proof</span>
          </div>
        </div>
      </section>

      <section className="proof-command-strip">
        <div>
          <span className="dash-section-kicker">Combined workspace</span>
          <h2>Build the proof, package the story, then apply with confidence.</h2>
        </div>
        <div className="proof-command-stats">
          <span>{proofCounts.total} total proof items</span>
          <span>{proofCounts.pending} pending review</span>
          <span>{featuredProjects.length} featured projects</span>
        </div>
      </section>

      <div className="portfolio-editor-layout">
        <section className="mp-card portfolio-editor-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Profile Story</span>
              <h2>Bio and Links</h2>
            </div>
          </div>

          <div className="portfolio-form-grid">
            <label className="job-form-field">
              <span>Full Name</span>
              <input value={profile.name} onChange={(event) => updateProfile('name', event.target.value)} />
            </label>
            <label className="job-form-field">
              <span>Headline</span>
              <input value={profile.headline} onChange={(event) => updateProfile('headline', event.target.value)} />
            </label>
            <label className="job-form-field">
              <span>Education</span>
              <input value={profile.education} onChange={(event) => updateProfile('education', event.target.value)} />
            </label>
            <label className="job-form-field">
              <span>Portfolio URL</span>
              <input value={portfolio.profileUrl} onChange={(event) => updatePortfolio('profileUrl', event.target.value)} />
            </label>
            <label className="job-form-field portfolio-wide-field">
              <span>Resume Link</span>
              <input value={portfolio.resumeUrl} onChange={(event) => updatePortfolio('resumeUrl', event.target.value)} />
            </label>
            <label className="job-form-field portfolio-wide-field">
              <span>Bio</span>
              <textarea
                rows="5"
                value={portfolio.bio}
                onChange={(event) => updatePortfolio('bio', event.target.value)}
              ></textarea>
            </label>
          </div>
        </section>

        <aside className="mp-card portfolio-editor-panel portfolio-smart-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Smart Apply Feed</span>
              <h2>Proof Bundle</h2>
            </div>
          </div>
          <div className="portfolio-proof-list">
            {(featuredProjects.length ? featuredProjects : portfolio.caseStudies.slice(0, 3)).slice(0, 4).map((item) => (
              <button
                type="button"
                className={`portfolio-proof-item ${item.id === selectedCaseStudy?.id ? 'active' : ''}`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{item.title}</span>
                <small>{item.skills.slice(0, 2).join(' + ') || item.type}</small>
              </button>
            ))}
          </div>
          <div className="portfolio-readiness-list">
            <div className={portfolio.bio ? 'ready' : ''}>
              <i className="fa-solid fa-circle-check"></i>
              Bio ready
            </div>
            <div className={stats.featured >= 2 ? 'ready' : ''}>
              <i className="fa-solid fa-circle-check"></i>
              2+ featured projects
            </div>
            <div className={stats.verified >= 2 ? 'ready' : ''}>
              <i className="fa-solid fa-circle-check"></i>
              Verified artifacts
            </div>
          </div>
        </aside>
      </div>

      <section className="mp-card portfolio-editor-panel">
        <div className="dash-section-top">
          <div>
            <span className="dash-section-kicker">Case Study Editor</span>
            <h2>Projects and Proof</h2>
          </div>
          <button type="button" className="mp-btn-outline portfolio-add-btn" onClick={addCaseStudy}>
            <i className="fa-solid fa-plus"></i> Add Project
          </button>
        </div>

        <div className="portfolio-case-study-workspace">
          <div className="portfolio-case-list">
            {portfolio.caseStudies.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`portfolio-case-tab ${item.id === selectedCaseStudy?.id ? 'active' : ''}`}
                onClick={() => setSelectedId(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.type} - {item.project}</span>
              </button>
            ))}
          </div>

          {selectedCaseStudy && (
            <div className="portfolio-case-editor">
              <div className="portfolio-form-grid">
                <label className="job-form-field">
                  <span>Title</span>
                  <input value={selectedCaseStudy.title} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { title: event.target.value })} />
                </label>
                <label className="job-form-field">
                  <span>Project or Client</span>
                  <input value={selectedCaseStudy.project} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { project: event.target.value })} />
                </label>
                <label className="job-form-field">
                  <span>Type</span>
                  <select value={selectedCaseStudy.type} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { type: event.target.value })}>
                    <option>Case Study</option>
                    <option>Live Project</option>
                    <option>Project Deliverable</option>
                    <option>Capstone Project</option>
                    <option>Research Paper</option>
                    <option>Certificate Project</option>
                  </select>
                </label>
                <label className="job-form-field">
                  <span>Date</span>
                  <input value={selectedCaseStudy.date} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { date: event.target.value })} />
                </label>
                <label className="job-form-field">
                  <span>Role</span>
                  <input value={selectedCaseStudy.role} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { role: event.target.value })} />
                </label>
                <label className="job-form-field">
                  <span>Impact</span>
                  <input value={selectedCaseStudy.impact} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { impact: event.target.value })} />
                </label>
                <label className="job-form-field">
                  <span>Artifact Link</span>
                  <input value={selectedCaseStudy.link} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { link: event.target.value })} />
                </label>
                <label className="job-form-field">
                  <span>Image URL</span>
                  <input value={selectedCaseStudy.image} onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { image: event.target.value })} />
                </label>
                <label className="job-form-field portfolio-wide-field">
                  <span>Skills</span>
                  <input value={selectedCaseStudy.skills.join(', ')} onChange={(event) => handleSkillsChange(event.target.value)} />
                </label>
                <label className="job-form-field portfolio-wide-field">
                  <span>Case Study Summary</span>
                  <textarea
                    rows="5"
                    value={selectedCaseStudy.summary}
                    onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { summary: event.target.value })}
                  ></textarea>
                </label>
              </div>

              <div className="portfolio-toggle-row">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCaseStudy.featured}
                    onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { featured: event.target.checked })}
                  />
                  Feature in Smart Apply
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCaseStudy.verified}
                    onChange={(event) => updateCaseStudy(selectedCaseStudy.id, { verified: event.target.checked })}
                  />
                  Verified proof
                </label>
                <button type="button" className="portfolio-delete-btn" onClick={() => removeCaseStudy(selectedCaseStudy.id)}>
                  <i className="fa-regular fa-trash-can"></i> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mp-card portfolio-editor-panel proof-workspace-panel">
        <div className="dash-section-top">
          <div>
            <span className="dash-section-kicker">Build Proof</span>
            <h2>Proof Tracker and Submission</h2>
          </div>
          <button type="button" className="mp-btn-outline portfolio-add-btn" onClick={() => setShowProofForm((prev) => !prev)}>
            <i className="fa-solid fa-plus"></i> Submit Proof
          </button>
        </div>

        {showProofForm && (
          <form className="portfolio-form-grid proof-inline-form" onSubmit={handleProofSubmit}>
            <div className="form-section">
              <div className="form-section-heading">
                <h3>New Proof Item</h3>
                <p>Add certificates, project outcomes, challenge submissions, or other evidence employers can trust.</p>
              </div>
              <label className="job-form-field">
                <span>Proof Title</span>
                <input value={proofFormData.title} onChange={(event) => handleProofChange('title', event.target.value)} required />
              </label>
              <label className="job-form-field">
                <span>Issuer</span>
                <input value={proofFormData.issuer} onChange={(event) => handleProofChange('issuer', event.target.value)} required />
              </label>
              <label className="job-form-field">
                <span>Hours Completed</span>
                <input type="number" min="1" value={proofFormData.hours} onChange={(event) => handleProofChange('hours', event.target.value)} required />
              </label>
              <label className="job-form-field">
                <span>Proof Link</span>
                <input value={proofFormData.proofUrl} onChange={(event) => handleProofChange('proofUrl', event.target.value)} placeholder="https://..." required />
              </label>
              <label className="job-form-field portfolio-wide-field">
                <span>Skills</span>
                <input value={proofFormData.skills} onChange={(event) => handleProofChange('skills', event.target.value)} placeholder="React, UX, Analytics" required />
              </label>
              <label className="job-form-field portfolio-wide-field">
                <span>Context / Notes</span>
                <textarea rows="4" value={proofFormData.notes} onChange={(event) => handleProofChange('notes', event.target.value)} placeholder="What did you build or learn, and why does it matter for your target role?" />
              </label>
              <button type="submit" className="mp-btn-filled job-submit-btn">Submit Proof</button>
            </div>
          </form>
        )}

        <div className="proof-filter-row">
          {[
            { key: ALL_PROOF_FILTER, label: 'All Proof' },
            { key: 'verified', label: 'Verified' },
            { key: 'pending', label: 'Pending' },
            { key: 'rejected', label: 'Rejected' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`mp-tab-btn ${proofFilter === item.key ? 'active' : ''}`}
              onClick={() => setProofFilter(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {selectedCredit && (
          <section className="proof-detail-panel inline-proof-detail" ref={proofDetailRef}>
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

        <div className="mp-card-grid mp-card-grid-full proof-grid">
          {filteredCredits.map((credit) => (
            <ProofCard key={credit.id} credit={credit} onViewDetails={setSelectedCredit} onViewProof={handleViewProof} />
          ))}
          {filteredCredits.length === 0 && (
            <div className="rich-empty-state">
              <h3>No proof in this status</h3>
              <p>Submit a new proof item or switch filters to review existing verified, pending, and rejected records.</p>
              <button type="button" className="mp-btn-filled job-link-btn" onClick={() => setShowProofForm(true)}>
                Submit New Proof
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="portfolio-preview-section">
        <div className="dash-section-top">
          <div>
            <span className="dash-section-kicker">Public Preview</span>
            <h2>Hiring Team View</h2>
          </div>
        </div>

        <div className="mp-card-grid mp-card-grid-full">
          {portfolio.caseStudies.map((item) => (
            <div className="portfolio-card" key={item.id}>
              <div className="portfolio-card-image">
                <img src={item.image} alt={item.title} />
                {item.verified && (
                  <span className="portfolio-verified-badge">
                    <i className="fa-solid fa-circle-check"></i> Verified
                  </span>
                )}
              </div>
              <div className="portfolio-card-body">
                <div className="mp-card-top" style={{ marginBottom: '8px' }}>
                  <span className="mp-posted">{item.date}</span>
                  <span className="mp-meta-chip" style={{ fontSize: '0.7rem' }}>{item.type}</span>
                </div>
                <h3 className="mp-card-title">{item.title}</h3>
                <span className="mp-company-name">{item.project}</span>
                <p className="portfolio-preview-copy">{item.summary}</p>
                <div className="mp-tags" style={{ marginTop: '12px' }}>
                  {item.skills.map((skill) => (
                    <span key={skill} className="mp-tag" style={{ color: '#2563EB' }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
