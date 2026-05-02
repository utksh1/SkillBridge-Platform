import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../data/jobUtils';
import { getStoredSavedJobs, SAVED_JOBS_CHANGED_EVENT, toggleSavedJob } from '../data/savedJobsUtils';

const JOBS = getJobs();
const ALL_FILTER = 'all';

const getUniqueValues = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b));

const getTagBackground = (color) => `${color}14`;

const parseHourlyPay = (pay) => Number(pay.match(/\d+/)?.[0] ?? 0);

const parsePostedDays = (posted) => {
  const value = Number(posted.match(/\d+/)?.[0] ?? 0);

  if (posted.includes('week')) return value * 7;
  if (posted.includes('month')) return value * 30;

  return value;
};

const getSavedJobIds = () => new Set(getStoredSavedJobs().map((job) => job.jobId));

function JobCard({ job, saved, onToggleSaved }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyState, setCopyState] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    const isNowSaved = onToggleSaved(job);
    setToastMessage(isNowSaved ? 'Job saved.' : 'Job removed from saved jobs.');
    setMenuOpen(false);
  };

  const handleCopyLink = async () => {
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;

    try {
      await window.navigator.clipboard.writeText(jobUrl);
      setCopyState('Copied');
      setToastMessage('Job link copied.');
    } catch {
      setCopyState(jobUrl);
      setToastMessage('Copy failed. Link is shown in the menu.');
    }
  };

  return (
    <div className={`mp-card job-card ${saved ? 'job-card-saved' : ''}`}>
      <div className="mp-card-top">
        <span className="mp-posted">{job.posted}</span>
        <div className="job-card-badges" ref={menuRef}>
          {job.mode && <span className="job-mode-badge">{job.mode}</span>}
          <button
            type="button"
            className={`job-save-icon-btn ${saved ? 'saved' : ''}`}
            aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
            aria-pressed={saved}
            title={saved ? 'Saved job' : 'Save job'}
            onClick={handleSave}
          >
            <i className={saved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
          </button>
          <button
            type="button"
            className="mp-menu-btn"
            aria-label={`More options for ${job.title}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
          {menuOpen && (
            <div className="job-card-menu">
              <button type="button" onClick={handleSave}>
                <i className={saved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
                {saved ? 'Remove saved' : 'Save job'}
              </button>
              <Link to={`/jobs/${job.id}`}>
                <i className="fa-regular fa-file-lines"></i>
                View role
              </Link>
              <button type="button" onClick={handleCopyLink}>
                <i className="fa-regular fa-copy"></i>
                {copyState || 'Copy link'}
              </button>
            </div>
          )}
        </div>
      </div>
      {toastMessage && (
        <div className="ui-toast inline-toast" role="status">
          <i className="fa-solid fa-circle-check"></i> {toastMessage}
        </div>
      )}
      <div className="mp-card-header">
        <div className="mp-company-logo" style={{ backgroundColor: job.companyColor }}>
          {job.companyInitial}
        </div>
        <div>
          <h3 className="mp-card-title">{job.title}</h3>
          <span className="mp-company-name">{job.company} {job.location && `• ${job.location}`}</span>
        </div>
      </div>
      <div className="mp-meta-row">
        <span className="mp-meta-chip"><i className="fa-regular fa-briefcase"></i> {job.type}</span>
        <span className="mp-meta-chip"><i className="fa-regular fa-money-bill-1"></i> {job.pay}</span>
        <span className="mp-meta-chip"><i className="fa-regular fa-calendar"></i> {job.experience}</span>
      </div>
      <p className="mp-description">{job.description}</p>
      <div className="mp-tags">
        {job.tags.map((tag, i) => (
          <span
            key={i}
            className="mp-tag"
            style={{ color: tag.color, backgroundColor: getTagBackground(tag.color) }}
          >
            {tag.label}
          </span>
        ))}
      </div>
      <div className="mp-card-actions">
        <Link to={`/jobs/${job.id}`} className="mp-btn-filled job-link-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

function Jobs() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [classification, setClassification] = useState(ALL_FILTER);
  const [company, setCompany] = useState(ALL_FILTER);
  const [sortBy, setSortBy] = useState('relevant');
  const [jobType, setJobType] = useState(ALL_FILTER);
  const [experience, setExperience] = useState(ALL_FILTER);
  const [viewMode, setViewMode] = useState('grid');
  const [savedJobIds, setSavedJobIds] = useState(() => getSavedJobIds());

  useEffect(() => {
    const syncSavedJobs = () => setSavedJobIds(getSavedJobIds());

    window.addEventListener(SAVED_JOBS_CHANGED_EVENT, syncSavedJobs);
    window.addEventListener('storage', syncSavedJobs);

    return () => {
      window.removeEventListener(SAVED_JOBS_CHANGED_EVENT, syncSavedJobs);
      window.removeEventListener('storage', syncSavedJobs);
    };
  }, []);

  const classificationOptions = getUniqueValues(JOBS.flatMap((job) => job.tags.map((tag) => tag.label)));
  const companyOptions = getUniqueValues(JOBS.map((job) => job.company));
  const jobTypeOptions = getUniqueValues(JOBS.map((job) => job.type));
  const experienceOptions = getUniqueValues(JOBS.map((job) => job.experience));
  const searchTerm = search.trim().toLowerCase();
  const filteredJobs = JOBS.filter((job) => {
    const tags = job.tags.map((tag) => tag.label);
    const searchableText = [job.title, job.company, job.type, job.experience, job.description, ...tags].join(' ').toLowerCase();

    return (
      (!searchTerm || searchableText.includes(searchTerm)) &&
      (classification === ALL_FILTER || tags.includes(classification)) &&
      (company === ALL_FILTER || job.company === company) &&
      (jobType === ALL_FILTER || job.type === jobType) &&
      (experience === ALL_FILTER || job.experience === experience)
    );
  }).sort((a, b) => {
    const savedPriority = Number(savedJobIds.has(b.id)) - Number(savedJobIds.has(a.id));

    if (savedPriority !== 0) return savedPriority;
    if (sortBy === 'recent') return parsePostedDays(a.posted) - parsePostedDays(b.posted);
    if (sortBy === 'salary') return parseHourlyPay(b.pay) - parseHourlyPay(a.pay);

    return a.id - b.id;
  });

  const handleToggleSaved = (job) => {
    const result = toggleSavedJob(job);
    setSavedJobIds(new Set(result.savedJobs.map((item) => item.jobId)));
    return result.saved;
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="mp-page">
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Jobs</h1>
          <p className="mp-page-subtitle">Apply to roles that match the skills you&apos;ve built and the proof you can show.</p>
        </div>
      </div>

      <form className="mp-filter-bar" onSubmit={handleSearchSubmit}>
        <div className="mp-search-filter">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search jobs by title, company, or skill..."
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
        </div>
        <div className="mp-dropdown-filter">
          <select
            aria-label="Filter jobs by specialization"
            value={classification}
            onChange={(event) => setClassification(event.target.value)}
          >
            <option value={ALL_FILTER}>Specialization</option>
            {classificationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
        <div className="mp-dropdown-filter">
          <i className="fa-solid fa-building"></i>
          <select aria-label="Filter jobs by company" value={company} onChange={(event) => setCompany(event.target.value)}>
            <option value={ALL_FILTER}>Company</option>
            {companyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
        <button className="mp-find-btn" type="submit">Find Jobs</button>
        <div className="mp-view-toggles">
          <button
            className={`mp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            type="button"
            onClick={() => setViewMode('grid')}
          >
            <i className="fa-solid fa-grip"></i>
          </button>
          <button
            className={`mp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            type="button"
            onClick={() => setViewMode('list')}
          >
            <i className="fa-solid fa-list"></i>
          </button>
        </div>
      </form>

      <div className="mp-content-layout">
        <aside className="mp-sidebar-filter">
          <div className="mp-filter-section">
            <h4><i className="fa-solid fa-filter"></i> Job Filters</h4>
          </div>
          <div className="mp-filter-section">
            <h4>Sort By</h4>
            <label className="mp-radio-label">
              <input type="radio" name="sort" value="relevant" checked={sortBy === 'relevant'} onChange={() => setSortBy('relevant')} />
              <span>Most Relevant</span>
            </label>
            <label className="mp-radio-label">
              <input type="radio" name="sort" value="recent" checked={sortBy === 'recent'} onChange={() => setSortBy('recent')} />
              <span>Most Recent</span>
            </label>
            <label className="mp-radio-label">
              <input type="radio" name="sort" value="salary" checked={sortBy === 'salary'} onChange={() => setSortBy('salary')} />
              <span>Top Salary</span>
            </label>
          </div>
          <div className="mp-filter-section">
            <h4>Job Type</h4>
            <label className="mp-radio-label">
              <input type="radio" name="type" value={ALL_FILTER} checked={jobType === ALL_FILTER} onChange={() => setJobType(ALL_FILTER)} />
              <span>All Types</span>
            </label>
            {jobTypeOptions.map((option) => (
              <label className="mp-radio-label" key={option}>
                <input type="radio" name="type" value={option} checked={jobType === option} onChange={() => setJobType(option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div className="mp-filter-section">
            <h4>Experience</h4>
            <label className="mp-radio-label">
              <input type="radio" name="exp" value={ALL_FILTER} checked={experience === ALL_FILTER} onChange={() => setExperience(ALL_FILTER)} />
              <span>All Experience</span>
            </label>
            {experienceOptions.map((option) => (
              <label className="mp-radio-label" key={option}>
                <input type="radio" name="exp" value={option} checked={experience === option} onChange={() => setExperience(option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </aside>

        <div className={`mp-card-grid job-card-grid ${viewMode === 'list' ? 'mp-card-list' : ''}`}>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} saved={savedJobIds.has(job.id)} onToggleSaved={handleToggleSaved} />
          ))}
          {filteredJobs.length === 0 && (
            <div className="mp-empty-state">No matching jobs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
