import { Page } from "components";
import { useSearchMangaList } from "helpers";
import { useEffect, useState } from "react";
import { ContentRating, SearchState } from "types";
import { useDebouncedValue, useQueryParam } from "utils";
import { BrowseSearchFields } from "./BrowseSearchFields";

export default function BrowseMangaPageContainer() {
  const defaultSearchState = useDefaultSearchState();
  const { searchManga } = useSearchMangaList({ limit: 10 });

  const [searchState, setSearchState] =
    useState<SearchState>(defaultSearchState);
  const debouncedSearchState = useDebouncedValue(searchState, 500);

  useEffect(() => {
    searchManga(debouncedSearchState);
  }, [debouncedSearchState]);

  return (
    <Page backUrl="/" title="Browse all manga">
      <BrowseSearchFields
        searchOptions={searchState}
        onChange={setSearchState}
      />
    </Page>
  );
}

function useDefaultSearchState() {
  const title = useQueryParam("title", "nagatoro");

  const defaultSearchState: SearchState = {
    artists: [],
    authors: [],
    createdAtSince: "",
    excludedTags: [],
    excludedTagsMode: [],
    includedTags: [],
    includedTagsMode: [],
    order: { createdAt: "desc" },
    originalLanguage: [],
    publicationDemographic: [],
    status: [],
    updatedAtSince: "",
    year: null,
    contentRating: [ContentRating.safe],
    title,
  };

  return defaultSearchState;
}
