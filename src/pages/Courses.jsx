import data from '../data/mockData.json';
import { useState } from 'react';

const COURSES = data.courses;
const ALL_FILTER = 'all';

const BADGE_COLORS = {
  Premium: { bg: '#E9FF2C', color: '#1F2937' },
  Bestseller: { bg: '#2F80ED', color: '#FFFFFF' },
  Free: { bg: '#E9FF2C', color: '#1F2937' },
  Hot: { bg: '#2F80ED', color: '#FFFFFF' },
};

const getUniqueValues = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b));

const getCourseTopic = (course) => {
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

const getCourseLevel = (course) => {
  const title = course.title.toLowerCase();

  if (/advanced|masterclass|professional|architect|specialization|deep dive|a-z/.test(title)) return 'Advanced';
  if (/basics|fundamentals|zero|beginner|intro/.test(title)) return 'Beginner';

  return 'Intermediate';
};

function CourseCard({ course }) {
  return (
    <div className="course-card">
      <div className="course-card-media">
        <div className="course-card-image">
          <img src={course.image} alt={course.title} className="course-card-main-img" />
          <div className="course-badges">
            {course.badges.map((badge, i) => {
              const colors = BADGE_COLORS[badge] || { bg: '#F1F5F9', color: '#64748B' };
              return (
                <span
                  key={i}
                  className="course-badge"
                  style={{ backgroundColor: colors.bg, color: colors.color }}
                >
                  <span>{badge}</span>
                </span>
              );
            })}
          </div>
        </div>
        <img src={course.avatar} alt={course.instructor} className="course-instructor-avatar" />
      </div>
      <div className="course-card-body">
        <div className="course-instructor-row">
          <span className="course-instructor-name">{course.instructor}</span>
          <div className="course-rating">
            <i className="fa-solid fa-star"></i>
            <span>{course.rating}</span>
          </div>
        </div>
        <h3 className="course-card-title">{course.title}</h3>
        <div className="course-card-footer">
          <span className="course-price">{course.price}</span>
          <button className="course-enroll-btn">Enroll Now</button>
        </div>
      </div>
    </div>
  );
}

function Courses() {
  const [activeTab, setActiveTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState(ALL_FILTER);
  const [category, setCategory] = useState(ALL_FILTER);
  const [level, setLevel] = useState(ALL_FILTER);

  const topicOptions = getUniqueValues(COURSES.map(getCourseTopic));
  const categoryOptions = getUniqueValues(COURSES.flatMap((course) => course.badges.length ? course.badges : ['Standard']));
  const levelOptions = getUniqueValues(COURSES.map(getCourseLevel));
  const searchTerm = search.trim().toLowerCase();
  const visibleCourses = COURSES.filter((course) => {
    const courseTopic = getCourseTopic(course);
    const courseLevel = getCourseLevel(course);
    const courseCategories = course.badges.length ? course.badges : ['Standard'];
    const text = [course.title, course.instructor, courseTopic, courseLevel, ...courseCategories].join(' ').toLowerCase();

    return (
      (activeTab === 'browse' || course.rating >= 4.5 || courseCategories.includes('Free')) &&
      (!searchTerm || text.includes(searchTerm)) &&
      (topic === ALL_FILTER || courseTopic === topic) &&
      (category === ALL_FILTER || courseCategories.includes(category)) &&
      (level === ALL_FILTER || courseLevel === level)
    );
  });

  return (
    <div className="mp-page">
      <div className="mp-page-header" style={{ marginBottom: '8px' }}>
        <div>
          <h1 className="mp-page-title">Courses</h1>
          <p className="mp-page-subtitle">Discover and Learn new vocational skills</p>
        </div>
        <div className="course-tabs">
          <button className={`course-tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>Browse Courses</button>
          <button className={`course-tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>My Courses</button>
        </div>
      </div>

      <div className="mp-filter-bar">
        <div className="mp-search-filter" style={{ maxWidth: '280px' }}>
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search Courses"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="mp-dropdown-filter">
          <i className="fa-solid fa-tag"></i>
          <select aria-label="Filter courses by topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value={ALL_FILTER}>Topic</option>
            {topicOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
        <div className="mp-dropdown-filter">
          <i className="fa-solid fa-layer-group"></i>
          <select aria-label="Filter courses by category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value={ALL_FILTER}>Sub Category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
        <div className="mp-dropdown-filter">
          <i className="fa-solid fa-sliders"></i>
          <select aria-label="Filter courses by level" value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value={ALL_FILTER}>Select Level</option>
            {levelOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </div>

      <div className="course-grid">
        {visibleCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {visibleCourses.length === 0 && (
          <div className="mp-empty-state">No matching courses found.</div>
        )}
      </div>
    </div>
  );
}

export default Courses;
