import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getCourseLevel,
  getCourseTopic,
  getCourses,
  getRoleCourseScore,
  getStoredEnrolledCourseIds,
} from '../data/courseUtils';
import { getStoredProfile, getTargetRoleMeta } from '../data/profileUtils';

const COURSES = getCourses();
const ALL_FILTER = 'all';

const BADGE_COLORS = {
  Premium: { bg: '#E9FF2C', color: '#1F2937' },
  Bestseller: { bg: '#2F80ED', color: '#FFFFFF' },
  Free: { bg: '#E9FF2C', color: '#1F2937' },
  Hot: { bg: '#2F80ED', color: '#FFFFFF' },
};

const getUniqueValues = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b));

function CourseCard({ course, enrolled }) {
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
          <Link to={`/courses/${course.id}`} className="course-enroll-btn">
            {enrolled ? 'Open Course' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Courses() {
  const profile = getStoredProfile();
  const targetRole = getTargetRoleMeta(profile.targetRole);
  const [activeTab, setActiveTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState(ALL_FILTER);
  const [category, setCategory] = useState(ALL_FILTER);
  const [level, setLevel] = useState(ALL_FILTER);
  const [enrolledCourseIds] = useState(() => getStoredEnrolledCourseIds());

  const topicOptions = getUniqueValues(COURSES.map(getCourseTopic));
  const categoryOptions = getUniqueValues(COURSES.flatMap((course) => course.badges.length ? course.badges : ['Standard']));
  const levelOptions = getUniqueValues(COURSES.map(getCourseLevel));
  const searchTerm = search.trim().toLowerCase();
  const getRoleScore = (course) => {
    return getRoleCourseScore(course, profile.targetRole);
  };
  const visibleCourses = COURSES.filter((course) => {
    const courseTopic = getCourseTopic(course);
    const courseLevel = getCourseLevel(course);
    const courseCategories = course.badges.length ? course.badges : ['Standard'];
    const text = [course.title, course.instructor, courseTopic, courseLevel, ...courseCategories].join(' ').toLowerCase();

    return (
      (activeTab === 'browse' || enrolledCourseIds.includes(course.id)) &&
      (!searchTerm || text.includes(searchTerm)) &&
      (topic === ALL_FILTER || courseTopic === topic) &&
      (category === ALL_FILTER || courseCategories.includes(category)) &&
      (level === ALL_FILTER || courseLevel === level)
    );
  }).sort((a, b) => getRoleScore(b) - getRoleScore(a) || b.rating - a.rating);

  const recommendedCourses = visibleCourses.filter((course) => getRoleScore(course) > 0).slice(0, 3);

  return (
    <div className="mp-page">
      <div className="mp-page-header" style={{ marginBottom: '8px' }}>
        <div>
          <h1 className="mp-page-title">Learn</h1>
          <p className="mp-page-subtitle">Build the skills your target {targetRole.shortLabel.toLowerCase()} role needs before you turn them into proof.</p>
        </div>
        <div className="course-tabs">
          <button className={`course-tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>Explore Skills</button>
          <button className={`course-tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>My Learning</button>
        </div>
      </div>

      <div className="mp-filter-bar">
        <div className="mp-search-filter" style={{ maxWidth: '280px' }}>
          <i className="fa-solid fa-search"></i>
          <input
            type="text"
            placeholder="Search skills and courses"
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

      {recommendedCourses.length > 0 && (
        <section className="role-course-panel">
          <div className="dash-section-top">
            <div>
              <span className="dash-section-kicker">Role matched</span>
              <h2>Best next courses for {targetRole.label}</h2>
            </div>
          </div>
          <div className="role-course-chip-row">
            {recommendedCourses.map((course) => (
              <div className="role-course-chip" key={course.id}>
                <strong>{course.title}</strong>
                <span>{getCourseTopic(course)} • {getCourseLevel(course)}</span>
                <Link to={`/courses/${course.id}`} className="link-blue">View details</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="course-grid">
        {visibleCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            enrolled={enrolledCourseIds.includes(course.id)}
          />
        ))}
        {visibleCourses.length === 0 && (
          <div className="rich-empty-state">
            <h3>{activeTab === 'my' ? 'No enrolled courses yet' : 'No matching courses found'}</h3>
            <p>
              {activeTab === 'my'
                ? 'Enroll in a course from Explore Skills and it will appear here for quick access.'
                : 'Try clearing one filter or searching for a broader skill area.'}
            </p>
            <button type="button" className="mp-btn-filled job-link-btn" onClick={() => setActiveTab('browse')}>
              Explore Skills
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
