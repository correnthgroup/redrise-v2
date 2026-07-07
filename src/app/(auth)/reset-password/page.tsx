import { AuthLayout } from "@/domains/auth/components/auth-layout"
import { ResetPasswordForm } from "@/domains/auth/components/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  )
}
