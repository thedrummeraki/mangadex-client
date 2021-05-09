import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Page } from "components";
import { preferredTitle } from "helpers/mangadex";
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
  const classes = useStyles();
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
    >
      {description.en && (
        <Paper className={classes.description}>
          <Typography>{description.en}</Typography>
        </Paper>
      )}
      <ChaptersList manga={manga} />
    </Page>
  );
}
