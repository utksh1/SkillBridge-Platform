import data from '../data/mockData.json';

const PORTFOLIO_ARTIFACTS = data.portfolioArtifacts;

function Portfolio() {
  return (
    <div className="mp-page">
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">E-Portfolio</h1>
          <p className="mp-page-subtitle">Showcase your verified work to employers</p>
        </div>
        <button className="mp-find-btn" style={{ marginLeft: 'auto' }}>
          <i className="fa-solid fa-share-nodes"></i> Share Profile
        </button>
      </div>

      {/* Profile Summary Bar */}
      <div className="portfolio-summary-bar">
        <div className="portfolio-avatar-area">
          <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="portfolio-avatar" />
          <div>
            <h2>Alex Morgan</h2>
            <p>Frontend Developer • University of Mumbai</p>
          </div>
        </div>
        <div className="portfolio-summary-stats">
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">35</span>
            <span className="portfolio-stat-label">Skills</span>
          </div>
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">22</span>
            <span className="portfolio-stat-label">Artifacts</span>
          </div>
          <div className="portfolio-stat">
            <span className="portfolio-stat-val">812</span>
            <span className="portfolio-stat-label">Views</span>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="mp-card-grid mp-card-grid-full">
        {PORTFOLIO_ARTIFACTS.map((item) => (
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
              <div className="mp-card-top" style={{marginBottom: '8px'}}>
                <span className="mp-posted">{item.date}</span>
                <span className="mp-meta-chip" style={{fontSize: '0.7rem'}}>{item.type}</span>
              </div>
              <h3 className="mp-card-title">{item.title}</h3>
              <span className="mp-company-name">{item.project}</span>
              <div className="mp-tags" style={{marginTop: '12px'}}>
                {item.skills.map((s, i) => (
                  <span key={i} className="mp-tag" style={{ color: '#2563EB' }}>{s}</span>
                ))}
              </div>
              <div className="mp-card-actions" style={{marginTop: '16px'}}>
                <button className="mp-btn-outline">View Artifact</button>
                <button className="mp-btn-filled">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
