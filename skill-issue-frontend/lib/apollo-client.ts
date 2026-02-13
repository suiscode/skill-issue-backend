import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

const endpoint =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql"

export const apolloClient = new ApolloClient({
  link: from([
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
