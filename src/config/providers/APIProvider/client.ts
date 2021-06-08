import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  mangadexOffsetLimitPagination,
  betterOffsetLimitPagination,
} from "./utilities";
import { getToken } from "../AuthProvider";
import { offsetLimitPagination } from "@apollo/client/utilities";

const authLink = setContext((_, { headers }) => {
  const { refresh = "", session = "" } = getToken() || {};

  return {
    headers: {
      ...headers,
      authorization: session,
      "X-Mangadex-Refresh-Token": refresh,
    },
  };
});

const uri = "http://localhost:3001/graphql";

const link = createHttpLink({
  uri,
});

// const link = authLink.concat(
//   new RestLink({ uri: "https://mangadex-client-proxy.herokuapp.com" })
// );

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        keyFields: [],
        fields: {
          mangas: betterOffsetLimitPagination(),
          chapters: offsetLimitPagination(),
          mangaList: mangadexOffsetLimitPagination(),
          mangaSearchList: mangadexOffsetLimitPagination(),
          followsList: mangadexOffsetLimitPagination(),
        },
      },
    },
  }),
  link: authLink.concat(link),
});

export default client;
