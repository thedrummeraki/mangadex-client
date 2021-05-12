import { ApolloClient, InMemoryCache } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { mangadexOffsetLimitPagination } from "./utilities";

const restLink = new RestLink({ uri: "http://localhost:3001" });

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
