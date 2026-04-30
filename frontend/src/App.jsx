import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import Students from './components/Students';
import Faculty from './components/Faculty';
import Courses from './components/Courses';
import Instructions from './components/Instructions';
import Schedules from './components/Schedules';
import Events from './components/Events';
import ApiTester from './components/ApiTester';

// Enhanced Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to their own dashboard if they try to access something they aren't allowed
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/test-api" element={<ApiTester />} />
        
        {/* Role-Specific Dashboards */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/faculty/dashboard" element={
          <ProtectedRoute allowedRoles={['faculty', 'admin']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Management Routes (Admin & Faculty only) */}
        <Route path="/students" element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="/faculty" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Faculty />
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <Courses />
          </ProtectedRoute>
        } />
        <Route path="/instructions" element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <Instructions />
          </ProtectedRoute>
        } />
        <Route path="/schedules" element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <Schedules />
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute allowedRoles={['admin', 'faculty', 'student']}>
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['admin', 'faculty']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Root Redirect based on role */}
        <Route path="/" element={<HomeRedirect />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Component to handle root path redirection based on role
const HomeRedirect = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (userRole === 'faculty') return <Navigate to="/faculty/dashboard" replace />;
  if (userRole === 'student') return <Navigate to="/student/dashboard" replace />;
  
  return <Navigate to="/login" replace />;
};

export default App;
