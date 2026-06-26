import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import PlayerNew from './pages/PlayerNew';
import PlayerDetail from './pages/PlayerDetail';
import PlayerEdit from './pages/PlayerEdit';
import Matches from './pages/Matches';
import MatchNew from './pages/MatchNew';
import MatchDetail from './pages/MatchDetail';
import MatchEdit from './pages/MatchEdit';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Player routes */}
          <Route
            path="/players"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Players />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlayerNew />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlayerDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/:id/edit"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PlayerEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Match routes */}
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Matches />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MatchNew />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MatchDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches/:id/edit"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MatchEdit />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}