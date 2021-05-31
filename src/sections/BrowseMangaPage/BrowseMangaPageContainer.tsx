import { CircularProgress } from "@material-ui/core";
import { Page, TitledSection } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { useSearchMangaList } from "helpers";
import useBrowseSearchFields from "helpers/useBrowseSearchFields";
import { useEffect } from "react";
import { BrowseSearchFields } from "./BrowseSearchFields";

export default function BrowseMangaPageContainer() {
  const { mangaList, loading, searchManga } = useSearchMangaList({
    limit: 100,
  });

  const { searchState, setSearchState, debouncedSearchState } =
    useBrowseSearchFields();

  const searchResultsMarkup = (
    <span>
      Search results{" "}
      {loading ? (
        <CircularProgress size={15} style={{ marginLeft: 8 }} />
      ) : mangaList.total ? (
        `(${mangaList.total})`
      ) : null}
    </span>
  );

  useEffect(() => {
    searchManga(debouncedSearchState);
  }, [searchManga, debouncedSearchState]);

  return (
    <Page title="Browse all manga">
      <BrowseSearchFields
        searchOptions={searchState}
        onChange={setSearchState}
      />
      <TitledSection title={searchResultsMarkup} />
      <MangaCustomGrid mangasInfo={mangaList.results || []} />
    </Page>
  );
}
