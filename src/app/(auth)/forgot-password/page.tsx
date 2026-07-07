import { AuthLayout } from "@/domains/auth/components/auth-layout"
import { ForgotPasswordForm } from "@/domains/auth/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
