import { gql, useQuery } from "@apollo/client";
import { Button, Grid } from "@material-ui/core";
import { Page } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import { Manga, PagedResultsList } from "types";
import { useScrollListeners } from "utils";

const query = gql`
  query GetMangaList($limit: Integer!, $offset: Integer!) {
    manga(limit: $limit, offset: $Integer)
      @rest(type: "MangaResults", path: "/manga?{args}") {
      results
      limit
      offset
      total
    }
  }
`;

export function HomePage() {
  const { data, loading, error } = useQuery(query, {
    variables: { limit: 18, offset: 0 },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
    },
  });

  const mangaList = data?.manga as PagedResultsList<Manga>;

  useScrollListeners(null, () => {
    console.log("fetching more...");
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
