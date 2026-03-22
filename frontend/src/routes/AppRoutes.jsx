import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ServiceManagement from '../pages/ServiceManagement';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/services" element={<ServiceManagement />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div>Dashboard</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
