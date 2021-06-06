import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useParams } from "react-router";
import { ViewManga } from "./ViewManga";
import ViewMangaQuery from "./queries/ViewMangaQuery";
import { useGetMangaQuery } from "generated/graphql";

export default function ViewMangaContainer() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useGetMangaQuery({ variables: { id } });

  if (error || (!loading && !data?.manga)) {
    if (error) console.error(error);
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

  return <ViewManga manga={data.manga} />;
}
