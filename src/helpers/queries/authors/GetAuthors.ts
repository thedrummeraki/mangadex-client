import { gql, TypedDocumentNode } from "@apollo/client";
import { Order, PagedResultsList } from "types";
import { Author } from "types/authors";

export interface Variables {
  limit: number;
  offset?: number;
  ids?: string[];
  name?: string;
  order?: Order<"name">;
}

export default gql`
  query GetAuthors(
    $limit: Integer!
    $offset: Integer
    $ids: [String!]
    $name: String
  ) {
    authors(limit: $limit, offset: $offset, ids: $ids, name: $name)
      @rest(type: "Author", path: "/author?{args}") {
      limit
      offset
      total
      results

      result
      errors {
        id
        status
        title
        detail
      }
    }
  }
` as TypedDocumentNode<{ authors: PagedResultsList<Author> }, Variables>;
