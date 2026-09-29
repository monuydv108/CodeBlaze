import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import ProblemSolve from "./pages/ProblemSolve";
import UserDashboard from './pages/userDashboard';
import DSATopics from './pages/DSATopics';
import DSATopic from './pages/DSATopic';
import AdminUpload from "./components/AdminUpload";
import AdminVideo from "./components/AdminVideo";

/* ── Reusable admin guard ─────────────────────────────────────────────────── */
const AdminRoute = ({ isAuthenticated, role, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin')  return <Navigate to="/" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0b0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Syne', -apple-system, sans-serif"
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid rgba(108, 142, 247, 0.2)',
          borderTopColor: '#6c8ef7',
          animation: 'app-spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes app-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public / Auth ── */}
      <Route path="/"       element={isAuthenticated ? <Homepage />         : <Navigate to="/login" replace />} />
      <Route path="/login"  element={isAuthenticated ? <Navigate to="/" replace />  : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace />  : <Signup />} />

      {/* ── Protected / Core App ── */}
      <Route path="/problem/:id" element={isAuthenticated ? <ProblemSolve /> : <Navigate to="/login" replace />} />
      <Route path="/profile"     element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" replace />} />
      <Route path="/topics"      element={<DSATopics />} />
      <Route path="/topics/:slug" element={<DSATopic />} />

      {/* ── Admin (protected) ── */}
      <Route path="/admin" element={
        <AdminRoute isAuthenticated={isAuthenticated} role={user?.role}>
          <AdminPanel />
        </AdminRoute>
      } />
      <Route path="/admin/video" element={
        <AdminRoute isAuthenticated={isAuthenticated} role={user?.role}>
          <AdminVideo />
        </AdminRoute>
      } />
      <Route path="/admin/upload/:problemId" element={
        <AdminRoute isAuthenticated={isAuthenticated} role={user?.role}>
          <AdminUpload />
        </AdminRoute>
      } />

      {/* ── Catch-all fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
