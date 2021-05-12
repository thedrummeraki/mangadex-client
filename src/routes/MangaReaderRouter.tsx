import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ReadChapter } from "sections";

export function MangaReaderRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/manga/read/:id" component={ReadChapter} />
      </Switch>
    </BrowserRouter>
  );
}
