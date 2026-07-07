import { redirect } from "next/navigation"

type OrganizationIndexPageProps = {
  params: Promise<{ organizationSlug: string }>
}

export default async function OrganizationIndexPage({ params }: OrganizationIndexPageProps) {
  const { organizationSlug } = await params
  redirect(`/${organizationSlug}/workstation`)
}
