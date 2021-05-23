import { Container, Grid } from "@material-ui/core";
import JumpToMangaSearchField from "./JumpToMangaSearchField";

export function CustomAppBar() {
  return (
    <Container maxWidth={false}>
      <Grid container alignItems="flex-start">
        <Grid item style={{ flex: 1 }}>
          <JumpToMangaSearchField />
        </Grid>
      </Grid>
    </Container>
  );
}
