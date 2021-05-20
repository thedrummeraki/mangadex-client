import { Button } from "@material-ui/core";
import { Page, CustomGrid } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import { useAuth } from "config/providers";
import useMangaList from "helpers/useMangaList";
import { useScrollListeners } from "utils";

export function HomePage() {
  const { mangaList, data, loading, error, fetchMoreManga } = useMangaList({
    limit: 20,
    pageSize: 20,
    allowCache: true,
  });

  const { currentUser } = useAuth();

  useScrollListeners(null, () => {
    fetchMoreManga();
  });

  if (error) {
    return <p>error</p>;
  }

  if (loading || !data) {
    return null;
  }

  return (
    <Page
      title={
        currentUser
          ? `Welcome, ${currentUser.attributes.username}.`
          : `Latest manga`
      }
      primaryAction={
        currentUser && (
          <Button size="small" color="secondary" variant="contained">
            Upload
          </Button>
        )
      }
    >
      <CustomGrid>
        {mangaList.results.map((mangaResult) => (
          <MangaThumbnail
            key={mangaResult.data.id}
            chaptersCount={
              mangaResult.relationships.filter(
                (relationship) => relationship.type === "chapter"
              ).length
            }
            manga={mangaResult.data}
          />
        ))}
      </CustomGrid>
    </Page>
  );
}
