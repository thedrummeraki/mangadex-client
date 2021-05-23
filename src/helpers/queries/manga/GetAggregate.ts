import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Aggregate } from "types";

export default gql`
  query GetAggregateQuery($mangaId: String!) {
    aggregate(manga: $mangaId)
      @rest(type: "Aggregate", path: "/manga/{args.manga}/aggregate") {
      result
      volumes
    }
  }
` as TypedDocumentNode<{ aggregate: Aggregate }, { mangaId: string }>;
