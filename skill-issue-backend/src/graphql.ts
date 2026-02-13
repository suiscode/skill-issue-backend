
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TeamSide {
    A = "A",
    B = "B"
}

export enum MatchStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    LIVE = "LIVE",
    RESULT_PENDING = "RESULT_PENDING",
    SETTLED = "SETTLED",
    CANCELLED = "CANCELLED",
    DISPUTED = "DISPUTED"
}

export class SignUpInput {
    email: string;
    username: string;
    password: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export class CreateLobbyInput {
    gameId: string;
    stakePerPlayerCents: number;
    teamCount?: Nullable<number>;
    playersPerTeam?: Nullable<number>;
}

export class JoinLobbyInput {
    lobbyId: string;
    teamSide: TeamSide;
}

export class CreateMatchInput {
    lobbyId: string;
    betPerPlayerCents: number;
}

export class SubmitMatchResultInput {
    matchId: string;
    winnerTeamSide: TeamSide;
    resultEvidence: string;
}

export class CreateUserInput {
    email: string;
    username: string;
}

export class AuthPayload {
    accessToken: string;
    user: User;
}

export abstract class IMutation {
    abstract signUp(input: SignUpInput): AuthPayload | Promise<AuthPayload>;

    abstract signIn(input: SignInInput): AuthPayload | Promise<AuthPayload>;

    abstract resendVerificationEmail(email: string): boolean | Promise<boolean>;

    abstract createLobby(input: CreateLobbyInput): Lobby | Promise<Lobby>;

    abstract joinLobby(input: JoinLobbyInput): Lobby | Promise<Lobby>;

    abstract createMatch(input: CreateMatchInput): Match | Promise<Match>;

    abstract submitMatchResult(input: SubmitMatchResultInput): Match | Promise<Match>;

    abstract createUser(input: CreateUserInput): User | Promise<User>;
}

export class GameLobbyRule {
    configMode: string;
    fixedTeamCount?: Nullable<number>;
    fixedPlayersPerTeam?: Nullable<number>;
    minTeamCount?: Nullable<number>;
    maxTeamCount?: Nullable<number>;
    minPlayersPerTeam?: Nullable<number>;
    maxPlayersPerTeam?: Nullable<number>;
    allowCustomTeams: boolean;
    allowCustomPlayersPerTeam: boolean;
    minWagerCents: number;
    maxWagerCents: number;
}

export class Game {
    id: string;
    key: string;
    name: string;
    category: string;
    isActive: boolean;
    lobbyRule: GameLobbyRule;
}

export class Lobby {
    id: string;
    gameId: string;
    game: string;
    stakePerPlayerCents: number;
    teamCount: number;
    playersPerTeam: number;
    teamAUserIds: string[];
    teamBUserIds: string[];
    status: string;
}

export abstract class IQuery {
    abstract games(): Game[] | Promise<Game[]>;

    abstract lobbies(): Lobby[] | Promise<Lobby[]>;

    abstract matches(): Match[] | Promise<Match[]>;

    abstract match(id: string): Match | Promise<Match>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract userByEmail(email: string): Nullable<User> | Promise<Nullable<User>>;

    abstract walletBalance(): WalletBalance | Promise<WalletBalance>;
}

export class Match {
    id: string;
    lobbyId: string;
    betPerPlayerCents: number;
    status: MatchStatus;
    winnerTeamSide?: Nullable<TeamSide>;
    resultEvidence?: Nullable<string>;
}

export class User {
    id: string;
    email: string;
    username: string;
    mmr: number;
    region: string;
}

export class WalletBalance {
    availableCents: number;
    escrowedCents: number;
    currency: string;
}

type Nullable<T> = T | null;
