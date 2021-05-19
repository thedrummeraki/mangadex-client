import { Grid } from "@material-ui/core";
import { Page } from "components";
import { useEffect, useState } from "react";
import { ContentRating, SearchState } from "types";
import { useDebouncedValue, useQueryParam } from "utils";
import { BrowseMangaContainer } from "./BrowseMangaContainer";

export default function BrowseMangaPageContainer() {
  const defaultSearchState = useDefaultSearchState();

  const [searchState, setSearchState] =
    useState<SearchState>(defaultSearchState);
  const debouncedSearchState = useDebouncedValue(searchState, 500);

  useEffect(() => {
    console.log("search state", debouncedSearchState);
  }, [debouncedSearchState]);

  return (
    <Page backUrl="/" title="Browse all manga">
      <BrowseMangaContainer
        searchOptions={debouncedSearchState}
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
