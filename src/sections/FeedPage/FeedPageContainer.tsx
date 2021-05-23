import { useQuery } from "@apollo/client";
import {
  makeStyles,
  Paper,
  Typography,
  TableCell,
  TableRow,
  Chip,
  Grid,
} from "@material-ui/core";
import { ChaptersGrid, Link, Page } from "components";
import { chapterTitle, mangaTitle, useSearchMangaList } from "helpers";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chapter, Manga } from "types";
import {
  getFollowUrl,
  localizedDateTime,
  notEmpty,
  useScrollListeners,
} from "utils";
import GetFollowListsQuery from "./queries/GetFollowListsQuery";

import MenuBookIcon from "@material-ui/icons/MenuBook";

interface ChapterMangaMapping {
  chapter: Chapter;
  manga: Manga;
}

const useStyles = makeStyles((theme) => ({
  description: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(),
  },
  mangaLink: {
    textDecoration: "none",
    color: theme.palette.text.disabled,
  },
}));

export default function FeedPageContainer() {
  const classes = useStyles();
  const { data, loading, error, fetchMore } = useQuery(GetFollowListsQuery, {
    variables: { limit: 20 },
  });
  const { mangaList, searchManga } = useSearchMangaList({ limit: 100 });
  const [chapterMangaMappings, setChapterMangaMappings] = useState<
    ChapterMangaMapping[]
  >([]);

  const getManga = useCallback(
    (chapter: Chapter) => {
      return chapterMangaMappings.find(
        (mapping) => mapping.chapter.id === chapter.id
      )?.manga;
    },
    [chapterMangaMappings]
  );

  const mangaIds = useMemo(() => {
    if (data?.followsList?.results?.length) {
      const chaptersData = data.followsList.results;
      return chaptersData
        .map((data) => {
          const mangaId = data.relationships.find(
            (rel) => rel.type === "manga"
          )?.id;

          return mangaId
            ? {
                chapter: data.data,
                mangaId,
              }
            : null;
        })
        .filter(notEmpty);
    } else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    if (mangaIds.length) {
      searchManga({ ids: mangaIds.map((idInfo) => idInfo.mangaId) });
    }
  }, [mangaIds, searchManga]);

  useEffect(() => {
    if (mangaList.results?.length && data?.followsList?.results?.length) {
      const newMappings: ChapterMangaMapping[] = [];
      const chapters = data.followsList.results;
      chapters.forEach((chapter) => {
        const mangaId = mangaIds.find(
          (idInfo) => idInfo.chapter.id === chapter.data.id
        )?.mangaId;
        const manga = mangaList.results?.find(
          (mangaResponse) => mangaResponse.data.id === mangaId
        )?.data;

        if (manga) {
          newMappings.push({ chapter: chapter.data, manga });
        }
      });

      setChapterMangaMappings(newMappings);
    }
  }, [data, mangaList, mangaIds]);

  useEffect(() => {
    console.log("chapterMangaMappings", chapterMangaMappings);
  }, [chapterMangaMappings]);

  useScrollListeners(null, () => {
    if (!data?.followsList.results || loading) {
      return;
    }

    if (data.followsList.results.length < data.followsList.total) {
      fetchMore({
        variables: {
          limit: 40,
          offset: data.followsList.offset + data.followsList.limit,
        },
      });
    }
  });

  if (error) {
    return (
      <Page backUrl="/" title="Uh oh...">
        Something went wrong while trying to fetch your follows...
      </Page>
    );
  }

  if (loading || !data) {
    return <Page backUrl="/" title="Loading..." />;
  }

  if (!data.followsList.results || data.followsList.results.length === 0) {
    <Page backUrl="/" title="Your chapters feed">
      <Typography>
        You do not have any chapters if your feed for now! Please check back
        later.
      </Typography>
    </Page>;
  }

  return (
    <Page backUrl="/" title="Your chapters feed">
      <Paper className={classes.description}>
        <Typography>
          MangaDex generated this <em>long</em> list of chapters for you to
          discover. Enjoy!
        </Typography>
      </Paper>
      <ChaptersGrid
        chaptersResponse={data.followsList.results || []}
        renderItem={(chapter) => {
          const manga = getManga(chapter);

          return (
            <TableRow key={chapter.id}>
              <TableCell>{chapter.attributes.chapter}</TableCell>
              <TableCell>
                <div>
                  <Link to={getFollowUrl(`/manga/read/${chapter.id}`)}>
                    {chapterTitle(chapter)}{" "}
                  </Link>
                  {chapter.attributes.volume && (
                    <Chip
                      label={`Volume ${chapter.attributes.volume}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </div>
                {manga && (
                  <Link to={`/manga/${manga.id}`} className={classes.mangaLink}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item>
                        <MenuBookIcon fontSize="small" />
                      </Grid>
                      <Grid item>{mangaTitle(manga)}</Grid>
                    </Grid>
                  </Link>
                )}
              </TableCell>
              <TableCell align="right">
                {localizedDateTime(
                  chapter.attributes.publishAt,
                  DateTime.DATE_FULL
                )}
              </TableCell>
            </TableRow>
          );
        }}
      />
    </Page>
  );
}
