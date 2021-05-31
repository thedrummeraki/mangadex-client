import { makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { Page } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { useSearchMangaList } from "helpers";
import useBrowseSearchFields from "helpers/useBrowseSearchFields";
import usePagination from "helpers/usePagination";
import { useEffect, useMemo } from "react";
import { BrowseSearchFields } from "sections/BrowseMangaPage/BrowseSearchFields";
import { GenericResponse } from "types";
import { Author } from "types/authors";

interface Props {
  author: GenericResponse<Author>;
  asArtist?: boolean;
}

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    display: "flex",
    width: "100%",
    margin: theme.spacing(2),
    justifyContent: "center",
  },
}));

export function ByAuthorPage({ author, asArtist }: Props) {
  const classes = useStyles();

  const { limit, offset, page, setPage, getPagesCount } = usePagination({
    pageSize: 20,
  });
  const { mangaList, loading, searchManga } = useSearchMangaList({
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
    const options = asArtist
      ? { artists: [author.data.id] }
      : { authors: [author.data.id] };
    searchManga({ ...debouncedSearchState, ...options });
  }, [page, author, asArtist, debouncedSearchState, searchManga]);

  return (
    <Page backUrl="/" title={author.data.attributes.name}>
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
