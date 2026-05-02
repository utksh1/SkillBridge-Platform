import data from './mockData.json';

export const PORTFOLIO_STORAGE_KEY = 'skillbridge_portfolio';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const fallbackCaseStudies = data.portfolioArtifacts.slice(0, 6).map((item, index) => ({
  ...item,
  role: index % 2 === 0 ? 'Frontend implementation, interaction design, and handoff' : 'Research, prototyping, and product storytelling',
  summary: `${item.title} packaged as hiring-ready proof with context, skills, and outcomes for ${item.project}.`,
  impact: index % 2 === 0 ? 'Improved task completion by 28%' : 'Reduced decision time by 35%',
  link: `https://alexmorgan.design/work/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  featured: index < 3,
}));

const FALLBACK_PORTFOLIO = {
  bio: 'I build clear, accessible interfaces and turn product problems into polished, measurable proof. My strongest work combines React, design systems, and UX judgment.',
  profileUrl: data.user.portfolioUrl,
  resumeUrl: data.user.resumeUrl,
  caseStudies: fallbackCaseStudies,
};

const normalizeCaseStudy = (item) => ({
  id: item.id ?? Date.now(),
  title: item.title ?? '',
  project: item.project ?? '',
  projectColor: item.projectColor ?? '#2563EB',
  type: item.type ?? 'Case Study',
  date: item.date ?? 'May 2026',
  verified: Boolean(item.verified),
  featured: Boolean(item.featured),
  skills: Array.isArray(item.skills) ? item.skills : [],
  image: item.image ?? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  role: item.role ?? '',
  summary: item.summary ?? '',
  impact: item.impact ?? '',
  link: item.link ?? '',
});

export const getStoredPortfolio = () => {
  if (!canUseStorage()) return FALLBACK_PORTFOLIO;

  const raw = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(FALLBACK_PORTFOLIO));
    return FALLBACK_PORTFOLIO;
  }

  try {
    const parsed = JSON.parse(raw);
    const caseStudies = Array.isArray(parsed.caseStudies)
      ? parsed.caseStudies.map(normalizeCaseStudy)
      : FALLBACK_PORTFOLIO.caseStudies;

    return {
      ...FALLBACK_PORTFOLIO,
      ...parsed,
      caseStudies,
    };
  } catch {
    return FALLBACK_PORTFOLIO;
  }
};

export const saveStoredPortfolio = (portfolio) => {
  const nextPortfolio = {
    ...FALLBACK_PORTFOLIO,
    ...portfolio,
    caseStudies: (portfolio.caseStudies ?? FALLBACK_PORTFOLIO.caseStudies).map(normalizeCaseStudy),
  };

  if (canUseStorage()) {
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(nextPortfolio));
  }

  return nextPortfolio;
};

export const getPortfolioStats = (portfolio = getStoredPortfolio()) => {
  const skills = new Set(portfolio.caseStudies.flatMap((item) => item.skills));

  return {
    skills: skills.size,
    artifacts: portfolio.caseStudies.length,
    verified: portfolio.caseStudies.filter((item) => item.verified).length,
    featured: portfolio.caseStudies.filter((item) => item.featured).length,
  };
};

export const getRelevantCaseStudies = (job, portfolio = getStoredPortfolio(), limit = 3) => {
  const jobSkillLabels = (job?.tags ?? []).map((tag) => tag.label.toLowerCase());

  const scored = portfolio.caseStudies.map((item) => {
    const searchable = [
      item.title,
      item.project,
      item.type,
      item.role,
      item.summary,
      item.impact,
      ...item.skills,
    ].join(' ').toLowerCase();

    const skillScore = jobSkillLabels.filter((label) => searchable.includes(label)).length * 3;
    const featuredScore = item.featured ? 2 : 0;
    const verifiedScore = item.verified ? 1 : 0;

    return {
      ...item,
      score: skillScore + featuredScore + verifiedScore,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const buildPortfolioApplicationIntro = (profile, job, portfolio = getStoredPortfolio()) => {
  const relevant = getRelevantCaseStudies(job, portfolio, 3);
  const proofLine = relevant.length
    ? `The strongest proof I would highlight for this role includes ${relevant.map((item) => item.title).join(', ')}.`
    : 'My portfolio is organized around relevant case studies, project proof, and measurable outcomes.';
  const bioLine = portfolio.bio ? `Portfolio positioning: ${portfolio.bio}` : '';

  return [
    `I am targeting ${profile.headline} opportunities and I am excited about the chance to contribute at ${job.company}.`,
    bioLine,
    proofLine,
  ].filter(Boolean).join('\n\n');
};
