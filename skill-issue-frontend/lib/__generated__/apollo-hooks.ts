import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type CreateLobbyInput = {
  game: Scalars['String']['input'];
  region: Scalars['String']['input'];
  stakePerPlayerCents: Scalars['Int']['input'];
};

export type CreateMatchInput = {
  betPerPlayerCents: Scalars['Int']['input'];
  lobbyId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type JoinLobbyInput = {
  lobbyId: Scalars['ID']['input'];
  teamSide: TeamSide;
};

export type Lobby = {
  __typename?: 'Lobby';
  game: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  region: Scalars['String']['output'];
  stakePerPlayerCents: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  teamAUserIds: Array<Scalars['String']['output']>;
  teamBUserIds: Array<Scalars['String']['output']>;
};

export type Match = {
  __typename?: 'Match';
  betPerPlayerCents: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  lobbyId: Scalars['ID']['output'];
  resultEvidence?: Maybe<Scalars['String']['output']>;
  status: MatchStatus;
  winnerTeamSide?: Maybe<TeamSide>;
};

export enum MatchStatus {
  Cancelled = 'CANCELLED',
  Disputed = 'DISPUTED',
  Draft = 'DRAFT',
  Live = 'LIVE',
  Open = 'OPEN',
  ResultPending = 'RESULT_PENDING',
  Settled = 'SETTLED'
}

export type Mutation = {
  __typename?: 'Mutation';
  createLobby: Lobby;
  createMatch: Match;
  createUser: User;
  joinLobby: Lobby;
  signIn: AuthPayload;
  signUp: AuthPayload;
  submitMatchResult: Match;
};


export type MutationCreateLobbyArgs = {
  input: CreateLobbyInput;
};


export type MutationCreateMatchArgs = {
  input: CreateMatchInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationJoinLobbyArgs = {
  input: JoinLobbyInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSubmitMatchResultArgs = {
  input: SubmitMatchResultInput;
};

export type Query = {
  __typename?: 'Query';
  lobbies: Array<Lobby>;
  match: Match;
  matches: Array<Match>;
  user?: Maybe<User>;
  userByEmail?: Maybe<User>;
  walletBalance: WalletBalance;
};


export type QueryMatchArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type SubmitMatchResultInput = {
  matchId: Scalars['ID']['input'];
  resultEvidence: Scalars['String']['input'];
  winnerTeamSide: TeamSide;
};

export enum TeamSide {
  A = 'A',
  B = 'B'
}

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mmr: Scalars['Int']['output'];
  region: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type WalletBalance = {
  __typename?: 'WalletBalance';
  availableCents: Scalars['Int']['output'];
  currency: Scalars['String']['output'];
  escrowedCents: Scalars['Int']['output'];
};

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'User', id: string, email: string, username: string } } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'User', id: string, email: string, username: string } } };


export const SignUpDocument = gql`
    mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    accessToken
    user {
      id
      email
      username
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    accessToken
    user {
      id
      email
      username
    }
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;