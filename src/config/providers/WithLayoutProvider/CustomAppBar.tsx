import { Container, Grid, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { LoginModal } from "components/modals";
import { useState } from "react";
import JumpToMangaSearchField from "./JumpToMangaSearchField";

export function CustomAppBar() {
  const [open, setOpen] = useState(false);

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
