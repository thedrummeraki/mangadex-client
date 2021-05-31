import { useState } from "react";
import {
  ContentRating,
  MangaStatus,
  PublicationDemographic,
  SearchState,
} from "types";
import { noEmptyString, useDebouncedValue, useQueryParam } from "utils";

interface Options {
  searchState?: Partial<SearchState>;
}

export default function useBrowseSearchFields(options: Options = {}) {
  const defaultSearchState = useDefaultSearchState();
  const [searchState, setSearchState] = useState<SearchState>({
    ...defaultSearchState,
    ...options.searchState,
  });
  const debouncedSearchState = useDebouncedValue(searchState, 500);

  return { searchState, setSearchState, debouncedSearchState };
}

function useDefaultSearchState() {
  const title = useQueryParam("title", "");
  const contentRating = useTypedQueryParams("contentRating", [
    ContentRating.safe,
    ContentRating.suggestive,
    ContentRating.erotica,
  ]);

  const status = useTypedQueryParams<MangaStatus>("status");
  const publicationDemographic = useTypedQueryParams<PublicationDemographic>(
    "publicationDemographic"
  );

  const defaultSearchState: SearchState = {
    artists: [],
    authors: [],
    createdAtSince: "",
    excludedTags: [],
    excludedTagsMode: [],
    includedTags: [],
    includedTagsMode: [],
    order: {},
    originalLanguage: [],
    publicationDemographic,
    status,
    updatedAtSince: "",
    year: null,
    contentRating,
    title: decodeURIComponent(title),
  };

  return defaultSearchState;
}

function useTypedQueryParams<T>(key: string, defaultValue: T[] = []) {
  const typedData: T[] = useQueryParam(key, "")
    .split(",")
    .map((param) => param.trim())
    .filter(noEmptyString)
    .map((param) => param as unknown as T);

  return typedData.length > 0 ? typedData : defaultValue;
}
