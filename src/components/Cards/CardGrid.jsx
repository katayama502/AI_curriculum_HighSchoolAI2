import CourseCard from './CourseCard';

export default function CardGrid({ courses, userData, onToggleFav, onToggleBk, onSetProg, onTagClick, onToast }) {
  if (!courses.length) {
    return (
      <div className="empty" style={{ gridColumn: '1/-1' }}>
        <div className="empty-ico"><i className="fa-solid fa-magnifying-glass"></i></div>
        <p>該当するコンテンツが見つかりません</p>
      </div>
    );
  }

  return (
    <>
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          isFav={userData.isFav(course.id)}
          isBk={userData.isBk(course.id)}
          prog={userData.getProg(course.id)}
          onToggleFav={onToggleFav}
          onToggleBk={onToggleBk}
          onSetProg={onSetProg}
          onTagClick={onTagClick}
          onToast={onToast}
        />
      ))}
    </>
  );
}
