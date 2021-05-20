import { TypedDocumentNode, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback } from "react";
import { Order, PagedResultsList } from "types";
import { Author } from "types/authors";

interface Variables {
  limit: number;
  offset?: number;
  ids?: string[];
  name?: string;
  order?: Order<"name">;
}

export default function useAuthors({ limit }: Pick<Variables, "limit">) {
  const [callback, result] = useLazyQuery(Query, {
    variables: { limit },
  });
  const authors = result.data?.authors?.results || [];

  const searchAuthors = useCallback(
    ({ limit: localLimit, offset, ids, name, order }: Partial<Variables>) => {
      callback({
        variables: {
          limit: localLimit || limit,
          offset,
          ids,
          name,
          order: order || { name: "asc" },
        },
      });
    },
    [callback, limit]
  );

  return { ...result, authors, searchAuthors };
}

const Query: TypedDocumentNode<
  { authors: PagedResultsList<Author> },
  Variables
> = gql`
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
`;
