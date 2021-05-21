import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useParams } from "react-router";
import { ViewManga } from "./ViewManga";
import ViewMangaQuery from "./queries/ViewMangaQuery";

export default function ViewMangaContainer() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(ViewMangaQuery, {
    variables: { id },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
    },
  });

  const errored =
    (!data && !loading) || Boolean(error) || data?.manga?.result === "ko";

  if (errored || (!loading && !data?.manga?.data)) {
    return (
      <Page backUrl="/" title="Uh oh...">
        <Typography>
          We're sorry, we were not able to get the latest information from
          Mangadex.
        </Typography>
      </Page>
    );
  }

  if (loading || !data?.manga) {
    return <Page backUrl="/" title="Loading..." />;
  }

  return <ViewManga mangaInfo={data.manga} />;
}
