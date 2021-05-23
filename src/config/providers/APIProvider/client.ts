import { ApolloClient, InMemoryCache } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { setContext } from "@apollo/client/link/context";
import { mangadexOffsetLimitPagination } from "./utilities";
import { getToken } from "../AuthProvider";

const authLink = setContext((_, { headers }) => {
  const token = getToken()?.session || "";

  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const link = authLink.concat(
  new RestLink({ uri: "https://mangadex-client-proxy.herokuapp.com" })
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        keyFields: [],
        fields: {
          mangaList: mangadexOffsetLimitPagination(),
          mangaSearchList: mangadexOffsetLimitPagination(),
          followsList: mangadexOffsetLimitPagination(),
        },
      },
    },
  }),
  link,
});

export default client;
