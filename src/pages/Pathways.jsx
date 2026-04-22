import data from '../data/mockData.json';

const PATHWAYS = data.pathways;

function Pathways() {
  return (
    <div className="mp-page">
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Pathways</h1>
          <p className="mp-page-subtitle">Explore role-based skill maps and track your readiness</p>
        </div>
      </div>

      <div className="pathways-list">
        {PATHWAYS.map((role) => (
          <div className="pathway-card" key={role.id}>
            <div className="pathway-card-header">
              <div className="pathway-title-area">
                <h2>{role.title}</h2>
                <p>{role.description}</p>
              </div>
              <div className="pathway-match" style={{ borderColor: role.matchColor, color: role.matchColor }}>
                {role.match}
                <span>match</span>
              </div>
            </div>

            <div className="pathway-skills-grid">
              {role.skills.map((skill, i) => (
                <div className="pathway-skill-row" key={i}>
                  <div className="pathway-skill-info">
                    <span className="pathway-skill-name">{skill.name}</span>
                    {skill.verified && <i className="fa-solid fa-circle-check" style={{color: '#8B5CF6', fontSize: '0.75rem'}}></i>}
                  </div>
                  <div className="pathway-skill-bar-bg">
                    <div
                      className="pathway-skill-bar-fill"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.level >= 60 ? '#10B981' : skill.level >= 30 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                  <span className="pathway-skill-pct">{skill.level}%</span>
                </div>
              ))}
            </div>

            <div className="pathway-card-footer">
              <span className="mp-meta-chip"><i className="fa-solid fa-briefcase"></i> {role.projects} live projects</span>
              <span className="mp-meta-chip"><i className="fa-solid fa-money-bill-wave"></i> {role.avgSalary}</span>
              <button className="mp-btn-filled" style={{marginLeft: 'auto'}}>Explore Pathway</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pathways;
