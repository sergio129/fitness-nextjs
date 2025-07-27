import LoginForm from "./LoginForm"
import { AuthWrapper } from "@/components/AuthWrapper"

export default function LoginPage() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  )
}