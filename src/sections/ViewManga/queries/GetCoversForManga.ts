import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Cover, PagedResultsList } from "types";

export default gql`
  query GetCoversForManga(
    $ids: [String!]
    $mangaIds: [String!]
    $limit: Int!
    $offset: Int
  ) {
    covers(ids: $ids, manga: $mangaIds, limit: $limit, offset: $offset)
      @rest(type: "Cover", path: "/cover?{args}") {
      results
      limit
      offset
      total
    }
  }
` as TypedDocumentNode<
  { covers: PagedResultsList<Cover> },
  { ids?: string[]; mangaIds?: string[]; limit: number; offset?: number }
>;
