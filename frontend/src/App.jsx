import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PropertyDetailsPage from './pages/PropertyDetailsPage.jsx';
import PropertyFormPage from './pages/PropertyFormPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={(
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            )}
          />
          <Route
            path="/register"
            element={(
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            )}
          />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/properties/new"
            element={(
              <ProtectedRoute>
                <PropertyFormPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/properties/:id/edit"
            element={(
              <ProtectedRoute>
                <PropertyFormPage isEdit />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
