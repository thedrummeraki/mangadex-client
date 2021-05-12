import { Button, Grid, TextField } from "@material-ui/core";
import { Page } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import useMangaList from "helpers/useMangaList";
import { useScrollListeners } from "utils";

export function AllMangaPage() {
  const { mangaList, data, loading, error, fetchMoreManga } = useMangaList({
    limit: 20,
    pageSize: 20,
    allowCache: true,
  });

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
      maxWitdh={false}
      title="All manga"
      primaryAction={
        <Button size="small" color="secondary" variant="contained">
          Upload
        </Button>
      }
    >
      <div
        style={{
          display: "grid",
          gap: "28px 30px",
          gridTemplateColumns: "repeat(auto-fill, 185px)",
          justifyContent: "space-between",
        }}
      >
        {mangaList.results.map((mangaResult) => (
          <MangaThumbnail
            chaptersCount={
              mangaResult.relationships.filter(
                (relationship) => relationship.type === "chapter"
              ).length
            }
            manga={mangaResult.data}
          />
        ))}
      </div>
    </Page>
  );
}
