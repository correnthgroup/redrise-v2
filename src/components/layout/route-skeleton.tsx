type RouteSkeletonProps = {
  title: string
  description: string
  screenId: string
}

export function RouteSkeleton({ title, description, screenId }: RouteSkeletonProps) {
  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">{screenId}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-sm text-muted-foreground">
        Foundation skeleton only. Final domain logic will be implemented in its dedicated PRD.
      </div>
    </section>
  )
}
