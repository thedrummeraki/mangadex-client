import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { setContext } from "@apollo/client/link/context";
import { mangadexOffsetLimitPagination } from "./utilities";
import { getToken } from "../AuthProvider";
import { offsetLimitPagination } from "@apollo/client/utilities";

const authLink = setContext((_, { headers }) => {
  const token = getToken()?.session || "";

  return {
    headers: {
      ...headers,
      authorization: token,
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
          mangas: offsetLimitPagination(),
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
