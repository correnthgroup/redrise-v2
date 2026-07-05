import { SignupForm } from "@/components/signup-form"

export const dynamic = "force-dynamic"

type SignupPageProps = {
  searchParams: Promise<{ invited?: string; email?: string; invite_token?: string }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams
  return (
    <SignupForm
      className="w-full"
      invited={params.invited === "1"}
      initialEmail={params.email ?? ""}
      inviteToken={params.invite_token ?? null}
    />
  )
}
