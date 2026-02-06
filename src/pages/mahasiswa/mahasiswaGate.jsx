import { Navigate } from "react-router-dom"
import useAuth from "../../context/useAuth"

export default function MahasiswaGate() {
  const { user } = useAuth()

  if (!user.passwordChanged)
    return <Navigate to="onboarding/password" replace />

  if (!user.profileComplete)
    return <Navigate to="onboarding/profile" replace />

  return <Navigate to="dashboard" replace />
}
