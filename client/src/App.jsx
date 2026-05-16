import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import RateStore from './pages/RateStore';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import StoreManagement from './pages/StoreManagement';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/stores" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Layout><StoreManagement /></Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* User Routes */}
        <Route 
          path="/user" 
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <Layout><UserDashboard /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/rate/:id" 
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <Layout><RateStore /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Owner Routes */}
        <Route 
          path="/owner" 
          element={
            <ProtectedRoute allowedRoles={['Store Owner']}>
              <Layout><OwnerDashboard /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Shared Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/change-password" 
          element={
            <ProtectedRoute>
              <Layout><ChangePassword /></Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
