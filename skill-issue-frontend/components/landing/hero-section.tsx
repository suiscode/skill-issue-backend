import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background grid effect */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
          <Zap className="h-3.5 w-3.5" />
          <span>Season 4 is now live</span>
        </div>

        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Play. Compete.
          <br />
          <span className="text-primary glow-text">Win Real Money.</span>
        </h1>

        <p className="max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
          The premier competitive gaming platform for serious players. Create
          5v5 matches, bet with confidence, and cash out instantly.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="glow-md bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base font-semibold"
          >
            <Link href="/signup">
              Create Match
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground px-8 text-base"
          >
            <Link href="/signin">Join Match</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
