import data from './mockData.json';

export const CREDITS_STORAGE_KEY = 'skillbridge_credits';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const fallbackCredits = data.credits ?? [];

export const getStoredCredits = () => {
  if (!canUseStorage()) return fallbackCredits;

  const raw = window.localStorage.getItem(CREDITS_STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(fallbackCredits));
    return fallbackCredits;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallbackCredits;
  } catch {
    return fallbackCredits;
  }
};

export const saveStoredCredits = (credits) => {
  if (canUseStorage()) {
    window.localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(credits));
  }

  return credits;
};

export const createProofSubmission = (formData) => {
  const nextCredit = {
    id: Date.now(),
    title: formData.title,
    issuer: formData.issuer,
    issuerColor: formData.issuerColor || '#2563EB',
    issuerInitial: formData.issuer?.charAt(0)?.toUpperCase() || 'P',
    submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    hours: `${formData.hours} hours`,
    status: 'pending',
    skills: formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    proofUrl: formData.proofUrl,
    notes: formData.notes,
  };

  const nextCredits = [nextCredit, ...getStoredCredits()];
  saveStoredCredits(nextCredits);
  return nextCredit;
};
