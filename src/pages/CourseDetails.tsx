import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import {
  enrollInCourse,
  getCourseById,
  getCourseLevel,
  getCourseTopic,
  isEnrolledCourse,
} from '../data/courseUtils';

const BADGE_COLORS = {
  Premium: { bg: '#E9FF2C', color: '#1F2937' },
  Bestseller: { bg: '#2F80ED', color: '#FFFFFF' },
  Free: { bg: '#E9FF2C', color: '#1F2937' },
  Hot: { bg: '#2F80ED', color: '#FFFFFF' },
};

function CourseDetails() {
  const { courseId } = useParams();
  const course = getCourseById(courseId);
  const [enrolled, setEnrolled] = useState(() => (course ? isEnrolledCourse(course.id) : false));
  const [toastMessage, setToastMessage] = useState('');

  if (!course) {
    return (
      <div className="mp-page">
        <div className="job-apply-shell">
          <div className="mp-card job-apply-card">
            <span className="dash-section-kicker">Course details</span>
            <h1 className="mp-page-title" style={{ marginBottom: '10px' }}>Course not found</h1>
            <p className="mp-page-subtitle" style={{ marginBottom: '20px' }}>
              This learning path is no longer available or the link is incorrect.
            </p>
            <Link to="/courses" className="mp-btn-filled job-link-btn" style={{ maxWidth: '220px' }}>
              Back to Learn
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const topic = getCourseTopic(course);
  const level = getCourseLevel(course);
  const badgeColors = course.badges.map((badge) => BADGE_COLORS[badge] || { bg: '#F1F5F9', color: '#64748B' });

  const handleEnroll = () => {
    const result = enrollInCourse(course.id);

    setEnrolled(true);
    setToastMessage(result.enrolled ? 'Course added to My Learning.' : 'Course is already in My Learning.');
  };

  return (
    <div className="mp-page">
      <div className="course-detail-shell">
        <section className="course-detail-hero">
          <Link to="/courses" className="job-back-link">
            <i className="fa-solid fa-arrow-left"></i> Back to Learn
          </Link>

          <div className="course-detail-hero-grid">
            <div className="course-detail-copy">
              <span className="dash-section-kicker">{topic} • {level}</span>
              <h1 className="course-detail-title">{course.title}</h1>
              <p className="course-detail-subtitle">
                Review the course scope, instructor, and learning outcomes before adding it to your personal SkillBridge plan.
              </p>

              <div className="course-detail-meta">
                <span><i className="fa-solid fa-star"></i> {course.rating} rating</span>
                <span><i className="fa-solid fa-user"></i> {course.instructor}</span>
                <span><i className="fa-solid fa-tag"></i> {course.price}</span>
              </div>

              <div className="course-detail-badges">
                {course.badges.map((badge, index) => (
                  <span
                    key={badge}
                    className="course-badge"
                    style={{ backgroundColor: badgeColors[index].bg, color: badgeColors[index].color }}
                  >
                    <span>{badge}</span>
                  </span>
                ))}
              </div>

              <div className="course-detail-actions">
                <button type="button" className="mp-btn-filled job-link-btn" onClick={handleEnroll}>
                  {enrolled ? 'Enrolled' : 'Enroll in Course'}
                </button>
                <Link to="/portfolio" className="mp-btn-outline job-link-btn">Plan Proof</Link>
              </div>

              {toastMessage && (
                <div className="ui-toast inline-toast" role="status">
                  <i className="fa-solid fa-circle-check"></i> {toastMessage}
                </div>
              )}
            </div>

            <div className="course-detail-media">
              <img src={course.image} alt={course.title} />
              <div className="course-detail-instructor">
                <img src={course.avatar} alt={course.instructor} />
                <div>
                  <span>Instructor</span>
                  <strong>{course.instructor}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="course-detail-grid">
          <article className="mp-card course-detail-card">
            <span className="dash-section-kicker">What you will build</span>
            <h2>Learning Outcomes</h2>
            <ul className="job-details-list">
              <li>Understand the core concepts behind {topic.toLowerCase()} work.</li>
              <li>Practice job-ready exercises you can turn into portfolio proof.</li>
              <li>Prepare one short project summary for applications and interviews.</li>
              <li>Connect this course to your SkillBridge learning and proof loop.</li>
            </ul>
          </article>

          <article className="mp-card course-detail-card">
            <span className="dash-section-kicker">Course fit</span>
            <h2>Before You Enroll</h2>
            <div className="proof-detail-grid">
              <div>
                <span>Topic</span>
                <strong>{topic}</strong>
              </div>
              <div>
                <span>Level</span>
                <strong>{level}</strong>
              </div>
              <div>
                <span>Format</span>
                <strong>Self paced</strong>
              </div>
              <div>
                <span>Proof</span>
                <strong>Portfolio-ready</strong>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}

export default CourseDetails;
