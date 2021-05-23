import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Chapter, Order, PagedResultsList } from "types";

const query = gql`
  query GetChaptersForManga(
    $mangaId: String!
    $orderChapter: String!
    $orderVolume: String!
    $volume: String
  ) {
    chapters(
      manga: $mangaId
      limit: 100
      volume: $volume
      order: { chapter: $orderChapter, volume: $orderVolume }
    ) @rest(type: "Chapter", path: "/chapter?{args}") {
      limit
      offset
      total
      results {
        result
        relationships
        data {
          id
          type
          attributes {
            title
            volume
            chapter
            translatedLanguage
            hash
            data
            dataSaver
            uploader
            version
            createdAt
            updatedAt
            publishAt
          }
        }
      }
    }
  }
`;

export default query as TypedDocumentNode<
  { chapters: PagedResultsList<Chapter> },
  { mangaId: string; volume?: string | null } & Order<
    "orderChapter" | "orderVolume"
  >
>;
