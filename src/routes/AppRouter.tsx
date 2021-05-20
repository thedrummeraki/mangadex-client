import { WithLayoutProvider } from "config/providers";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  HomePage,
  ViewManga,
  ReadChapter,
  CustomListPage,
  FollowsListPage,
  BrowseMangaPage,
  ContinueReadingPage,
} from "sections";

import AuthenticatedRoute from "./AuthenticatedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <WithLayoutProvider>
          <AuthenticatedRoute exact path="/custom-lists">
            <CustomListPage />
          </AuthenticatedRoute>
          <AuthenticatedRoute exact path="/feed">
            <FollowsListPage />
          </AuthenticatedRoute>

          <Route exact path="/" component={HomePage} />
          <Route exact path="/manga/:id" component={ViewManga} />
          <Route exact path="/manga/read/:id" component={ReadChapter} />
          <Route exact path="/browse-manga" component={BrowseMangaPage} />
          <Route
            exact
            path="/continue-reading"
            component={ContinueReadingPage}
          />
        </WithLayoutProvider>
      </Switch>
    </BrowserRouter>
  );
}
