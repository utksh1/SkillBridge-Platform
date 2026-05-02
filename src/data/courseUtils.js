import data from './mockData.json';

export const ENROLLED_COURSES_STORAGE_KEY = 'skillbridge_enrolled_courses';

const COURSES = data.courses;

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getCourses = () => COURSES;

export const getCourseById = (courseId) => (
  COURSES.find((course) => String(course.id) === String(courseId)) ?? null
);

export const getStoredEnrolledCourseIds = () => {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(ENROLLED_COURSES_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredEnrolledCourseIds = (courseIds) => {
  if (canUseStorage()) {
    window.localStorage.setItem(ENROLLED_COURSES_STORAGE_KEY, JSON.stringify(courseIds));
  }

  return courseIds;
};

export const isEnrolledCourse = (courseId) => getStoredEnrolledCourseIds().includes(courseId);

export const enrollInCourse = (courseId) => {
  const current = getStoredEnrolledCourseIds();

  if (current.includes(courseId)) {
    return { enrolled: false, courseIds: current };
  }

  const next = saveStoredEnrolledCourseIds([courseId, ...current]);
  return { enrolled: true, courseIds: next };
};

export const getCourseTopic = (course) => {
  const title = course.title.toLowerCase();

  if (/data|python|sql|machine learning|analytics|power bi|tableau|statistics/.test(title)) return 'Data';
  if (/design|ux|ui|figma|photoshop|graphic/.test(title)) return 'Design';
  if (/react native|ios|swift|android|mobile/.test(title)) return 'Mobile';
  if (/aws|cloud|docker|kubernetes|devops/.test(title)) return 'Cloud';
  if (/security|cyber/.test(title)) return 'Security';
  if (/business|product|management|agile|leadership/.test(title)) return 'Business';
  if (/marketing|seo|social/.test(title)) return 'Marketing';
  if (/javascript|react|node|html|css|api|web|flask|django|java|blockchain/.test(title)) return 'Development';

  return 'General';
};

export const getCourseLevel = (course) => {
  const title = course.title.toLowerCase();

  if (/advanced|masterclass|professional|architect|specialization|deep dive|a-z/.test(title)) return 'Advanced';
  if (/basics|fundamentals|zero|beginner|intro/.test(title)) return 'Beginner';

  return 'Intermediate';
};

export const getRoleCourseScore = (course, targetRole) => {
  const text = `${course.title} ${getCourseTopic(course)} ${course.badges.join(' ')}`.toLowerCase();

  if (targetRole === 'frontend') return /react|javascript|web|html|css|ui\/ux/.test(text) ? 3 : 0;
  if (targetRole === 'data') return /data|python|analytics|sql|tableau|power bi|statistics/.test(text) ? 3 : 0;
  if (targetRole === 'marketing') return /marketing|seo|social|content|analytics/.test(text) ? 3 : 0;
  if (targetRole === 'product') return /product|business|agile|management|ux/.test(text) ? 3 : 0;

  return 0;
};
