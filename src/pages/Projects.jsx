import data from '../data/mockData.json';
import { useState } from 'react';

const PROJECTS = data.projects;
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

function ProjectCard({ project }) {
  return (
    <div className="mp-card job-card">
      <div className="mp-card-top">
        <span className="mp-posted">{project.posted}</span>
        <button className="mp-menu-btn"><i className="fa-solid fa-ellipsis-vertical"></i></button>
      </div>
      <div className="mp-card-header">
        <div className="mp-company-logo" style={{ backgroundColor: project.companyColor }}>
          {project.companyInitial}
        </div>
        <div>
          <h3 className="mp-card-title">{project.title}</h3>
          <span className="mp-company-name">{project.company}</span>
        </div>
      </div>
      <div className="mp-meta-row">
        <span className="mp-meta-chip"><i className="fa-regular fa-briefcase"></i> {project.type}</span>
        <span className="mp-meta-chip"><i className="fa-regular fa-money-bill-1"></i> {project.pay}</span>
        <span className="mp-meta-chip"><i className="fa-regular fa-calendar"></i> {project.experience}</span>
      </div>
      <p className="mp-description">
        {project.description} <a href="#" className="link-blue">Read more</a>
      </p>
      <div className="mp-tags">
        {project.tags.map((tag, i) => (
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
        <button className="mp-btn-outline">Details</button>
        <button className="mp-btn-filled">Apply</button>
      </div>
    </div>
  );
}

function Projects() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [classification, setClassification] = useState(ALL_FILTER);
  const [company, setCompany] = useState(ALL_FILTER);
  const [sortBy, setSortBy] = useState('relevant');
  const [jobType, setJobType] = useState(ALL_FILTER);
  const [experience, setExperience] = useState(ALL_FILTER);
  const [viewMode, setViewMode] = useState('grid');

  const classificationOptions = getUniqueValues(PROJECTS.flatMap((project) => project.tags.map((tag) => tag.label)));
  const companyOptions = getUniqueValues(PROJECTS.map((project) => project.company));
  const jobTypeOptions = getUniqueValues(PROJECTS.map((project) => project.type));
  const experienceOptions = getUniqueValues(PROJECTS.map((project) => project.experience));
  const searchTerm = search.trim().toLowerCase();
  const filteredProjects = PROJECTS.filter((project) => {
    const tags = project.tags.map((tag) => tag.label);
    const searchableText = [project.title, project.company, project.type, project.experience, project.description, ...tags].join(' ').toLowerCase();

    return (
      (!searchTerm || searchableText.includes(searchTerm)) &&
      (classification === ALL_FILTER || tags.includes(classification)) &&
      (company === ALL_FILTER || project.company === company) &&
      (jobType === ALL_FILTER || project.type === jobType) &&
      (experience === ALL_FILTER || project.experience === experience)
    );
  }).sort((a, b) => {
    if (sortBy === 'recent') return parsePostedDays(a.posted) - parsePostedDays(b.posted);
    if (sortBy === 'salary') return parseHourlyPay(b.pay) - parseHourlyPay(a.pay);

    return a.id - b.id;
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="mp-page">
      {/* Page Header */}
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Project Marketplace</h1>
          <p className="mp-page-subtitle">Find your perfect career opportunity</p>
        </div>
      </div>

      {/* Filter Bar */}
      <form className="mp-filter-bar" onSubmit={handleSearchSubmit}>
        <div className="mp-search-filter">
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search a Job by Job title, Company..."
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              setSearch(event.target.value);
            }}
          />
        </div>
        <div className="mp-dropdown-filter">
          <select
            aria-label="Filter jobs by classification"
            value={classification}
            onChange={(event) => setClassification(event.target.value)}
          >
            <option value={ALL_FILTER}>Classification</option>
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
        <button className="mp-find-btn" type="submit">Find Job</button>
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

      {/* Main Content: Sidebar Filter + Card Grid */}
      <div className="mp-content-layout">
        {/* Sidebar Filters */}
        <aside className="mp-sidebar-filter">
          <div className="mp-filter-section">
            <h4><i className="fa-solid fa-filter"></i> Job Filter</h4>
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

        {/* Card Grid */}
        <div className={`mp-card-grid job-card-grid ${viewMode === 'list' ? 'mp-card-list' : ''}`}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="mp-empty-state">No matching jobs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
