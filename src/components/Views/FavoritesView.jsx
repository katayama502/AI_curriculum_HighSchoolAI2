import { COURSES } from '../../data/courses';
import CardGrid from '../Cards/CardGrid';

export default function FavoritesView({ userData, onToggleFav, onToggleBk, onSetProg, onTagClick, onToast, onPlay }) {
  const courses = COURSES.filter(c => userData.isFav(c.id));

  return (
    <div className="view">
      <div className="ph">
        <h1 className="page-title">お気に入り</h1>
        <p>ハートを付けたコースが表示されます</p>
      </div>
      <div id="fav-grid">
        <CardGrid
          courses={courses}
          userData={userData}
          onToggleFav={onToggleFav}
          onToggleBk={onToggleBk}
          onSetProg={onSetProg}
          onTagClick={onTagClick}
          onToast={onToast}
          onPlay={onPlay}
        />
      </div>
    </div>
  );
}
