import {
  Button,
  ButtonGroup,
  FormControl,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Pagination, Alert, AlertTitle } from "@material-ui/lab";
import { Page } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { useSearchMangaList } from "helpers";
import { ReadingHistory } from "helpers/useCurrentlyReading";
import usePagination from "helpers/usePagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Manga } from "types";
import SaveIcon from "@material-ui/icons/Save";
import BasicModal from "components/modals/BasicModal";
import useLocalCurrentReadingHistoryManagament from "helpers/useLocalCurrentReadingHistoryManagament";
import { useHistory } from "react-router";

interface Props {
  readingHistory: ReadingHistory[];
}

const useStyles = makeStyles((theme) => ({
  centerContent: {
    display: "flex",
    width: "100%",
    margin: theme.spacing(2),
    justifyContent: "center",
  },
  formRoot: {
    "& > *": {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
}));

export function PreviewReadingHistoryImport({ readingHistory }: Props) {
  const classes = useStyles();
  const history = useHistory();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [override, setOverride] = useState(false);
  const [thinking, setThinking] = useState(false);
  const { limit, offset, page, setPage, getPagesCount } = usePagination();
  const { mangaList, loading, searchManga } = useSearchMangaList({
    limit,
  });
  const { saveImport } = useLocalCurrentReadingHistoryManagament();

  const getChapterIds = useCallback(
    (manga: Manga) =>
      readingHistory
        .filter((rh) => rh.mangaId === manga.id)
        .map((rh) => rh.chapterId),
    [readingHistory]
  );

  const pagesCount = useMemo(
    () => getPagesCount(mangaList.total),
    [getPagesCount, mangaList]
  );

  useEffect(() => {
    searchManga({
      ids: readingHistory.map((rh) => rh.mangaId),
    });
  }, [searchManga, offset, readingHistory]);

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    setThinking(override);
    if (override) {
      id = setTimeout(() => {
        setThinking(false);
      }, 2000);
    }
    return () => {
      if (id) clearTimeout(id);
    };
  }, [override]);

  const primaryAction = (
    <Button
      size="small"
      variant="contained"
      color="secondary"
      endIcon={<SaveIcon />}
      onClick={() => setSaveModalOpen(true)}
    >
      Save
    </Button>
  );

  return (
    <Page
      title="Previewing your history"
      backUrl="/continue-reading"
      primaryAction={primaryAction}
    >
      <Alert color="warning" variant="outlined" style={{ marginBottom: 32 }}>
        <AlertTitle>About importing reading history files...</AlertTitle>
        You can choose to override or add the progress below to your current
        reading history. If you don't want to lose your current reading history,
        we suggest exporting it before pressing "Save" (you can do this by going
        back).
      </Alert>
      <MangaCustomGrid
        mangasInfo={mangaList.results || []}
        overrideFeatures={(mangaInfo) => {
          const chaptersCount = getChapterIds(mangaInfo.data).length;
          const countText =
            chaptersCount === 1 ? "1 chapter" : `${chaptersCount} chapters`;
          return [`Read ${countText}`];
        }}
      />
      {pagesCount > 1 && (
        <div className={classes.centerContent}>
          <Pagination
            disabled={loading}
            count={pagesCount}
            page={page}
            onChange={(_, number) => setPage(number)}
          />
        </div>
      )}
      <BasicModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save options..."
      >
        <Typography>
          "<strong>Append</strong>" will <em>add</em> to your current reading
          history list. "<strong>Override</strong>" will <em>replace</em> all
          manga currently in your reading list with the ones that were imported
          (destructive action).
        </Typography>
        <div className={classes.centerContent}>
          <ButtonGroup
            size="small"
            aria-label="large outlined primary button group"
          >
            <Button
              variant={override ? "outlined" : "contained"}
              color={override ? "default" : "secondary"}
              onClick={() => setOverride(false)}
            >
              Append
            </Button>
            <Button
              variant={override ? "contained" : "outlined"}
              color={override ? "secondary" : "default"}
              onClick={() => setOverride(true)}
            >
              Override
            </Button>
          </ButtonGroup>
        </div>
        <form noValidate autoComplete="off" className={classes.formRoot}>
          <FormControl>
            <Button
              disabled={thinking}
              size="large"
              variant="contained"
              color="primary"
              onClick={() => {
                saveImport(readingHistory, override).then(() => {
                  setSaveModalOpen(false);
                  history.replace("/continue-reading?success=true");
                });
              }}
            >
              {override ? "Yes, override!" : "Continue"}
            </Button>
          </FormControl>
        </form>
      </BasicModal>
    </Page>
  );
}
