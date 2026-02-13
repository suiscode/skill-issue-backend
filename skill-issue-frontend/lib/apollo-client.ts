import { ApolloClient, HttpLink, InMemoryCache, Observable, from } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql"

const refreshSessionMutation = `
  mutation RefreshSession($refreshToken: String!) {
    refreshSession(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        email
        username
      }
    }
  }
`

let refreshTokenPromise: Promise<string | null> | null = null

function clearStoredSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("currentUser")
}

async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null

  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) return null

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: refreshSessionMutation,
      variables: { refreshToken },
    }),
  })

  if (!response.ok) return null

  const body = (await response.json()) as {
    data?: {
      refreshSession?: {
        accessToken: string
        refreshToken: string
        user: {
          id: string
          email: string
          username: string
        }
      }
    }
  }

  const session = body.data?.refreshSession
  if (!session?.accessToken || !session.refreshToken || !session.user) {
    return null
  }

  localStorage.setItem("accessToken", session.accessToken)
  localStorage.setItem("refreshToken", session.refreshToken)
  localStorage.setItem("currentUser", JSON.stringify(session.user))

  return session.accessToken
}

const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  const hasUnauthenticatedError = graphQLErrors?.some(
    (error) => error.extensions?.code === "UNAUTHENTICATED",
  )

  if (!hasUnauthenticatedError || operation.getContext().didRefreshRetry) {
    return
  }

  if (!refreshTokenPromise) {
    refreshTokenPromise = refreshAccessToken().finally(() => {
      refreshTokenPromise = null
    })
  }

  return new Observable((observer) => {
    let subscription:
      | {
          unsubscribe: () => void
        }
      | undefined

    void refreshTokenPromise
      ?.then((newAccessToken) => {
        if (!newAccessToken) {
          clearStoredSession()
          if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
            window.location.href = "/signin"
          }
          observer.error(new Error("UNAUTHENTICATED"))
          return
        }

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
          didRefreshRetry: true,
        }))

        subscription = forward(operation).subscribe({
          next: (value) => observer.next(value),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        })
      })
      .catch((error) => {
        clearStoredSession()
        observer.error(error)
      })

    return () => {
      subscription?.unsubscribe()
    }
  })
})

export const apolloClient = new ApolloClient({
  link: from([
    authErrorLink,
    setContext((_, previousContext) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      return {
        headers: {
          ...previousContext.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    }),
    new HttpLink({
    uri: endpoint,
    }),
  ]),
  cache: new InMemoryCache(),
})
