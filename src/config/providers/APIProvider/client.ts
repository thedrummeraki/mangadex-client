import { ApolloClient, FieldPolicy, InMemoryCache } from "@apollo/client";
import { offsetLimitPagination, Reference } from "@apollo/client/utilities";
import { RestLink } from "apollo-link-rest";
import { PagedResultsList } from "types";

const restLink = new RestLink({ uri: "http://localhost:3001" });

type KeyArgs = FieldPolicy<any>["keyArgs"];

function mangadexOffsetLimitPagination<T extends Reference>(
  keyArgs: KeyArgs = false
): FieldPolicy<PagedResultsList<T>> {
  return {
    keyArgs,
    merge(existing, incoming) {
      if (!existing) {
        return incoming;
      }

      return {
        ...incoming,
        results: [...existing.results, ...incoming.results],
      };
    },
  };
}

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          mangaList: mangadexOffsetLimitPagination(),
        },
      },
    },
  }),
  link: restLink,
});

export default client;
