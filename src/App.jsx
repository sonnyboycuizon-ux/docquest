import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import Dashboard from './pages/Dashboard'
import RequestDocument from './pages/RequestDocument'
import RequestHistory from './pages/RequestHistory'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'

import AdminDashboard from './pages/AdminDashboard'
import RequestAnalysis from './pages/RequestAnalysis'
import ManageStudents from './pages/ManageStudents'
import AddAdmin from './pages/AddAdmin'
import SetPassword from './pages/SetPassword'
import ManageAdminAccounts from './pages/ManageAdminAccounts'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING PAGE */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* AUTHENTICATION */}
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* PASSWORD RESET */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* STUDENT */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/request-document"
          element={<RequestDocument />}
        />

        <Route
          path="/request-history"
          element={<RequestHistory />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/request-analysis"
          element={<RequestAnalysis />}
        />

        <Route
          path="/manage-students"
          element={<ManageStudents />}
        />

        <Route
          path="/add-admin"
          element={<AddAdmin />}
        />

        <Route
          path="/set-password"
          element={<SetPassword />}
        />

        <Route
          path="/manage-admin-accounts"
          element={<ManageAdminAccounts />}
        />

        {/* UNKNOWN ROUTES */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
