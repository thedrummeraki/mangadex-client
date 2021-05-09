import { gql, useQuery } from "@apollo/client";
import { Button, Grid } from "@material-ui/core";
import { Page } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import { Manga, PagedResultsList } from "types";

const query = gql`
  query GetMangaList($limit: Integer!) {
    manga(limit: $limit)
      @rest(type: "Manga", path: "/manga?{args}&contentRating[]=safe") {
      results
    }
  }
`;

export function HomePage() {
  const { data, loading, error } = useQuery(query, {
    variables: { limit: 50 },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
    },
  });

  if (error) {
    return <p>error</p>;
  }

  if (loading || !data) {
    return null;
  }

  const mangaList = data.manga as PagedResultsList<Manga>;

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
