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
import LayoutRoute from "./RouteWithLayout";

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

        <LayoutRoute exact path="/">
          <HomePage />
        </LayoutRoute>
        <LayoutRoute exact path="/manga/:id">
          <ViewManga />
        </LayoutRoute>
        <LayoutRoute exact path="/browse-manga">
          <BrowseMangaPage />
        </LayoutRoute>
        <LayoutRoute exact path="/continue-reading">
          <ContinueReadingPage />
        </LayoutRoute>
        <LayoutRoute exact path="/continue-reading/import">
          <ImportReadingHistoryPage />
        </LayoutRoute>
        <LayoutRoute exact path="/by-author/:id">
          <ByAuthorPage />
        </LayoutRoute>
        <Route exact path="/manga/read/:id">
          <ReadChapterPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
