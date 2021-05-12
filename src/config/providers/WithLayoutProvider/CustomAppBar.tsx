import { Container, Grid, IconButton } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import JumpToMangaSearchField from "./JumpToMangaSearchField";

export function CustomAppBar() {
  return (
    <Container>
      <Grid container alignItems="flex-start">
        <Grid item style={{ flex: 1 }}>
          <JumpToMangaSearchField />
        </Grid>

        <Grid item>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Grid>
      </Grid>
    </Container>
  );
}
