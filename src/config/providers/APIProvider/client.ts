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

const link = authLink.concat(new RestLink({ uri: "http://localhost:3001" }));

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
  link,
});

export default client;
