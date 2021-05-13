import { Container, Grid, IconButton } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { LoginModal } from "components/modals";
import { useState } from "react";
import JumpToMangaSearchField from "./JumpToMangaSearchField";

export function CustomAppBar() {
  const [open, setOpen] = useState(false);

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
            onClick={() => setOpen(true)}
          >
            <AccountCircle />
          </IconButton>
        </Grid>
      </Grid>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
}
