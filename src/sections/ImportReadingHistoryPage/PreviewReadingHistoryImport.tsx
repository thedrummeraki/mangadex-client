import {
  Button,
  ButtonGroup,
  FormControl,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { CustomGrid, Page, Thumbnail } from "components";
import { ReadingHistory } from "helpers/useCurrentlyReading";
import { useEffect, useMemo, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import BasicModal from "components/modals/BasicModal";
import useLocalCurrentReadingHistoryManagament from "helpers/useLocalCurrentReadingHistoryManagament";
import { useHistory } from "react-router";
import { useGetSearchMangaLazyQuery } from "generated/graphql";

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
  const [searchManga, { data }] = useGetSearchMangaLazyQuery({
    variables: { limit: 100, offset: 0 },
  });
  const mangaList = useMemo(() => data?.mangas || [], [data]);

  const { saveImport } = useLocalCurrentReadingHistoryManagament();

  useEffect(() => {
    searchManga({
      variables: {
        limit: 100,
        offset: 0,
        ids: readingHistory.map((rh) => rh.mangaId),
      },
    });
  }, [searchManga, readingHistory]);

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
      <CustomGrid>
        {mangaList.map((manga) => (
          <Thumbnail
            key={manga.id}
            features={[manga.attributes.status]}
            title={manga.attributes.title.en}
            img={manga.covers ? manga.covers[0].url : "#"}
            url={`/manga/${manga.id}`}
          />
        ))}
      </CustomGrid>
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
