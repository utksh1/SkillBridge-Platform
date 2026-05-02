import { getJobs } from './jobUtils';

export const SAVED_JOBS_STORAGE_KEY = 'skillbridge_saved_jobs';
export const SAVED_JOBS_CHANGED_EVENT = 'skillbridge:saved-jobs-changed';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getStoredSavedJobs = () => {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(SAVED_JOBS_STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify([]));
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredSavedJobs = (savedJobs) => {
  if (canUseStorage()) {
    window.localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(savedJobs));
    window.dispatchEvent(new Event(SAVED_JOBS_CHANGED_EVENT));
  }

  return savedJobs;
};

export const isSavedJob = (jobId) => getStoredSavedJobs().some((job) => job.jobId === jobId);

export const toggleSavedJob = (job) => {
  const existing = getStoredSavedJobs();
  const match = existing.find((item) => item.jobId === job.id);

  if (match) {
    const next = existing.filter((item) => item.jobId !== job.id);
    saveStoredSavedJobs(next);
    return { saved: false, savedJobs: next };
  }

  const nextEntry = {
    jobId: job.id,
    title: job.title,
    company: job.company,
    companyColor: job.companyColor,
    companyInitial: job.companyInitial,
    pay: job.pay,
    type: job.type,
    experience: job.experience,
    location: job.location ?? job.mode ?? 'Remote / Flexible',
    savedDate: new Date().toISOString().split('T')[0],
  };

  const next = [nextEntry, ...existing];
  saveStoredSavedJobs(next);
  return { saved: true, savedJobs: next };
};

export const getSavedJobDetails = () => {
  const saved = getStoredSavedJobs();
  const jobs = getJobs();

  return saved.map((entry) => {
    const live = jobs.find((job) => job.id === entry.jobId);
    return { ...live, ...entry };
  });
};
