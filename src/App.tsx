import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import JobApply from './pages/JobApply';
import Applications from './pages/Applications';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import Features from './pages/Features';
import { hasCompletedOnboarding, isAuthenticated } from './data/profileUtils';
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="dashboard-scroll-area">
          {children}
        </div>
      </main>
    </div>
  );
}

function RequireOnboarding({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return hasCompletedOnboarding() ? children : <Navigate to="/onboarding" replace />;
}

function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
        
        <Route path="/" element={<RequireOnboarding><AppLayout><Dashboard /></AppLayout></RequireOnboarding>} />
        <Route path="/courses" element={<RequireOnboarding><AppLayout><Courses /></AppLayout></RequireOnboarding>} />
        <Route path="/courses/:courseId" element={<RequireOnboarding><AppLayout><CourseDetails /></AppLayout></RequireOnboarding>} />
        <Route path="/jobs" element={<RequireOnboarding><AppLayout><Jobs /></AppLayout></RequireOnboarding>} />
        <Route path="/saved-jobs" element={<Navigate to="/jobs" replace />} />
        <Route path="/applications" element={<RequireOnboarding><AppLayout><Applications /></AppLayout></RequireOnboarding>} />
        <Route path="/jobs/:jobId" element={<RequireOnboarding><AppLayout><JobDetails /></AppLayout></RequireOnboarding>} />
        <Route path="/jobs/:jobId/apply" element={<RequireOnboarding><AppLayout><JobApply /></AppLayout></RequireOnboarding>} />
        <Route path="/projects" element={<Navigate to="/jobs" replace />} />
        <Route path="/credits" element={<Navigate to="/portfolio" replace />} />
        <Route path="/portfolio" element={<RequireOnboarding><AppLayout><Portfolio /></AppLayout></RequireOnboarding>} />
        <Route path="/settings" element={<RequireOnboarding><AppLayout><Settings /></AppLayout></RequireOnboarding>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
