import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Cover, PagedResultsList } from "types";

export default gql`
  query GetCoversForManga($mangaId: String!, $limit: Int!, $offset: Int) {
    covers(manga: $mangaId, limit: $limit, offset: $offset)
      @rest(type: "Cover", path: "/cover?{args}") {
      results
      limit
      offset
      total
    }
  }
` as TypedDocumentNode<PagedResultsList<Cover>>;
