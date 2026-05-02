import data from './mockData.json';

const JOBS = data.projects;

const LOCATION_BY_TYPE = {
  'Full time': 'Bengaluru, India',
  'Part time': 'Remote',
  Contract: 'Hybrid · Mumbai, India',
};

const getDepartment = (tags) => {
  const labels = tags.map((tag) => tag.label.toLowerCase());

  if (labels.some((label) => label.includes('design') || label.includes('ux'))) return 'Design';
  if (labels.some((label) => label.includes('data') || label.includes('machine learning'))) return 'Data & AI';
  if (labels.some((label) => label.includes('full stack') || label.includes('node') || label.includes('server'))) return 'Engineering';
  if (labels.some((label) => label.includes('react') || label.includes('javascript') || label.includes('web'))) return 'Frontend Engineering';

  return 'Product Engineering';
};

const getWorkMode = (type) => {
  if (type === 'Part time') return 'Remote-friendly';
  if (type === 'Contract') return 'Hybrid';
  return 'On-site / Hybrid';
};

const getFitScore = (job) => {
  return Math.min(96, 58 + job.tags.length * 7 + (job.type === 'Full time' ? 6 : 2));
};

const createResponsibilities = (job) => [
  `Own delivery for the ${job.title.toLowerCase()} scope across planning, execution, and iteration.`,
  `Collaborate with cross-functional partners at ${job.company} to ship measurable user or business impact.`,
  `Use ${job.tags.slice(0, 2).map((tag) => tag.label).join(' and ')} to solve real product challenges.`,
  `Communicate progress clearly, unblock stakeholders, and contribute to quality standards.`,
];

const createRequirements = (job) => [
  `${job.experience} of relevant hands-on experience in a similar role.`,
  `Strong foundation in ${job.tags.slice(0, 3).map((tag) => tag.label).join(', ')}.`,
  'Ability to work with modern product, design, and engineering workflows.',
  'Comfort presenting decisions, tradeoffs, and outcomes with clarity.',
];

const createPerks = (job) => [
  `${getWorkMode(job.type)} collaboration model.`,
  'Mentorship and structured feedback loops.',
  'Learning stipend and certification support.',
  'High-ownership environment with visible career growth.',
];

const createCompanyOverview = (job) =>
  `${job.company} is hiring for a ${job.title.toLowerCase()} who can contribute quickly, collaborate well, and help the team ship quality work across fast-moving priorities.`;

const createHiringSignals = (job) => [
  `Top skills: ${job.tags.slice(0, 3).map((tag) => tag.label).join(', ')}`,
  `Department: ${getDepartment(job.tags)}`,
  `Work mode: ${getWorkMode(job.type)}`,
  `Location: ${LOCATION_BY_TYPE[job.type] || 'Remote / Flexible'}`,
];

export const getJobs = () => JOBS;

export const getJobById = (jobId) => JOBS.find((item) => String(item.id) === String(jobId));

export const getEnrichedJob = (jobId) => {
  const job = getJobById(jobId);

  if (!job) return null;

  return {
    ...job,
    fitScore: getFitScore(job),
    location: LOCATION_BY_TYPE[job.type] || 'Remote / Flexible',
    workMode: getWorkMode(job.type),
    department: getDepartment(job.tags),
    responsibilities: createResponsibilities(job),
    requirements: createRequirements(job),
    perks: createPerks(job),
    companyOverview: createCompanyOverview(job),
    hiringSignals: createHiringSignals(job),
  };
};
