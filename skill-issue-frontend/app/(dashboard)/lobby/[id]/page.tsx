"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Shield, Swords, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TopNavbar } from "@/components/top-navbar"
import { TeamPanel } from "@/components/lobby/team-panel"
import { LobbyChat } from "@/components/lobby/lobby-chat"
import { useAuth } from "@/components/auth-provider"
import {
  TeamSide,
  useGamesQuery,
  useJoinLobbyMutation,
  useLobbiesQuery,
} from "@/lib/__generated__/apollo-hooks"

function shortenUserId(id: string) {
  if (id.length <= 10) return id
  return `${id.slice(0, 5)}...${id.slice(-4)}`
}

export default function LobbyPage() {
  const params = useParams<{ id: string }>()
  const lobbyId = params?.id
  const { user, isAuthenticated } = useAuth()
  const [joinError, setJoinError] = useState("")

  const { data, loading, error, refetch } = useLobbiesQuery({
    pollInterval: 5000,
    skip: !lobbyId,
  })
  const { data: gamesData } = useGamesQuery()
  const [joinLobby, { loading: joiningLobby }] = useJoinLobbyMutation()

  const lobby = useMemo(
    () => data?.lobbies.find((entry) => entry.id === lobbyId),
    [data?.lobbies, lobbyId],
  )

  const gameName = useMemo(() => {
    if (!lobby) return "-"
    return gamesData?.games.find((game) => game.id === lobby.gameId)?.name ?? lobby.game
  }, [gamesData?.games, lobby])

  const currentUserId = user?.id
  const isInTeamA = Boolean(currentUserId && lobby?.teamAUserIds.includes(currentUserId))
  const isInTeamB = Boolean(currentUserId && lobby?.teamBUserIds.includes(currentUserId))
  const joinedTeamLabel = isInTeamA ? "Team A" : isInTeamB ? "Team B" : null

  const teamACount = lobby?.teamAUserIds.length ?? 0
  const teamBCount = lobby?.teamBUserIds.length ?? 0
  const perTeamLimit = lobby?.playersPerTeam ?? 0
  const canUseJoinButtons = Boolean(lobby && lobby.teamCount <= 2)

  const teamAPlayers =
    lobby?.teamAUserIds.map((id) => ({
      id,
      name: id === currentUserId ? `${user?.username ?? "You"} (You)` : shortenUserId(id),
      ready: lobby.status === "READY",
    })) ?? []

  const teamBPlayers =
    lobby?.teamBUserIds.map((id) => ({
      id,
      name: id === currentUserId ? `${user?.username ?? "You"} (You)` : shortenUserId(id),
      ready: lobby.status === "READY",
    })) ?? []

  const onJoin = async (teamSide: TeamSide) => {
    if (!lobby) return
    try {
      setJoinError("")
      await joinLobby({
        variables: {
          input: {
            lobbyId: lobby.id,
            teamSide,
          },
        },
      })
      await refetch()
    } catch (err) {
      setJoinError(err instanceof Error ? err.message : "Failed to join team")
    }
  }

  if (!lobbyId) {
    return (
      <>
        <TopNavbar title="Match Lobby" />
        <div className="p-6 text-sm text-destructive">Invalid lobby id.</div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <TopNavbar title="Match Lobby" />
        <div className="p-6 text-sm text-muted-foreground">Loading lobby...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <TopNavbar title="Match Lobby" />
        <div className="p-6 text-sm text-destructive">
          Failed to load lobby: {error.message}
        </div>
      </>
    )
  }

  if (!lobby) {
    return (
      <>
        <TopNavbar title="Match Lobby" />
        <div className="p-6 text-sm text-muted-foreground">
          Lobby not found or no longer available.
        </div>
      </>
    )
  }

  return (
    <>
      <TopNavbar title="Match Lobby" />
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {gameName} ({lobby.teamCount} teams x {lobby.playersPerTeam})
              </span>
            </div>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-xs">
              {lobby.stakePerPlayerCents.toLocaleString()} MNT / player
            </Badge>
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-xs">
              <Shield className="mr-1 h-3 w-3" />
              Status: {lobby.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2">
            <Users className="h-4 w-4 text-chart-3" />
            <span className="text-xs text-muted-foreground">
              Team A {teamACount}/{perTeamLimit} | Team B {teamBCount}/{perTeamLimit}
            </span>
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <TeamPanel team="Team A" players={teamAPlayers} color="primary" maxPlayers={lobby.playersPerTeam} />
            <Button
              className="w-full"
              onClick={() => onJoin(TeamSide.A)}
              disabled={
                joiningLobby ||
                !isAuthenticated ||
                !canUseJoinButtons ||
                teamACount >= perTeamLimit ||
                Boolean(joinedTeamLabel)
              }
            >
              {joinedTeamLabel === "Team A" ? "Joined Team A" : "Join Team A"}
            </Button>
          </div>
          <div className="space-y-3">
            <TeamPanel
              team="Team B"
              players={teamBPlayers}
              color="destructive"
              maxPlayers={lobby.playersPerTeam}
            />
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => onJoin(TeamSide.B)}
              disabled={
                joiningLobby ||
                !isAuthenticated ||
                !canUseJoinButtons ||
                teamBCount >= perTeamLimit ||
                Boolean(joinedTeamLabel)
              }
            >
              {joinedTeamLabel === "Team B" ? "Joined Team B" : "Join Team B"}
            </Button>
          </div>
        </div>

        {!canUseJoinButtons ? (
          <p className="mb-4 text-sm text-muted-foreground">
            Multi-team join flow is not implemented yet for this lobby type.
          </p>
        ) : null}
        {!isAuthenticated ? (
          <p className="mb-4 text-sm text-muted-foreground">Sign in to join a team.</p>
        ) : null}
        {joinedTeamLabel ? (
          <p className="mb-4 text-sm text-success">You are in {joinedTeamLabel}.</p>
        ) : null}
        {joinError ? <p className="mb-4 text-sm text-destructive">{joinError}</p> : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <LobbyChat />
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground">Lobby Summary</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Players join one side, and once both teams are full the lobby moves to READY.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>Lobby ID: {lobby.id}</p>
              <p>Team count: {lobby.teamCount}</p>
              <p>Players per team: {lobby.playersPerTeam}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
