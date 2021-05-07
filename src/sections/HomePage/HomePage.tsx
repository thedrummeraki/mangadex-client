import { gql, useQuery } from "@apollo/client";
import { Container, Grid, Typography } from "@material-ui/core";
import MangaCard from "components/MangaCard";
import { Manga, PagedResultsList } from "types";

const query = gql`
  query GetMangaList($limit: Integer!) {
    manga(limit: $limit) @rest(type: "Manga", path: "/manga?{args}") {
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

  if (loading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>erorr</p>;
  }

  if (!data) {
    return null;
  }

  const mangaList = data.manga as PagedResultsList<Manga>;

  return (
    <Container>
      <Grid container spacing={2}>
        {mangaList.results.map((mangaResult) => (
          <Grid
            key={mangaResult.data.id}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <MangaCard manga={mangaResult.data} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
