import { gql, useQuery } from "@apollo/client";
import { defaultPagedResults, Manga, PagedResultsList } from "types";

const query = gql`
  query GetMangaList($limit: Integer!, $offset: Integer!) {
    mangaList(limit: $limit, offset: $offset)
      @rest(type: "MangaResults", path: "/manga?{args}") {
      results
      limit
      offset
      total
    }
  }
`;

interface BasicOptions {
  offset?: number;
  pageSize?: number;
}

interface MandatoryOptions {
  limit: number;
}

interface InternalOptions {
  sliceAt?: number | null;
  allowCache?: boolean;
}

type Options = MandatoryOptions & InternalOptions & BasicOptions;

export default function useMangaList({
  limit,
  offset = 0,
  pageSize = 10,
  sliceAt = null,
  allowCache = true,
}: Options) {
  const result = useQuery(query, {
    variables: { limit, offset },
    context: {
      headers: {
        "X-Allow-Cache": allowCache ? "true" : "false",
      },
    },
  });

  const { data, loading, error, fetchMore } = result;

  const mangaList =
    (data?.mangaList as PagedResultsList<Manga>) ||
    defaultPagedResults<Manga>();

  const fetchMoreManga = async (options?: { limit?: number }) => {
    if (!mangaList?.results || loading || error || sliceAt != null) {
      return;
    }

    const fetchMoreLimit = options?.limit || limit;

    if (mangaList.total > mangaList.results.length) {
      await fetchMore({
        variables: {
          limit: fetchMoreLimit,
          offset: mangaList.offset + pageSize,
        },
      });
    }
  };

  return {
    ...result,
    mangaList: {
      ...mangaList,
      results:
        sliceAt != null ? mangaList.results.slice(sliceAt) : mangaList.results,
    },
    fetchMoreManga,
  };
}
