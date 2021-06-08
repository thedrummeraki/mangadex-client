import { Chip, Grid, makeStyles, TableCell, TableRow } from "@material-ui/core";
import { Link } from "components";
import { chapterTitle, localeName, useLocalCurrentlyReading } from "helpers";
import { DateTime } from "luxon";
import { getFollowUrl, localizedDateTime } from "utils";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DoneIcon from "@material-ui/icons/Done";
import { savedPage } from "helpers/useCurrentlyReading";
import { Chapter, Manga, SingleManga } from "generated/graphql";

interface Props {
  manga: Manga | SingleManga;
  chapter: Chapter;
}

const useStyles = makeStyles((theme) => ({
  notRead: {
    color: theme.palette.grey.A100,
  },
  readingOrRead: {
    color: theme.palette.text.primary,
  },
}));

export function ViewMangaTableRow({ manga, chapter }: Props) {
  const classes = useStyles();
  const currentPage = savedPage(chapter.id, -1) + 1;
  const totalPages = chapter.attributes.data.length - 1;
  const isDone = currentPage !== 0 && currentPage >= totalPages;

  const { isReadingChapter } = useLocalCurrentlyReading({
    manga: manga.id,
    chapter: chapter.id,
  });

  const iconClassName =
    isReadingChapter || isDone ? classes.readingOrRead : classes.notRead;

  const iconMarkup = isDone ? <DoneIcon /> : <PlayArrowIcon />;

  return (
    <TableRow key={chapter.id}>
      <TableCell>{chapter.attributes.chapter || "-"}</TableCell>
      <TableCell>
        <Grid container>
          <Grid item className={iconClassName}>
            {iconMarkup}
          </Grid>
          <Grid item>
            <Link to={getFollowUrl(`/manga/read/${chapter.id}`)}>
              {chapterTitle(chapter)}{" "}
            </Link>
            <Chip
              size="small"
              variant="outlined"
              color="secondary"
              label={localeName(chapter.attributes.translatedLanguage)}
            />
            {chapter.attributes.volume && (
              <Chip
                label={`Volume ${chapter.attributes.volume}`}
                size="small"
                variant="outlined"
                style={{ marginLeft: 8 }}
              />
            )}
            {isReadingChapter && (
              <Chip
                label={`${currentPage}/${totalPages}`}
                size="small"
                style={{ marginLeft: 8 }}
              />
            )}
          </Grid>
        </Grid>
      </TableCell>
      <TableCell align="right">
        {localizedDateTime(chapter.attributes.publishAt, DateTime.DATE_FULL)}
      </TableCell>
    </TableRow>
  );
}
