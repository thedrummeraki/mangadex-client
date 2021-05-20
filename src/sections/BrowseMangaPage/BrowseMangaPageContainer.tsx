import { Container } from "@material-ui/core";
import { CustomGrid, Page } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import { useSearchMangaList } from "helpers";
import { useEffect, useState } from "react";
import {
  ContentRating,
  GenericResponse,
  Manga,
  MangaStatus,
  SearchState,
} from "types";
import { useDebouncedValue, useQueryParam } from "utils";
import { BrowseSearchFieldsPreview } from "./BrowerSearchFieldsPreview";
import { BrowseSearchFields } from "./BrowseSearchFields";

export default function BrowseMangaPageContainer() {
  const defaultSearchState = useDefaultSearchState();
  const { mangaList, loading, searchManga } = useSearchMangaList({ limit: 10 });
  const [results, setResults] = useState<GenericResponse<Manga>[]>([]);

  const [searchState, setSearchState] =
    useState<SearchState>(defaultSearchState);
  const debouncedSearchState = useDebouncedValue(searchState, 500);

  useEffect(() => {
    searchManga(debouncedSearchState);
  }, [debouncedSearchState]);

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
        <CustomGrid>
          {mangaList.results != null &&
            mangaList.results.map((mangaResponse) => (
              <MangaThumbnail showContentRating manga={mangaResponse.data} />
            ))}
        </CustomGrid>
      </Container>
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
    order: {},
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
