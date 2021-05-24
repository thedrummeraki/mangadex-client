import { Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Page } from "components";
import { useAuth } from "config/providers";
import { useLocalCurrentlyReading, useSearchMangaList } from "helpers";
import { useEffect, useMemo, useRef, useState } from "react";
import { notEmpty } from "utils";
import { ContinueReadingPage } from "./ContinueReadingPage";

export default function ContinueReadingPageContainer() {
  const { currentlyReading } = useLocalCurrentlyReading();
  const mangaIds = Array.from(
    new Set(currentlyReading.map((cr) => cr.mangaId))
  );
  const [warning, setWarning] = useState(showWarning());
  const { currentUser } = useAuth();

  const initialized = useRef(false);

  const { mangaList, loading, error, searchManga } = useSearchMangaList({
    limit: 100,
  });

  const sortedMangaList = useMemo(() => {
    const mangasInfo = mangaList.results || [];

    return mangaIds
      .reverse()
      .map((id) => mangasInfo.find((mangaInfo) => mangaInfo.data.id === id))
      .filter(notEmpty);
  }, [mangaList, mangaIds]);

  useEffect(() => {
    if (initialized.current || loading) {
      return;
    }

    searchManga({ ids: mangaIds });
    initialized.current = true;
  }, [searchManga, loading, mangaIds]);

  useEffect(() => {
    if (showWarning() && !warning) {
      hideWarningNow();
    }
  }, [warning]);

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
      {warning && (
        <Alert
          color="warning"
          variant="outlined"
          style={{ marginBottom: 32 }}
          onClose={() => setWarning(false)}
        >
          <AlertTitle>
            👋 Hey {currentUser ? currentUser.attributes.username : "there"}!
            Your reading history is <em>only</em> stored on your current device!
          </AlertTitle>
          MangaDex currently doesn't have a nice way to save your history for
          now, so we've decided to keep things local and securely store your
          reading history on your current device! While we keep that amazing
          history for you,{" "}
          <strong>
            please note that deleting your browser cache/storage maybe
            permanentally delete your history
          </strong>
          . This is <strong>not</strong> tied to your MangaDex account.
        </Alert>
      )}
      <ContinueReadingPage mangas={sortedMangaList} />
    </Page>
  );
}

function showWarning() {
  return (
    localStorage.getItem("current-reading-history-local-warning") !==
    "dismissed"
  );
}

function hideWarningNow() {
  localStorage.setItem("current-reading-history-local-warning", "dismissed");
}
