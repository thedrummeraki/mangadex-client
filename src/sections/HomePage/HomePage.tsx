import { makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Page } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { useAuth } from "config/providers";
import { useSearchMangaList } from "helpers";
import useBrowseSearchFields from "helpers/useBrowseSearchFields";
import usePagination from "helpers/usePagination";
import { useEffect, useMemo } from "react";
import { BrowseSearchFields } from "sections/BrowseMangaPage/BrowseSearchFields";
import { useQueryParam } from "utils";

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    display: "flex",
    width: "100%",
    margin: theme.spacing(2),
    justifyContent: "center",
  },
}));

export function HomePage() {
  const classes = useStyles();
  const firstPage = useQueryParam("page");
  const { currentUser } = useAuth();
  const { limit, offset, page, setPage, getPagesCount } = usePagination({
    pageSize: 100,
    firstPage: firstPage ? parseInt(firstPage) : 1,
  });
  const { mangaList, loading, error, searchManga } = useSearchMangaList({
    limit,
    offset,
  });
  const { searchState, setSearchState, debouncedSearchState } =
    useBrowseSearchFields();

  const pagesCount = useMemo(
    () => getPagesCount(mangaList.total),
    [getPagesCount, mangaList]
  );

  useEffect(() => {
    searchManga(debouncedSearchState);
  }, [searchManga, debouncedSearchState]);

  if (error) {
    return <p>error</p>;
  }

  return (
    <Page
      title={
        loading
          ? "Please wait..."
          : currentUser
          ? `Welcome, ${currentUser.attributes.username}.`
          : `Hottest manga`
      }
    >
      <BrowseSearchFields
        searchOptions={searchState}
        onChange={setSearchState}
      />
      <MangaCustomGrid mangasInfo={mangaList.results || []} />
      {pagesCount > 1 && (
        <div className={classes.paginationRoot}>
          <Pagination
            disabled={loading}
            count={pagesCount}
            page={page}
            onChange={(_, number) => setPage(number)}
          />
        </div>
      )}
    </Page>
  );
}
