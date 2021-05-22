import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Chapter, Order, PagedResultsList } from "types";

const query = gql`
  query GetMangaFeed(
    $mangaId: String!
    $orderChapter: String!
    $orderVolume: String!
  ) {
    chapters(
      manga: $mangaId
      limit: 100
      orderChapter: $orderChapter
      orderVolume: $orderVolume
    )
      @rest(
        type: "Chapter"
        path: "/manga/{args.manga}/feed?limit={args.limit}&order[chapter]={args.orderChapter}&order[volume]={args.orderVolume}"
      ) {
      limit
      offset
      total
      results {
        result
        relationships
        data
      }
    }
  }
`;

export default query as TypedDocumentNode<
  { chapters: PagedResultsList<Chapter> },
  { mangaId: string } & Required<Order<"orderChapter" | "orderVolume">>
>;
