import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomePage, ViewManga, ReadChapter } from "sections";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/manga/:id" component={ViewManga} />
        <Route exact path="/manga/read/:id" component={ReadChapter} />
      </Switch>
    </BrowserRouter>
  );
}
