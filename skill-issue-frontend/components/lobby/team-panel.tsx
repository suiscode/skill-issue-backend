import { Check, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Player {
  id?: string
  name: string
  avatar?: string
  ready?: boolean
  rank?: string
}

export function TeamPanel({
  team,
  players,
  color,
  maxPlayers = 5,
}: {
  team: string
  players: Player[]
  color: "primary" | "destructive"
  maxPlayers?: number
}) {
  const emptySlots = Math.max(0, maxPlayers - players.length)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div
        className={`border-b px-5 py-4 ${
          color === "primary" ? "border-primary/20" : "border-destructive/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              color === "primary" ? "text-primary" : "text-destructive"
            }`}
          >
            {team}
          </h3>
          <Badge
            variant="outline"
            className={`text-[10px] ${
              color === "primary"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {players.filter((p) => p.ready).length}/{players.length} Ready
          </Badge>
        </div>
      </div>
      <div className="divide-y divide-border">
        {players.map((player) => (
          <div
            key={player.id ?? player.name}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage
                  src={
                    player.avatar ??
                    `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(player.name)}`
                  }
                />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {player.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {player.name}
                </span>
                {player.rank ? (
                  <span className="text-xs text-muted-foreground">
                    {player.rank}
                  </span>
                ) : null}
              </div>
            </div>
            {player.ready ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                <Check className="h-3.5 w-3.5 text-success" />
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-3/10">
                <Clock className="h-3.5 w-3.5 text-chart-3" />
              </div>
            )}
          </div>
        ))}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center justify-center px-5 py-3.5"
          >
            <span className="text-xs text-muted-foreground">
              Waiting for player...
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
