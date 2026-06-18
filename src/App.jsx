import { useState, useCallback, useRef } from 'react';
import VideoModal from './components/Modal/VideoModal';
import { COURSES } from './data/courses';
import { useUserData } from './hooks/useUserData';
import { useFilters } from './hooks/useFilters';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import HomeView from './components/Views/HomeView';
import CoursesView from './components/Views/CoursesView';
import DashboardView from './components/Views/DashboardView';
import FavoritesView from './components/Views/FavoritesView';
import BookmarksView from './components/Views/BookmarksView';

export default function App() {
  const [view, setView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', show: false });
  const [playingVideo, setPlayingVideo] = useState(null);
  const toastTimer = useRef(null);

  const userData = useUserData();
  const filters = useFilters();
  const { examOnly, setExamOnly } = filters;

  function showToast(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  }

  function navigate(v) {
    setView(v);
    setSidebarOpen(false);
  }

  function navigateToCategory(cat) {
    filters.setCat(cat);
    filters.setLevel('all');
    filters.setType('all');
    setView('courses');
    setSidebarOpen(false);
  }

  function navigateToLevel(lv) {
    filters.setLevel(lv);
    filters.setCat('all');
    filters.setType('all');
    setView('courses');
    setSidebarOpen(false);
  }

  function handleSearch(q) {
    filters.setQuery(q);
    if (view !== 'courses' && view !== 'home') setView('courses');
  }

  function handleTagClick(tag) {
    filters.setQuery(tag);
    setView('courses');
  }

  const handleToggleFav = useCallback((id) => {
    return userData.toggleFav(id);
  }, [userData]);

  const handleToggleBk = useCallback((id) => {
    return userData.toggleBk(id);
  }, [userData]);

  const handleSetProg = useCallback((id, status) => {
    userData.setProg(id, status);
  }, [userData]);

  // Close sidebar on overlay click
  function handleOverlayClick() {
    setSidebarOpen(false);
  }

  // Close progress dropdowns on outside click — handled in CourseCard component

  const filterProps = {
    cat: filters.cat,
    level: filters.level,
    type: filters.type,
    filtered: filters.filtered,
    onCat: filters.setCat,
    onLevel: filters.setLevel,
    onType: filters.setType,
  };

  const commonCardProps = {
    userData,
    onToggleFav: handleToggleFav,
    onToggleBk: handleToggleBk,
    onSetProg: handleSetProg,
    onTagClick: handleTagClick,
    onToast: showToast,
    onPlay: setPlayingVideo,
  };

  return (
    <>
      {sidebarOpen && <div id="overlay" className="show" onClick={handleOverlayClick}></div>}
      {!sidebarOpen && <div id="overlay"></div>}
      <div className="layout">
          <Sidebar currentView={view} onNavigate={navigate} sidebarOpen={sidebarOpen} />
        <div className="main">
          <Header
            query={filters.query}
            onSearch={handleSearch}
            onMenuClick={() => setSidebarOpen(v => !v)}
            totalCourses={COURSES.length}
          />
          <div className="content">
            {view === 'home' && (
              <HomeView
                onNavigateToCategory={navigateToCategory}
                onNavigateToLevel={navigateToLevel}
              />
            )}
            {view === 'courses' && (
              <CoursesView filters={filterProps} {...commonCardProps} examOnly={examOnly} onExamToggle={setExamOnly} />
            )}
            {view === 'dashboard' && (
              <DashboardView {...commonCardProps} />
            )}
            {view === 'favorites' && (
              <FavoritesView {...commonCardProps} />
            )}
            {view === 'bookmarks' && (
              <BookmarksView {...commonCardProps} />
            )}
          </div>
        </div>
      </div>
      {playingVideo && <VideoModal course={playingVideo} onClose={() => setPlayingVideo(null)} />}
      <div
        id="toast"
        className={toast.show ? 'show' : ''}
        style={{ pointerEvents: 'none' }}
      >
        {toast.msg}
      </div>
    </>
  );
}
