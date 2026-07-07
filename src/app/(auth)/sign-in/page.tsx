import { AuthLayout } from "@/domains/auth/components/auth-layout"
import { SignInForm } from "@/domains/auth/components/sign-in-form"

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  )
}
