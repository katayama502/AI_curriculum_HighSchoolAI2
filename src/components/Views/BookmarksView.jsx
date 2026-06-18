import { COURSES } from '../../data/courses';
import CardGrid from '../Cards/CardGrid';

export default function BookmarksView({ userData, onToggleFav, onToggleBk, onSetProg, onTagClick, onToast }) {
  const courses = COURSES.filter(c => userData.isBk(c.id));

  return (
    <div className="view">
      <div className="ph">
        <h1 className="page-title">保存済み</h1>
        <p>ブックマークしたコースが表示されます</p>
      </div>
      <div id="bookmark-grid">
        <CardGrid
          courses={courses}
          userData={userData}
          onToggleFav={onToggleFav}
          onToggleBk={onToggleBk}
          onSetProg={onSetProg}
          onTagClick={onTagClick}
          onToast={onToast}
        />
      </div>
    </div>
  );
}
