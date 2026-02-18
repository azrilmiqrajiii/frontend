import { Navigate } from "react-router-dom"
import useAuth from "../context/useAuth"

export default function DosenEntry() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  if (!user.passwordChanged)
    return <Navigate to="/dosen/change-password" replace />

  if (!user.profileComplete)
    return <Navigate to="/dosen/complete-profile" replace />

  return <Navigate to="/dosen/dashboard" replace />
}
