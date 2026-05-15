import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import RateStore from './pages/RateStore';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/owner" 
          element={
            <ProtectedRoute allowedRoles={['Store Owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/rate/:id" 
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <RateStore />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
