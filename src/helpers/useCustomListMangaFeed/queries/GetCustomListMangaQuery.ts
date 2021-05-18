import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Chapter, Order, PagedResultsList } from "types";

export interface GetCustomListMangaVariables {
  id: string;
  limit: number;
  offset: number;
  locales?: string[];
  createdAtSince?: string;
  updatedAtSince?: string;
  publishAtSince?: string;
  order?: Order<"chapter" | "volume">;
}

const query = gql`
  query GetCustomListManga(
    $id: String!
    $limit: Integer!
    $offset: Integer!
    $locales: [String!]
    $createdAtSince: String
    $updatedAtSince: String
    $publishAtSince: String
    $order: { chapter: String, volume: String }
  ) {
    customListManga @rest(type: "Chapter", path: "/list/{args.id}/feed?{args}") {
      limit
      offset
      total
      results
    }
  }
`;

export default query as TypedDocumentNode<
  { customListManga: PagedResultsList<Chapter> },
  GetCustomListMangaVariables
>;
