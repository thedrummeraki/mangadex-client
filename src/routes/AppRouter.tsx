import { WithLayoutProvider } from "config/providers";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  HomePage,
  ViewManga,
  ReadChapterPage,
  CustomListPage,
  FollowsListPage,
  BrowseMangaPage,
  ContinueReadingPage,
  ImportReadingHistoryPage,
  ByAuthorPage,
} from "sections";

import AuthenticatedRoute from "./AuthenticatedRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <AuthenticatedRoute exact path="/custom-lists">
          <CustomListPage />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/feed">
          <FollowsListPage />
        </AuthenticatedRoute>

        <Route exact path="/" component={HomePage} />
        <Route exact path="/manga/:id" component={ViewManga} />
        <Route exact path="/browse-manga" component={BrowseMangaPage} />
        <Route exact path="/continue-reading" component={ContinueReadingPage} />
        <Route
          exact
          path="/continue-reading/import"
          component={ImportReadingHistoryPage}
        />
        <Route exact path="/by-author/:id" component={ByAuthorPage} />
        <Route exact path="/manga/read/:id" component={ReadChapterPage} />
      </Switch>
    </BrowserRouter>
  );
}
