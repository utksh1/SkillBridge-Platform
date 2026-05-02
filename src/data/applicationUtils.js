import data from './mockData.json';

export const APPLICATION_STORAGE_KEY = 'skillbridge_applications';
export const APPLICATIONS_CHANGED_EVENT = 'skillbridge:applications-changed';

export const APPLICATION_STATUSES = ['Applied', 'In Review', 'Interview', 'Rejected', 'Offer'];

export const getApplicationStatusClass = (status) => {
  switch (status) {
    case 'Applied':
      return 'mp-status-applied';
    case 'In Review':
      return 'mp-status-in-review';
    case 'Interview':
      return 'mp-status-interview';
    case 'Offer':
      return 'mp-status-offer';
    case 'Rejected':
      return 'mp-status-rejected';
    default:
      return 'mp-status-pending';
  }
};

const getFallbackApplications = () => data.appliedJobs ?? [];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getStoredApplications = () => {
  if (!canUseStorage()) return getFallbackApplications();

  const raw = window.localStorage.getItem(APPLICATION_STORAGE_KEY);

  if (!raw) {
    const fallback = getFallbackApplications();
    window.localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getFallbackApplications();
  } catch {
    return getFallbackApplications();
  }
};

export const saveApplications = (applications) => {
  if (!canUseStorage()) return applications;
  window.localStorage.setItem(APPLICATION_STORAGE_KEY, JSON.stringify(applications));
  window.dispatchEvent(new Event(APPLICATIONS_CHANGED_EVENT));
  return applications;
};

export const getStoredApplicationByJobId = (jobId) => (
  getStoredApplications().find((application) => String(application.jobId) === String(jobId)) ?? null
);

export const createOrUpdateApplication = ({ job, formData }) => {
  const existingApplications = getStoredApplications();
  const existingMatch = existingApplications.find((application) => application.jobId === job.id);

  const nextApplication = {
    id: existingMatch?.id ?? Date.now(),
    jobId: job.id,
    title: job.title,
    company: job.company,
    companyColor: job.companyColor,
    companyInitial: job.companyInitial,
    status: existingMatch?.status ?? 'Applied',
    appliedDate: existingMatch?.appliedDate ?? new Date().toISOString().split('T')[0],
    fullName: formData.fullName,
    location: formData.location,
    notice: formData.notice,
    email: formData.email,
    phone: formData.phone,
    portfolio: formData.portfolio,
    resume: formData.resume,
    fit: formData.fit,
  };

  const nextApplications = existingMatch
    ? existingApplications.map((application) => (
      application.id === existingMatch.id ? nextApplication : application
    ))
    : [nextApplication, ...existingApplications];

  saveApplications(nextApplications);

  return nextApplication;
};

export const updateApplicationStatus = (applicationId, status) => {
  const applications = getStoredApplications();
  const nextApplications = applications.map((application) => (
    application.id === applicationId ? { ...application, status } : application
  ));

  saveApplications(nextApplications);
  return nextApplications;
};

export const getApplicationReminders = (applications = getStoredApplications()) => {
  return applications
    .map((application) => {
      if (application.status === 'Applied') {
        return {
          id: `followup-${application.id}`,
          title: `Follow up on ${application.title}`,
          description: `Send a polite follow-up to ${application.company} if you have not heard back yet.`,
          status: 'Follow-up',
          jobId: application.jobId,
        };
      }

      if (application.status === 'In Review') {
        return {
          id: `review-${application.id}`,
          title: `Refresh proof for ${application.title}`,
          description: `Tighten your portfolio and resume while ${application.company} reviews your application.`,
          status: 'Prep',
          jobId: application.jobId,
        };
      }

      if (application.status === 'Interview') {
        return {
          id: `interview-${application.id}`,
          title: `Prepare for ${application.title} interview`,
          description: `Review your strongest case studies and practice role-specific questions for ${application.company}.`,
          status: 'Interview',
          jobId: application.jobId,
        };
      }

      if (application.status === 'Offer') {
        return {
          id: `offer-${application.id}`,
          title: `Review the offer from ${application.company}`,
          description: 'Compare scope, growth, and compensation before responding.',
          status: 'Offer',
          jobId: application.jobId,
        };
      }

      return null;
    })
    .filter(Boolean)
    .slice(0, 4);
};
