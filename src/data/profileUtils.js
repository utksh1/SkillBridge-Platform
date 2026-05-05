import data from './mockData.json';

export const PROFILE_STORAGE_KEY = 'skillbridge_profile';
export const AUTH_STORAGE_KEY = 'skillbridge_authenticated';

export const TARGET_ROLE_OPTIONS = {
  frontend: {
    key: 'frontend',
    label: 'Frontend Developer',
    shortLabel: 'Frontend',
    summary: 'React, CSS, JavaScript, UI systems, and product implementation.',
  },
  data: {
    key: 'data',
    label: 'Data Analyst',
    shortLabel: 'Data',
    summary: 'SQL, Python, dashboards, reporting, and decision support.',
  },
  marketing: {
    key: 'marketing',
    label: 'Digital Marketer',
    shortLabel: 'Marketing',
    summary: 'SEO, campaign strategy, content, analytics, and performance growth.',
  },
  product: {
    key: 'product',
    label: 'Product Manager',
    shortLabel: 'Product',
    summary: 'Roadmapping, stakeholder alignment, discovery, and delivery execution.',
  },
};

export const WORK_MODE_OPTIONS = {
  remote: {
    key: 'remote',
    label: 'Remote-first',
    summary: 'Best-fit roles can be fully remote with async collaboration.',
  },
  hybrid: {
    key: 'hybrid',
    label: 'Hybrid',
    summary: 'A few office days each week works well for you.',
  },
  onsite: {
    key: 'onsite',
    label: 'On-site',
    summary: 'You prefer campus, office, or studio-based work.',
  },
  flexible: {
    key: 'flexible',
    label: 'Flexible',
    summary: 'Role quality matters more than the work location.',
  },
};

export const GOAL_OPTIONS = {
  interview: {
    key: 'interview',
    label: 'Get interview-ready',
    summary: 'Focus on the skills and proof needed for interviews.',
  },
  portfolio: {
    key: 'portfolio',
    label: 'Build a stronger portfolio',
    summary: 'Turn projects into credible, employer-facing case studies.',
  },
  jobSearch: {
    key: 'jobSearch',
    label: 'Find matched jobs',
    summary: 'Prioritize roles aligned with your target role and work mode.',
  },
  upskill: {
    key: 'upskill',
    label: 'Close skill gaps',
    summary: 'Use pathways and courses to build missing capabilities.',
  },
};

const FALLBACK_PROFILE = {
  ...data.user,
  targetRole: 'frontend',
  skills: ['React', 'JavaScript', 'UI Design'],
  goals: ['interview', 'portfolio'],
  workMode: 'hybrid',
  onboardingComplete: false,
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getTargetRoleMeta = (targetRoleKey) => (
  TARGET_ROLE_OPTIONS[targetRoleKey] ?? TARGET_ROLE_OPTIONS.frontend
);

export const getWorkModeMeta = (workModeKey) => (
  WORK_MODE_OPTIONS[workModeKey] ?? WORK_MODE_OPTIONS.flexible
);

export const getGoalMeta = (goalKey) => (
  GOAL_OPTIONS[goalKey] ?? GOAL_OPTIONS.interview
);

export const getStoredProfile = () => {
  if (!canUseStorage()) return FALLBACK_PROFILE;

  const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(FALLBACK_PROFILE));
    return FALLBACK_PROFILE;
  }

  try {
    const parsed = JSON.parse(raw);
    return { ...FALLBACK_PROFILE, ...parsed };
  } catch {
    return FALLBACK_PROFILE;
  }
};

export const saveStoredProfile = (profilePatch) => {
  const nextProfile = { ...getStoredProfile(), ...profilePatch };

  if (canUseStorage()) {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  }

  return nextProfile;
};

export const hasCompletedOnboarding = () => getStoredProfile().onboardingComplete === true;

export const isAuthenticated = () => {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
};

export const setAuthenticated = (authenticated) => {
  if (canUseStorage()) {
    if (authenticated) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return authenticated;
};

export const buildApplicationIntro = (profile, job) => {
  const targetRole = getTargetRoleMeta(profile.targetRole);
  const leadingSkills = job.tags.slice(0, 3).map((tag) => tag.label).join(', ');

  return `I am targeting ${targetRole.label} roles and have built relevant proof across ${leadingSkills}. My portfolio and resume are aligned to this application, and I am excited about the opportunity to contribute at ${job.company}.`;
};
