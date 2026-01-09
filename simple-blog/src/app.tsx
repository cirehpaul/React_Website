
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/login';
import Register from './login/register';
import Blogs from './pages/blogs';
import CreateBlog from './pages/createBlog';
import type { RootState } from './store/store';

export default function App() {
  const user = useSelector((state: RootState) => state.auth.user); // ✅ inside component

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/blogs" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/blogs" replace /> : <Register />}
      />
      <Route
        path="/blogs"
        element={user ? <Blogs /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/blogs/create"
        element={user ? <CreateBlog /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/blogs" : "/login"} replace />}
      />
    </Routes>
  );
}
