import { Typography } from "@material-ui/core";
import { Page } from "components";
import useAuthors from "helpers/useAuthors";
import { useParams } from "react-router";
import { ByAuthorPage } from "./ByAuthorPage";

export default function ByAuthorPageContainer() {
  const { id } = useParams<{ id: string }>();
  const { authors, loading, error } = useAuthors({ ids: [id], limit: 1 });

  if (error) {
    return (
      <Page title="Uh-oh something went wrong.">
        <Typography>
          We weren't able to get information for this author. Please try again
          later.
        </Typography>
      </Page>
    );
  }

  if (loading) {
    return <Page title="Loading..." />;
  }

  if (authors.length === 0) {
    return (
      <Page title="No author was found...">
        <Typography>
          Hmm, looks like this artist does not exist anymore.
        </Typography>
      </Page>
    );
  }

  return <ByAuthorPage author={authors[0]} />;
}
