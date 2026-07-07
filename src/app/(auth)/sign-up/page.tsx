import { AuthLayout } from "@/domains/auth/components/auth-layout"
import { SignUpForm } from "@/domains/auth/components/sign-up-form"

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  )
}
