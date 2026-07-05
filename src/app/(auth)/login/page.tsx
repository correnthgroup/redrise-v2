import { LoginForm } from "@/components/login-form"

export const dynamic = "force-dynamic"

type LoginPageProps = {
  searchParams: Promise<{ created?: string; redirectTo?: string }>
}

function safeRedirect(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/workstation"
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  return (
    <LoginForm
      className="w-full"
      accountCreated={params.created === "1"}
      redirectTo={safeRedirect(params.redirectTo)}
    />
  )
}
