import { Button, Grid } from "@material-ui/core";
import { Page } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import useMangaList from "helpers/useMangaList";
import { useScrollListeners } from "utils";

export function HomePage() {
  const { mangaList, data, loading, error, fetchMoreManga } = useMangaList({
    limit: 18,
    offset: 0,
    pageSize: 18,
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
      title="Latest manga"
      primaryAction={
        <Button size="small" color="secondary" variant="contained">
          Upload
        </Button>
      }
    >
      <Grid container spacing={2}>
        {mangaList.results.map((mangaResult) => (
          <Grid key={mangaResult.data.id} item xs={6} sm={4} md={3} lg={2}>
            <MangaThumbnail manga={mangaResult.data} />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}
