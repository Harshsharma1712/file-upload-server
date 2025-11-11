import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from './pages/Dashboard.jsx'

function App() {

  const token = localStorage.getItem("token");

  function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // If token exists, allow access
    return children;
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
