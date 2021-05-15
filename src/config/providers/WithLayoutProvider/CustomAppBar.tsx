import { Container, Grid, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { LoginModal } from "components/modals";
import { useState } from "react";
import { useAuth } from "../AuthProvider";
import JumpToMangaSearchField from "./JumpToMangaSearchField";

export function CustomAppBar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <Container maxWidth={false}>
      <Grid container alignItems="flex-start">
        <Grid item style={{ flex: 1 }}>
          <JumpToMangaSearchField />
        </Grid>

        {currentUser ? null : (
          <Grid item>
            <Button
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
              onClick={() => setOpen(true)}
              startIcon={<AccountCircle />}
              size="large"
            >
              Login
            </Button>
          </Grid>
        )}
      </Grid>
      <LoginModal open={open} onClose={() => setOpen(false)} />
    </Container>
  );
}
