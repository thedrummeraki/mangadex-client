import { useQuery } from "@apollo/client";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { ChaptersGrid, Page } from "components";
import { useScrollListeners } from "utils";
import GetFollowListsQuery from "./queries/GetFollowListsQuery";

const useStyles = makeStyles((theme) => ({
  description: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(),
  },
}));

export default function FollowListPageContainer() {
  const classes = useStyles();
  const { data, loading, error, fetchMore } = useQuery(GetFollowListsQuery, {
    variables: { limit: 20 },
  });

  useScrollListeners(null, () => {
    console.log(loading);
    if (!data?.followsList.results || loading) {
      return;
    }

    if (data.followsList.results.length < data.followsList.total) {
      fetchMore({
        variables: {
          limit: 40,
          offset: data.followsList.offset + data.followsList.limit,
        },
      });
    }
  });

  if (error) {
    return (
      <Page backUrl="/" title="Uh oh...">
        Something went wrong while trying to fetch your follows...
      </Page>
    );
  }

  if (loading || !data) {
    return <Page backUrl="/" title="Loading..." />;
  }

  if (!data.followsList.results || data.followsList.results.length === 0) {
    <Page backUrl="/" title="Your chapters feed">
      <Typography>
        You do not have any chapters if your feed for now! Please check back
        later.
      </Typography>
    </Page>;
  }

  return (
    <Page backUrl="/" title="Your chapters feed">
      <Paper className={classes.description}>
        <Typography>
          MangaDex generated this <em>long</em> list of chapters for you to
          discover. Enjoy!
        </Typography>
      </Paper>
      <ChaptersGrid chaptersResponse={data.followsList.results || []} />
    </Page>
  );
}
