import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  APPLICATION_STATUSES,
  getApplicationReminders,
  getApplicationStatusClass,
  getStoredApplications,
  updateApplicationStatus,
} from '../data/applicationUtils';

const ALL_FILTER = 'All';

const STATUS_META = {
  Applied: {
    icon: 'fa-solid fa-paper-plane',
    color: '#2563EB',
    bg: '#DBEAFE',
    label: 'Submitted',
  },
  'In Review': {
    icon: 'fa-solid fa-magnifying-glass-chart',
    color: '#B45309',
    bg: '#FEF3C7',
    label: 'Under review',
  },
  Interview: {
    icon: 'fa-solid fa-comments',
    color: '#7C3AED',
    bg: '#EDE9FE',
    label: 'Interviewing',
  },
  Rejected: {
    icon: 'fa-solid fa-circle-xmark',
    color: '#DC2626',
    bg: '#FEE2E2',
    label: 'Closed',
  },
  Offer: {
    icon: 'fa-solid fa-trophy',
    color: '#15803D',
    bg: '#DCFCE7',
    label: 'Offer',
  },
};

const SUMMARY_META = {
  'Total Applications': { icon: 'fa-solid fa-layer-group', color: '#0F172A', bg: '#E2E8F0' },
  'In Review': STATUS_META['In Review'],
  Interview: STATUS_META.Interview,
  Offers: STATUS_META.Offer,
};

const formatAppliedDate = (date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(parsedDate);
};

function Applications() {
  const [applications, setApplications] = useState(() => getStoredApplications());
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER);
  const reminders = useMemo(() => getApplicationReminders(applications), [applications]);

  const visibleApplications = useMemo(() => {
    if (statusFilter === ALL_FILTER) return applications;
    return applications.filter((application) => application.status === statusFilter);
  }, [applications, statusFilter]);

  const summary = useMemo(() => {
    const counts = APPLICATION_STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});

    applications.forEach((application) => {
      counts[application.status] = (counts[application.status] ?? 0) + 1;
    });

    return [
      { label: 'Total Applications', value: applications.length },
      { label: 'In Review', value: counts['In Review'] ?? 0 },
      { label: 'Interview', value: counts.Interview ?? 0 },
      { label: 'Offers', value: counts.Offer ?? 0 },
    ];
  }, [applications]);

  const statusCounts = useMemo(() => {
    const counts = APPLICATION_STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), { [ALL_FILTER]: applications.length });

    applications.forEach((application) => {
      counts[application.status] = (counts[application.status] ?? 0) + 1;
    });

    return counts;
  }, [applications]);

  const handleStatusChange = (applicationId, nextStatus) => {
    const nextApplications = updateApplicationStatus(applicationId, nextStatus);
    setApplications(nextApplications);
  };

  return (
    <div className="mp-page">
      <section className="apps-hero">
        <div>
          <span className="dash-section-kicker">Job tracker</span>
          <h1 className="apps-hero-title">Track every application like a real pipeline</h1>
          <p className="apps-hero-subtitle">
            See where you&apos;ve applied, which roles are moving forward, and where you already have momentum.
          </p>
        </div>
        <div className="apps-hero-panel">
          <div className="apps-hero-panel-top">
            <span>{applications.length} roles tracked</span>
            <Link to="/jobs" className="mp-btn-filled apps-hero-btn">Apply to More Jobs</Link>
          </div>
          <div className="apps-pipeline-strip" aria-label="Application pipeline overview">
            {['Applied', 'In Review', 'Interview', 'Offer'].map((status) => {
              const meta = STATUS_META[status];

              return (
                <div key={status} className="apps-pipeline-stage" style={{ '--stage-color': meta.color, '--stage-bg': meta.bg }}>
                  <span className="apps-pipeline-dot"><i className={meta.icon}></i></span>
                  <strong>{statusCounts[status] ?? 0}</strong>
                  <small>{meta.label}</small>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="apps-summary-grid">
        {summary.map((item) => {
          const meta = SUMMARY_META[item.label];

          return (
            <div key={item.label} className="apps-summary-card" style={{ '--summary-color': meta.color, '--summary-bg': meta.bg }}>
              <div className="apps-summary-icon">
                <i className={meta.icon}></i>
              </div>
              <div>
                <span className="apps-summary-value">{item.value}</span>
                <span className="apps-summary-label">{item.label}</span>
              </div>
            </div>
          );
        })}
      </section>

      {reminders.length > 0 && (
        <section className="mp-card apps-board apps-reminder-board">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Follow-up queue</span>
              <h2>Next actions</h2>
            </div>
          </div>
          <div className="apps-reminder-list">
            {reminders.map((reminder) => (
              <div className="apps-reminder-item" key={reminder.id}>
                <div className="apps-reminder-icon">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div>
                  <span className="apps-reminder-status">{reminder.status}</span>
                  <h3>{reminder.title}</h3>
                  <p>{reminder.description}</p>
                </div>
                <Link to={`/jobs/${reminder.jobId}`} className="mp-btn-outline job-link-btn">Open Job</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mp-card apps-board">
        <div className="dash-section-top">
          <div>
            <span className="dash-section-kicker">Application states</span>
            <h2>Applied Jobs Tracker</h2>
          </div>
          <span className="apps-board-count">{visibleApplications.length} visible</span>
        </div>

        <div className="apps-filter-row">
          {[ALL_FILTER, ...APPLICATION_STATUSES].map((status) => (
            <button
              key={status}
              className={`apps-filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
              type="button"
            >
              <span>{status}</span>
              <strong>{statusCounts[status] ?? 0}</strong>
            </button>
          ))}
        </div>

        <div className="apps-list">
          {visibleApplications.map((application) => {
            const statusMeta = STATUS_META[application.status] ?? STATUS_META.Applied;

            return (
              <article
                className="apps-list-item"
                key={application.id}
                style={{ '--app-status-color': statusMeta.color, '--app-status-bg': statusMeta.bg }}
              >
                <div className="apps-list-rail"></div>
                <div className="apps-list-main">
                  <div className="mp-company-logo apps-list-logo" style={{ backgroundColor: application.companyColor }}>
                    {application.companyInitial ?? application.company.charAt(0)}
                  </div>
                  <div className="apps-list-copy">
                    <div className="apps-list-title-row">
                      <h3>{application.title}</h3>
                      <span className={`mp-status-badge ${getApplicationStatusClass(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    <p>{application.company}</p>
                    <div className="apps-list-meta">
                      <span><i className="fa-regular fa-calendar"></i> {formatAppliedDate(application.appliedDate)}</span>
                      <span><i className={statusMeta.icon}></i> {statusMeta.label}</span>
                    </div>
                  </div>
                </div>

                <div className="apps-list-status">
                  <span>Stage</span>
                  <select
                    aria-label={`Update status for ${application.title}`}
                    className="apps-status-select"
                    value={application.status}
                    onChange={(event) => handleStatusChange(application.id, event.target.value)}
                  >
                    {APPLICATION_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="apps-list-actions">
                  <Link to={`/jobs/${application.jobId}`} className="mp-btn-outline job-link-btn">View Role</Link>
                  <Link to={`/jobs/${application.jobId}/apply`} className="mp-btn-filled job-link-btn">Open Application</Link>
                </div>
              </article>
            );
          })}

          {visibleApplications.length === 0 && (
            <div className="apps-empty-state">
              <h3>No applications in this bucket yet</h3>
              <p>Once you start applying, every role will appear here with a trackable status.</p>
              <Link to="/jobs" className="mp-btn-filled apps-hero-btn">Browse Jobs</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Applications;
