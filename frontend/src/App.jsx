import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';

// Protected Route component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} />;
  }

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to={`/${user.role}`} /> : <Login />} 
        />
        
        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/parent" 
          element={
            <ProtectedRoute allowedRole="parent">
              <ParentDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/" 
          element={
            user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

