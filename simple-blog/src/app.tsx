import { Routes, Route, Navigate } from 'react-router-dom'; 
import Login from './login/login';
import Register from './login/register';
import Blogs from './pages/blogs';
import CreateBlog from './pages/createBlog'; // Ensure the filename is exactly 'createBlog.tsx'
import ProtectedRoute from './route/protectedRoute';

function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route 
        path="/blogs" 
        element={
          <ProtectedRoute>
            <Blogs />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/blogs/create" 
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;