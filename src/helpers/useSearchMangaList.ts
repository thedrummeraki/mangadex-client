import { gql, useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import {
  defaultPagedResults,
  Manga,
  PagedResultsList,
  SearchState,
} from "types";
import { filterObject } from "utils";

const query = gql`
  query GetMangaList(
    $limit: Integer!
    $offset: Integer!
    $title: String
    $authors: [String!]
    $artists: [String!]
    $year: Integer
    $includedTags: [String!]
    $includedTagsMode: String
    $excludedTags: [String!]
    $excludedTagsMode: String
    $status: [String!]
    $originalLanguage: [String!]
    $publicationDemographic: [String!]
    $ids: [String!]
    $contentRating: [String!]
    $createdAtSince: String
    $updatedAtSince: String
  ) {
    mangaSearchList(
      limit: $limit
      offset: $offset
      title: $title
      authors: $authors
      artists: $artists
      year: $year
      includedTags: $includedTags
      includedTagsMode: $includedTagsMode
      excludedTags: $excludedTags
      excludedTagsMode: $excludedTagsMode
      status: $status
      originalLanguage: $originalLanguage
      publicationDemographic: $publicationDemographic
      ids: $ids
      contentRating: $contentRating
      createdAtSince: $createdAtSince
      updatedAtSince: $updatedAtSince
    ) @rest(type: "MangaResults", path: "/manga?{args}") {
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
  allowCache?: boolean;
}

type SearchOptions = Partial<SearchState>;

type Options = MandatoryOptions &
  InternalOptions &
  BasicOptions &
  SearchOptions;

export default function useSearchMangaList({
  limit,
  offset = 0,
  pageSize = 10,
  allowCache = true,
}: Options) {
  const [callback, result] = useLazyQuery(query, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        "X-Allow-Cache": allowCache ? "true" : "false",
      },
    },
  });

  const searchManga = useCallback(
    (options: SearchOptions) => {
      const filteredOptions = filterObject(options);

      callback({
        variables: {
          limit,
          offset,
          ...filteredOptions,
        },
      });
    },
    [limit, offset, callback]
  );

  const { data, loading, error, fetchMore } = result;

  const mangaList =
    (data?.mangaSearchList as PagedResultsList<Manga>) ||
    defaultPagedResults<Manga>();

  const fetchMoreManga = async (options?: { limit?: number }) => {
    if (!mangaList || loading || error || !fetchMore) {
      return;
    }

    const limit = options?.limit;

    if (mangaList?.results && mangaList?.total > mangaList?.results.length) {
      await fetchMore({
        variables: {
          limit,
          offset: mangaList.offset + pageSize,
        },
      });
    }
  };

  return {
    ...result,
    mangaList,
    searchManga,
    fetchMoreManga,
  };
}
