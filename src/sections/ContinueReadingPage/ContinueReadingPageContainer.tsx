import { Button, FormControl, makeStyles, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Page } from "components";
import { useAuth } from "config/providers";
import { useLocalCurrentlyReading, useSearchMangaList } from "helpers";
import { useEffect, useMemo, useRef, useState } from "react";
import { notEmpty } from "utils";
import { ContinueReadingPage } from "./ContinueReadingPage";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ImportIcon from "@material-ui/icons/CloudUpload";
import ExportIcon from "@material-ui/icons/CloudDownload";
import { ExportModal } from "./ExportModal";
import { useHistory } from "react-router";
import BasicModal from "components/modals/BasicModal";
import useLocalCurrentReadingHistoryManagament from "helpers/useLocalCurrentReadingHistoryManagament";

const useStyles = makeStyles((theme) => ({
  formRoot: {
    "& > *": {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
}));

export default function ContinueReadingPageContainer() {
  const classes = useStyles();
  const history = useHistory();
  const { currentlyReading } = useLocalCurrentlyReading();
  const mangaIds = Array.from(
    new Set(currentlyReading.map((cr) => cr.mangaId))
  );
  const [warning, setWarning] = useState(showWarning());
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { currentUser } = useAuth();

  const initialized = useRef(false);
  const { mangaList, loading, error, searchManga } = useSearchMangaList({
    limit: 100,
  });
  const { clearHistory } = useLocalCurrentReadingHistoryManagament();

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

  const tags = [
    {
      content: "Import...",
      icon: <ImportIcon />,
      onClick: () => history.push("/continue-reading/import"),
    },
  ];

  if (sortedMangaList.length > 0) {
    tags.push({
      content: "Export...",
      icon: <ExportIcon />,
      onClick: () => setExportModalOpen(true),
    });
    tags.push({
      content: "Delete...",
      icon: <DeleteForeverIcon />,
      onClick: () => setDeleteModalOpen(true),
    });
  }

  return (
    <Page title="Reading history" tags={tags}>
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
      <BasicModal
        title="Delete reading history?"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <Typography>This will be gone forever, are you sure?</Typography>
        <form noValidate autoComplete="off" className={classes.formRoot}>
          <FormControl>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={() => {
                clearHistory();
                setDeleteModalOpen(false);
              }}
            >
              Yes, delete everything
            </Button>
          </FormControl>
        </form>
      </BasicModal>
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
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
