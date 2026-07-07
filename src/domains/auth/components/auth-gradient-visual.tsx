import { cn } from "@/lib/utils"

function GradientBlinds({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden bg-[#14090b]",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_28%_24%,rgba(242,242,242,0.95),transparent_22%),linear-gradient(90deg,rgba(242,242,242,0.88),rgba(140,31,40,0.96))]",
        "after:absolute after:inset-0 after:bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.16)_0_18px,rgba(0,0,0,0.14)_18px_60px)] after:mix-blend-overlay",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_58%,rgba(255,255,255,0.18),transparent_34%)]" />
      <div className="absolute inset-x-10 bottom-10 rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/70">RedRise</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">Build deterministic AI operations.</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">
          Configure, build, activate, execute, observe and improve from one workstation.
        </p>
      </div>
    </div>
  )
}

export function AuthGradientVisual() {
  return (
    <div className="hidden min-h-[560px] overflow-hidden bg-muted md:block">
      <GradientBlinds />
    </div>
  )
}
