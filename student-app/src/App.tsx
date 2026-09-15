import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BottomNav } from './components/navigation/BottomNav';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/auth/AuthPage';
import { CreateGroupPage } from './pages/groups/CreateGroupPage';
import { GroupStatusPage } from './pages/groups/GroupStatusPage';
import { GroupsPage } from './pages/groups/GroupsPage';
import { HomePage } from './pages/home/HomePage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { TripsPage } from './pages/trips/TripsPage';
import { WelcomePage } from './pages/welcome/WelcomePage';

function AppRoutes() {
  const { currentStudent } = useAppContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'home' | 'groups' | 'trips' | 'profile'>('home');

  useEffect(() => {
    const tabMap: Record<string, 'home' | 'groups' | 'trips' | 'profile'> = {
      '/home': 'home',
      '/groups': 'groups',
      '/trips': 'trips',
      '/profile': 'profile',
    };
    setActiveTab(tabMap[location.pathname] ?? 'home');
  }, [location.pathname]);

  if (!isAuthenticated || !currentStudent) {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  const handleTabChange = (tab: 'home' | 'groups' | 'trips' | 'profile') => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pb-20">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/create" element={<CreateGroupPage />} />
          <Route path="/status" element={<GroupStatusPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
      <BottomNav activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
