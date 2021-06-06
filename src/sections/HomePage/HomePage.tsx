import { CustomGrid, Page, Thumbnail } from "components";
import { MangaCategory } from "components/MangaCategory";
import { MangaThumbnail } from "components/Thumbnails";
import { useAuth } from "config/providers";
import { useGetHomePageQuery } from "generated/graphql";
import { useSearchMangaList } from "helpers";
import useBrowseSearchFields from "helpers/useBrowseSearchFields";
import usePagination from "helpers/usePagination";
import { useEffect } from "react";
import { MangaStatus, PublicationDemographic } from "types";
import { useQueryParam } from "utils";

export function HomePage() {
  const firstPage = useQueryParam("page");
  const { currentUser } = useAuth();

  const { data, error, loading, fetchMore } = useGetHomePageQuery({
    variables: { limit: 100, offset: 0 },
  });

  if (error) {
    return <p>error</p>;
  }

  const mangas = data?.mangas || [];

  return (
    <Page
      title={
        currentUser
          ? `Welcome, ${currentUser.attributes.username}.`
          : `Hottest manga`
      }
      onScrolledToBottom={() => {
        if (loading) {
          return;
        }

        fetchMore({ variables: { offset: mangas.length } });
      }}
    >
      <CustomGrid>
        {mangas.map((manga) => (
          <Thumbnail
            key={manga.id}
            features={[manga.attributes.status]}
            title={manga.attributes.title.en}
            img={manga.covers ? manga.covers[0].url : "#"}
            url={`/manga/${manga.id}`}
          />
        ))}
      </CustomGrid>
    </Page>
  );
}
