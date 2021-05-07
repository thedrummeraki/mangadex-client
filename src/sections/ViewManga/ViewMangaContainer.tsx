import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useParams } from "react-router";
import { GenericResponse, Manga } from "types";
import { ViewManga } from "./ViewManga";
import ViewMangaQuery from "./queries/ViewMangaQuery";

export default function ViewMangaContainer() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(ViewMangaQuery, {
    variables: { id },
  });

  const response = data?.manga as GenericResponse<Manga>;

  const errored =
    !data && !loading && (Boolean(error) || response.result === "ko");

  if (errored) {
    return (
      <Page title="Uh oh...">
        <Typography>
          We're sorry, we were not able to get the latest information from
          Mangadex.
        </Typography>
      </Page>
    );
  }

  if (loading) {
    return <Page title="Loading" />;
  }

  return <ViewManga manga={response.data} />;
}
