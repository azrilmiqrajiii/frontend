import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../context/useAuth"

export default function ChangePasswordGuardDosen() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  if (location.pathname !== "/dosen/change-password") return <Outlet />

  if (user.passwordChanged) {
    if (!user.profileComplete)
      return <Navigate to="/dosen/complete-profile" replace />

    return <Navigate to="/dosen/dashboard" replace />
  }

  return <Outlet />
}
