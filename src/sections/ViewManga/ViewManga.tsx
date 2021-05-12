import {
  Button,
  CircularProgress,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Page } from "components";
import { useLocalCurrentlyReading } from "helpers";
import { mangaDescription, preferredTitle } from "helpers/mangadex";
import { useState } from "react";
import { useHistory } from "react-router";
import { Manga } from "types";
import { ChaptersList } from "./ChaptersList";

interface Props {
  manga: Manga;
}

const useStyles = makeStyles((theme) => ({
  description: {
    padding: theme.spacing(),
  },
}));

export function ViewManga({ manga }: Props) {
  const history = useHistory();
  const classes = useStyles();
  const [firstChapterId, setFirstChapterId] = useState<string | null>(null);
  const {
    attributes: { lastChapter, status, description, tags, title },
  } = manga;
  const lastChapterBadge =
    lastChapter && parseInt(lastChapter) > 0
      ? `Last chapter: ${lastChapter}`
      : null;

  const statusBadge = status || null;

  const pageTags = tags.map((tag) => ({
    content: tag.attributes.name.en,
  }));

  const { latestChapterForManga } = useLocalCurrentlyReading({ manga });

  const primaryAction = latestChapterForManga ? (
    <Button
      size="small"
      color="secondary"
      variant="contained"
      onClick={() =>
        history.push(`/manga/read/${latestChapterForManga.chapterId}`)
      }
    >
      Continue
    </Button>
  ) : firstChapterId ? (
    <Button
      size="small"
      color="secondary"
      variant="contained"
      onClick={() => history.push(`/manga/read/${firstChapterId}`)}
    >
      Start reading
    </Button>
  ) : null;

  return (
    <Page
      backUrl="/"
      title={preferredTitle(title)}
      badges={[
        lastChapterBadge,
        statusBadge,
        manga.attributes.contentRating || null,
      ]}
      tags={pageTags}
      primaryAction={primaryAction}
    >
      {description.en && (
        <Paper className={classes.description}>
          <Typography>{mangaDescription(manga)}</Typography>
        </Paper>
      )}
      <ChaptersList onFirstChapterReady={setFirstChapterId} manga={manga} />
    </Page>
  );
}
