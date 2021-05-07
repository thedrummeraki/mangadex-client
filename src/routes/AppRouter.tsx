import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomePage } from "sections/HomePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
}
