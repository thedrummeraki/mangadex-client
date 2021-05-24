import { CircularProgress, Container } from "@material-ui/core";
import { CustomGrid, Page, TitledSection } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { MangaThumbnail } from "components/Thumbnails";
import { useSearchMangaList } from "helpers";
import { useEffect, useState } from "react";
import {
  ContentRating,
  MangaStatus,
  PublicationDemographic,
  SearchState,
} from "types";
import {
  noEmptyString,
  useDebouncedValue,
  useQueryParam,
  useScrollListeners,
} from "utils";
import { BrowseSearchFieldsPreview } from "./BrowerSearchFieldsPreview";
import { BrowseSearchFields } from "./BrowseSearchFields";

export default function BrowseMangaPageContainer() {
  const defaultSearchState = useDefaultSearchState();
  const { mangaList, data, loading, searchManga /*, fetchMoreManga*/ } =
    useSearchMangaList({ limit: 100 });

  const totalCount = data?.mangaSearchList?.total || 0;
  const actualCount = mangaList.results?.length || 0;
  const countText =
    totalCount > actualCount
      ? `showing up to ${actualCount} results`
      : totalCount === 1
      ? "1 result"
      : `${totalCount} results`;
  const searchResultsMarkup = (
    <span>
      Search results{" "}
      {loading ? (
        <CircularProgress size={18} style={{ marginLeft: 8 }} />
      ) : (
        `(${countText})`
      )}
    </span>
  );

  const [searchState, setSearchState] =
    useState<SearchState>(defaultSearchState);
  const debouncedSearchState = useDebouncedValue(searchState, 500);

  useEffect(() => {
    searchManga(debouncedSearchState);
  }, [searchManga, debouncedSearchState]);

  useScrollListeners(null, () => {
    // TODO: fix cache to enable pagination.
    // fetchMoreManga();
  });

  return (
    <Page backUrl="/" title="Browse all manga">
      <Container>
        <BrowseSearchFields
          searchOptions={searchState}
          onChange={setSearchState}
        />
      </Container>
      <Container>
        <BrowseSearchFieldsPreview searchOptions={searchState} />
      </Container>
      <Container>
        <TitledSection title={searchResultsMarkup} />
        <MangaCustomGrid mangasInfo={mangaList.results || []} />
      </Container>
    </Page>
  );
}

function useDefaultSearchState() {
  const title = useQueryParam("title", "");
  const contentRating = useTypedQueryParams("contentRating", [
    ContentRating.safe,
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
