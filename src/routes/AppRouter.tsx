import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomePage, ViewManga } from "sections";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/manga/:id" component={ViewManga} />
      </Switch>
    </BrowserRouter>
  );
}
