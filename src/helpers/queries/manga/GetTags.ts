import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { GenericResponse, MangaTag } from "types";

export default gql`
  query GetTags {
    tags @rest(type: "Tag", path: "/manga/tag") {
      result
      data
      relationships
    }
  }
` as TypedDocumentNode<{ tags: GenericResponse<MangaTag>[] }>;
