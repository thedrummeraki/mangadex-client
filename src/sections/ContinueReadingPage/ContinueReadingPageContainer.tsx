import { Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Page } from "components";
import { useLocalCurrentlyReading, useSearchMangaList } from "helpers";
import { useEffect, useRef } from "react";
import { ContinueReadingPage } from "./ContinueReadingPage";

export default function ContinueReadingPageContainer() {
  const { currentlyReading } = useLocalCurrentlyReading();
  const mangaIds = currentlyReading.map((cr) => cr.mangaId);

  const initialized = useRef(false);

  const { mangaList, loading, error, searchManga } = useSearchMangaList({
    limit: 100,
  });

  useEffect(() => {
    if (initialized.current || loading) {
      return;
    }

    searchManga({ ids: mangaIds });
    initialized.current = true;
  }, [searchManga, loading, mangaIds]);

  if (!loading) {
    console.log(mangaList);
  }

  if (loading) {
    return <Page backUrl="/" title="Loading" />;
  }

  if (error || mangaList.results == null) {
    return (
      <Page backUrl="/" title="Uh oh">
        <Typography>
          Something when went on MangaDex's end, please try again!
        </Typography>
      </Page>
    );
  }

  return (
    <Page title="Reading history">
      <Alert color="warning" variant="outlined" style={{ marginBottom: 32 }}>
        <AlertTitle>
          Your reading history is currently on your current device!
        </AlertTitle>
        MangaDex currently doesn't have a nice way to save your history for now,
        so we've decided to keep things local and securely store your reading
        history on your current device! While we keep that amazing history for
        you,
        <strong>
          please note that deleting your browser cache/storage maybe
          permanentally delete your history
        </strong>
        . This is <strong>not</strong> tied to your MangaDex account.
      </Alert>
      <ContinueReadingPage mangas={mangaList.results} />
    </Page>
  );
}
