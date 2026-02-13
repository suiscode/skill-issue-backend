"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Swords, Trophy, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TopNavbar } from "@/components/top-navbar"
import {
  useCreateLobbyMutation,
  useGamesQuery,
} from "@/lib/__generated__/apollo-hooks"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const WAGER_PRESETS = [5000, 10000, 20000] as const

export default function CreateMatchPage() {
  const router = useRouter()
  const { data, loading: loadingGames, error: gamesError } = useGamesQuery()
  const [createLobby, { loading: creatingLobby }] = useCreateLobbyMutation()

  const [betAmount, setBetAmount] = useState(5000)
  const [selectedWagerOption, setSelectedWagerOption] = useState<number | "custom">(5000)
  const [selectedGameId, setSelectedGameId] = useState("")
  const [teamCount, setTeamCount] = useState(2)
  const [playersPerTeam, setPlayersPerTeam] = useState(5)
  const [submitError, setSubmitError] = useState("")

  const games = useMemo(() => data?.games ?? [], [data?.games])
  const selectedGame = games.find((game) => game.id === selectedGameId)
  const selectedRule = selectedGame?.lobbyRule
  const isCustomConfig = selectedRule?.configMode === "CUSTOM_BR"
  const minWager = selectedRule?.minWagerCents ?? 100
  const maxWager = selectedRule?.maxWagerCents ?? 100000

  useEffect(() => {
    if (!selectedGameId && games.length > 0) {
      setSelectedGameId(games[0].id)
    }
  }, [games, selectedGameId])

  useEffect(() => {
    if (!selectedRule) {
      return
    }

    const fallbackTeamCount = selectedRule.fixedTeamCount ?? selectedRule.minTeamCount ?? 2
    const fallbackPlayersPerTeam =
      selectedRule.fixedPlayersPerTeam ?? selectedRule.minPlayersPerTeam ?? 5

    setTeamCount(fallbackTeamCount)
    setPlayersPerTeam(fallbackPlayersPerTeam)
    if (betAmount < minWager || betAmount > maxWager) {
      const firstValidPreset =
        WAGER_PRESETS.find((preset) => preset >= minWager && preset <= maxWager) ?? minWager
      setBetAmount(firstValidPreset)
      setSelectedWagerOption(
        WAGER_PRESETS.includes(firstValidPreset as (typeof WAGER_PRESETS)[number])
          ? firstValidPreset
          : "custom",
      )
    }
  }, [selectedRule, betAmount, minWager, maxWager])

  const totalPool = betAmount * teamCount * playersPerTeam
  const potentialWinnings = totalPool * 0.9

  const onCreateLobby = async () => {
    if (!selectedGame || !selectedRule) {
      setSubmitError("Please select an active game.")
      return
    }

    try {
      setSubmitError("")
      const result = await createLobby({
        variables: {
          input: {
            gameId: selectedGame.id,
            stakePerPlayerCents: Math.round(betAmount),
            teamCount: isCustomConfig ? teamCount : undefined,
            playersPerTeam: isCustomConfig ? playersPerTeam : undefined,
          },
        },
      })
      const lobbyId = result.data?.createLobby.id
      if (!lobbyId) {
        throw new Error("No lobby created.")
      }
      router.push(`/lobby/${lobbyId}`)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create lobby.",
      )
    }
  }

  return (
    <>
      <TopNavbar title="Create Match" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Create a New Match
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a game first, then configure the lobby based on game rules.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Form */}
            <div className="flex flex-col gap-5 lg:col-span-3">
              {/* Game Selection */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Swords className="h-4 w-4 text-primary" />
                  Game
                </label>
                <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                  <SelectTrigger className="border-border bg-secondary text-foreground">
                    <SelectValue placeholder={loadingGames ? "Loading..." : "Select a game"} />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {gamesError ? (
                  <p className="mt-2 text-xs text-destructive">
                    Failed to load games from backend.
                  </p>
                ) : null}
              </div>

              {/* Format */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  Team Configuration
                </label>
                {isCustomConfig ? (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">Team count</p>
                      <Slider
                        value={[teamCount]}
                        onValueChange={(value) => setTeamCount(value[0])}
                        min={selectedRule?.minTeamCount ?? 2}
                        max={selectedRule?.maxTeamCount ?? 10}
                        step={1}
                      />
                      <p className="mt-2 text-sm text-foreground">{teamCount} teams</p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">Players per team</p>
                      <Slider
                        value={[playersPerTeam]}
                        onValueChange={(value) => setPlayersPerTeam(value[0])}
                        min={selectedRule?.minPlayersPerTeam ?? 1}
                        max={selectedRule?.maxPlayersPerTeam ?? 4}
                        step={1}
                      />
                      <p className="mt-2 text-sm text-foreground">{playersPerTeam} players</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Fixed mode: {selectedRule?.fixedTeamCount ?? 2} teams x{" "}
                    {selectedRule?.fixedPlayersPerTeam ?? 5} players per team
                  </div>
                )}
              </div>

              {/* Bet Amount */}
              <div className="rounded-xl border border-border bg-card p-5">
                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Bet per Player
                </label>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {betAmount.toLocaleString()} MNT
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {minWager.toLocaleString()} - {maxWager.toLocaleString()} MNT
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {WAGER_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={selectedWagerOption === preset ? "default" : "outline"}
                      onClick={() => {
                        setSelectedWagerOption(preset)
                        setBetAmount(Math.min(maxWager, Math.max(minWager, preset)))
                      }}
                    >
                      {preset.toLocaleString()}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant={selectedWagerOption === "custom" ? "default" : "outline"}
                    onClick={() => setSelectedWagerOption("custom")}
                  >
                    Custom
                  </Button>
                </div>
                {selectedWagerOption === "custom" ? (
                  <div className="mt-3">
                    <Input
                      type="number"
                      min={minWager}
                      max={maxWager}
                      value={betAmount}
                      onChange={(event) => {
                        const value = Number(event.target.value)
                        setBetAmount(Number.isNaN(value) ? minWager : value)
                      }}
                      onBlur={() => {
                        const clamped = Math.min(maxWager, Math.max(minWager, betAmount))
                        setBetAmount(clamped)
                      }}
                      placeholder="Enter custom wager in MNT"
                    />
                  </div>
                ) : null}
              </div>

              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
              <Button
                size="lg"
                className="glow-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                onClick={onCreateLobby}
                disabled={creatingLobby || loadingGames || !selectedGame}
              >
                {creatingLobby ? "Creating Lobby..." : "Create Lobby"}
              </Button>
            </div>

            {/* Preview Card */}
            <div className="lg:col-span-2">
              <div className="sticky top-6 rounded-xl border border-primary/20 bg-card p-6 glow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Match Preview
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs text-muted-foreground">Game</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedGame
                        ? selectedGame.name
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs text-muted-foreground">
                      Format
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {teamCount} teams x {playersPerTeam}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs text-muted-foreground">
                      Bet / Player
                    </span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {betAmount.toLocaleString()} MNT
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs text-muted-foreground">
                      Total Pool
                    </span>
                    <span className="font-mono text-sm font-medium text-foreground">
                      {totalPool.toLocaleString()} MNT
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="text-xs text-muted-foreground">
                      Platform Fee
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      10%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      Potential Winnings
                    </span>
                    <span className="font-mono text-lg font-bold text-primary">
                      {Math.round(potentialWinnings).toLocaleString()} MNT
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed">
                  Tactical/MOBA games use fixed team sizes. Battle-royale games can
                  use custom teams and players per team within backend-defined limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
