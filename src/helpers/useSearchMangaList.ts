import { gql, useLazyQuery } from "@apollo/client";
import { DateTime } from "luxon";
import { useCallback } from "react";
import {
  ContentRating,
  defaultPagedResults,
  Manga,
  MangaStatus,
  PagedResultsList,
  PublicationDemographic,
} from "types";

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
    $mangaIds: [String!]
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
      mangaIds: $mangaIds
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

enum TagMode {
  AND = "AND",
  OR = "OR",
}

interface SearchOptions {
  title?: string;
  year?: number;
  includedTagsMode?: Array<TagMode>;
  excludedTagsMore?: Array<TagMode>;
  status?: Array<MangaStatus>;
  originalLanguage?: Array<string>;
  publicationDemographic?: Array<PublicationDemographic>;
  ids?: Array<string>;
  contentRating?: Array<ContentRating>;
  createdAtSince?: DateTime;
  updatedAtSince?: DateTime;
  // order?: { createdAt?: OrderDirection; updatedAt?: OrderDirection };
  // // TODO: implement author type
  // authors?: Array<any>;
  // // TODO: implement artist type
  // artists?: Array<any>;
  // // TODO: implement tag type
  // includedTags?: Array<any>;
  // excludedTags?: Array<any>;
}

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

type Options = MandatoryOptions & InternalOptions & BasicOptions;

export default function useSearchMangaList({
  limit,
  offset = 0,
  pageSize = 10,
  allowCache = true,
}: Options) {
  const [callback, result] = useLazyQuery(query, {
    fetchPolicy: "cache-and-network",
    context: {
      headers: {
        "X-Allow-Cache": allowCache ? "true" : "false",
      },
    },
  });

  const searchManga = useCallback(
    (options: SearchOptions) => {
      const filteredOptions = Object.fromEntries(
        Object.entries(options).filter(([_, v]) => {
          return v != null && ((Array.isArray(v) && v.length > 0) || v !== "");
        })
      );

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
