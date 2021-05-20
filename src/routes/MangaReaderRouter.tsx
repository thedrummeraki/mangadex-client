import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ReadChapterPage } from "sections";

export function MangaReaderRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/manga/read/:id" component={ReadChapterPage} />
      </Switch>
    </BrowserRouter>
  );
}
