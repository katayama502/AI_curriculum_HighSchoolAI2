import FilterBar from '../Filters/FilterBar';
import CardGrid from '../Cards/CardGrid';

export default function CoursesView({ filters, userData, onToggleFav, onToggleBk, onSetProg, onTagClick, onToast, examOnly, onExamToggle }) {
  const { cat, level, type, filtered, onCat, onLevel, onType } = filters;

  return (
    <div className="view">
      <div className="courses-top">
        <div className="page-title">コース一覧</div>
        <div className="result-badge">
          <i className="fa-solid fa-layer-group"></i>
          <span>{filtered.length} 件</span>
        </div>
      </div>
      <FilterBar
        cat={cat}
        level={level}
        type={type}
        onCat={onCat}
        onLevel={onLevel}
        onType={onType}
        resultCount={filtered.length}
        examOnly={examOnly}
        onExamToggle={onExamToggle}
      />
      <div id="card-grid">
        <CardGrid
          courses={filtered}
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
