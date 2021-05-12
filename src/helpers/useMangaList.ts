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

interface Options {
  limit: number;
  offset?: number;
  pageSize?: number;
  allowCache?: boolean;
}

export default function useMangaList({
  limit,
  offset = 0,
  pageSize = 10,
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
  console.log("data", data);

  const mangaList =
    (data?.mangaList as PagedResultsList<Manga>) ||
    defaultPagedResults<Manga>();

  const fetchMoreManga = async () => {
    if (!mangaList || loading || error) {
      return;
    }

    if (mangaList?.total > mangaList?.results.length) {
      await fetchMore({
        variables: {
          offset: mangaList.offset + pageSize,
        },
      });
    }
  };

  return {
    ...result,
    mangaList,
    fetchMoreManga,
  };
}
