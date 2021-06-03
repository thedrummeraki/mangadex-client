import { makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { CustomGrid, Page } from "components";
import { MangaCategory } from "components/MangaCategory";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { ThumbnailSkeleton } from "components/Thumbnail/ThumbnailSkeleton";
import { useAuth } from "config/providers";
import { useSearchMangaList } from "helpers";
import useBrowseSearchFields from "helpers/useBrowseSearchFields";
import usePagination from "helpers/usePagination";
import { useEffect, useMemo } from "react";
import { BrowseSearchFields } from "sections/BrowseMangaPage/BrowseSearchFields";
import { ContentRating, MangaStatus, PublicationDemographic } from "types";
import { repeat, useQueryParam } from "utils";

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
    scrollToTopOnPageChange: true,
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
        currentUser
          ? `Welcome, ${currentUser.attributes.username}.`
          : `Hottest manga`
      }
    >
      <MangaCategory
        title="Top ongoing manga"
        url="/top/ongoing"
        searchOptions={{ status: [MangaStatus.ongoing] }}
      />

      <MangaCategory
        title="Top complete manga"
        url="/top/complete"
        searchOptions={{ status: [MangaStatus.completed] }}
      />

      <MangaCategory
        title="Top shounen manga"
        url="/top/shounen"
        searchOptions={{
          publicationDemographic: [PublicationDemographic.shonen],
        }}
      />
    </Page>
  );
}
