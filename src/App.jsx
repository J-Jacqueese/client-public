import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalToast from './components/GlobalToast';
import HomePage from './pages/HomePage';
import ModelsPage from './pages/ModelsPage';
import ModelDetailPage from './pages/ModelDetailPage';
import AppsPage from './pages/AppsPage';
import AppDetailPage from './pages/AppDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import EventSubmitPage from './pages/EventSubmitPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectSubmitPage from './pages/ProjectSubmitPage';

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <div className="min-h-screen bg-slate-50/50 text-slate-900">
        <Navbar />
        <GlobalToast />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/apps/:id" element={<AppDetailPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/submit" element={<EventSubmitPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/projects/submit" element={<ProjectSubmitPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
