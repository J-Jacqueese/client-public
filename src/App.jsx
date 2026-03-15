import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ModelsPage from './pages/ModelsPage';
import ModelDetailPage from './pages/ModelDetailPage';
import AppsPage from './pages/AppsPage';
import AppDetailPage from './pages/AppDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50 text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:id" element={<ModelDetailPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/apps/:id" element={<AppDetailPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
