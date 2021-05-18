import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useAuth, WithLayoutProvider } from "config/providers";
import { PropsWithChildren } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  HomePage,
  ViewManga,
  ReadChapter,
  CustomListPage,
  FollowsListPage,
} from "sections";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <WithLayoutProvider>
          <Authenticated>
            <Route exact path="/custom-lists" component={CustomListPage} />
            <Route exact path="/follows" component={FollowsListPage} />
          </Authenticated>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/manga/:id" component={ViewManga} />
          <Route exact path="/manga/read/:id" component={ReadChapter} />
        </WithLayoutProvider>
      </Switch>
    </BrowserRouter>
  );
}

function Authenticated({ children }: PropsWithChildren<{}>) {
  const { loggedIn } = useAuth();

  if (!loggedIn) {
    return (
      <Page backUrl="/" title="You are not logged in.">
        <Typography>
          Sorry, you need to be logged in to see this page.
        </Typography>
      </Page>
    );
  }

  return <>{children}</>;
}
