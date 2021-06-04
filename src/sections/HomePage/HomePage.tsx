import { Page } from "components";
import { MangaCategory } from "components/MangaCategory";
import { useAuth } from "config/providers";
import { useSearchMangaList } from "helpers";
import useBrowseSearchFields from "helpers/useBrowseSearchFields";
import usePagination from "helpers/usePagination";
import { useEffect } from "react";
import { MangaStatus, PublicationDemographic } from "types";
import { useQueryParam } from "utils";

export function HomePage() {
  const firstPage = useQueryParam("page");
  const { currentUser } = useAuth();
  const { limit, offset } = usePagination({
    pageSize: 100,
    firstPage: firstPage ? parseInt(firstPage) : 1,
    scrollToTopOnPageChange: true,
  });
  const { error, searchManga } = useSearchMangaList({
    limit,
    offset,
  });
  const { debouncedSearchState } = useBrowseSearchFields();

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
