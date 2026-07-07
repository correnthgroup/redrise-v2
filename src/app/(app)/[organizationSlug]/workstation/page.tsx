import { WorkstationOverview } from "@/domains/workstation/components/workstation-overview"

type WorkstationPageProps = {
  params: Promise<{ organizationSlug: string }>
}

export default async function WorkstationPage({ params }: WorkstationPageProps) {
  const { organizationSlug } = await params
  return <WorkstationOverview organizationSlug={organizationSlug} />
}
