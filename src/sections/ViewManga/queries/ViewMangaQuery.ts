import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { GenericResponse, Manga } from "types";

const query = gql`
  query GetMangaById($id: String!) {
    manga(id: $id) @rest(type: "Manga", path: "/manga/{args.id}") {
      result
      data {
        id
        type
        attributes {
          title
          altTitles
          description
          isLocked
          links
          originalLanguage
          lastVolume
          lastChapter
          publicationDemographic
          status
          year
          contentRating
          tags
          version
          createdAt
          updatedAt
        }
      }
      relationships {
        id
        type
      }
    }
  }
`;

export default query as TypedDocumentNode<
  { manga?: GenericResponse<Manga> | null },
  { id: string }
>;
