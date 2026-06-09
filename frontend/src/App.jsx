import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import { useTheme } from './context/ThemeContext';

function App() {
  const { isDark } = useTheme();

  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0c0c14] transition-colors duration-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateTicketPage />} />
            <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#1e1e2e' : '#ffffff',
              color: isDark ? '#e2e8f0' : '#1e293b',
              border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.875rem',
              boxShadow: isDark
                ? '0 4px 24px rgba(0,0,0,0.4)'
                : '0 4px 24px rgba(0,0,0,0.06)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
