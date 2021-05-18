import { TypedDocumentNode } from "@apollo/client";
import gql from "graphql-tag";
import { Chapter, PagedResultsList } from "types";

const query = gql`
  query GetFollowListsQuery($limit: Integer!, $offset: Integer) {
    followsList(limit: $limit, offset: $offset)
      @rest(type: "Chapter", path: "/user/follows/manga/feed?{args}") {
      limit
      offset
      total
      results
    }
  }
`;

export default query as TypedDocumentNode<
  { followsList: PagedResultsList<Chapter> },
  { limit: number; offset?: number }
>;
