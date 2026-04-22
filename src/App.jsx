import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Courses from './pages/Courses';
import Projects from './pages/Projects';
import Credits from './pages/Credits';
import Portfolio from './pages/Portfolio';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/courses" element={<AppLayout><Courses /></AppLayout>} />
        <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
        <Route path="/credits" element={<AppLayout><Credits /></AppLayout>} />
        <Route path="/portfolio" element={<AppLayout><Portfolio /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
