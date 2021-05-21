import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import GetAuthorsQuery, { Variables } from "./queries/authors/GetAuthors";

export default function useSearchAuthors({ limit }: Pick<Variables, "limit">) {
  const [callback, result] = useLazyQuery(GetAuthorsQuery, {
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
