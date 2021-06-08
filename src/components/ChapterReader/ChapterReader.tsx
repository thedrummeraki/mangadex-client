import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { TitledSection } from "components/TitledSection";
import { chapterTitle, mangaTitle } from "helpers";
import { savedPage } from "helpers/useCurrentlyReading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Manga } from "types";
import { Chapter } from "types/chapter";
import { DesktopReaderPage } from "./DesktopReaderPage";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useHistory, useLocation } from "react-router";

// todo: move this to hook
import GetChaptersForManga from "sections/ViewManga/queries/GetChaptersForManga";
import { useQuery } from "@apollo/client";

export enum Direction {
  LeftToRight = 1,
  RightToLeft = -1,
}

interface Props {
  direction?: Direction;
  chapter: Chapter;
  manga: Manga;
  pageUrls: Array<string>;
  // How many pages should be flipped at once. Default: 1
  offset?: number;

  // Triggered when going back (before the first page) or forware (after the last page)
  onPrevious: VoidFunction;
  onNext: VoidFunction;
}

const useStyles = makeStyles(() => ({
  readerRoot: {
    height: "calc(100vh)",
    maxWidth: "100%",
  },

  preview: {},
}));

export function ChapterReader({
  direction = Direction.RightToLeft,
  chapter,
  manga,
  pageUrls,
  onPrevious,
  onNext,
}: Props) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { data } = useQuery(GetChaptersForManga, {
    variables: {
      limit: 10,
      offset: 0,
      mangaId: manga.id,
      translatedLanguage: [chapter.attributes.translatedLanguage],
      volume: chapter.attributes.volume,
    },
  });

  const otherChapters = useMemo(() => data?.chapters.results || [], [data]);

  const [currentIndex, setCurrentIndices] = useState(savedPage(chapter.id));
  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>(null);

  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const titleMarkup = (
    <>
      <IconButton
        size="medium"
        onClick={() => history.push(`/manga/${manga.id}`)}
        style={{ marginRight: 8 }}
      >
        <ArrowBackIcon />
      </IconButton>
      {mangaTitle(manga)}
    </>
  );

  const requestNextPage = useCallback(() => {
    if (currentIndex >= pageUrls.length) {
      console.log("cannot go next");
      return;
    }
    console.log("next");
    setCurrentIndices((currentIndex) => currentIndex + 1);
    onNext();
  }, [onNext, currentIndex, pageUrls]);

  const requestPreviousPage = useCallback(() => {
    if (currentIndex <= 0) {
      console.log("cannot go prev");
      return;
    }
    console.log("prev");
    setCurrentIndices((currentIndex) => currentIndex - 1);
    onPrevious();
  }, [currentIndex, onPrevious]);

  const handleLeftClick = useCallback(() => {
    if (direction === Direction.RightToLeft) {
      requestNextPage();
    } else {
      requestPreviousPage();
    }
  }, [direction, requestNextPage, requestPreviousPage]);

  const handleRightClick = useCallback(() => {
    if (direction === Direction.RightToLeft) {
      requestPreviousPage();
    } else {
      requestNextPage();
    }
  }, [direction, requestNextPage, requestPreviousPage]);

  useEffect(() => {
    setCurrentPageUrl(pageUrls[currentIndex]);
    setCanGoNext(currentIndex + 1 < pageUrls.length - 1);
    setCanGoPrevious(currentIndex > 0);

    localStorage.setItem(`chapter-${chapter.id}`, String(currentIndex));
  }, [currentIndex, chapter.id, pageUrls]);

  useEffect(() => {
    if (canGoNext) {
      loadImage(pageUrls[currentIndex + 1]);
    }
    if (canGoPrevious) {
      loadImage(pageUrls[currentIndex - 1]);
    }
  }, [canGoNext, canGoPrevious, pageUrls, currentIndex]);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      let handled = false;
      if (event.key === "ArrowLeft") {
        handleLeftClick();
        handled = true;
      } else if (event.key === "ArrowRight") {
        handleRightClick();
        handled = true;
      }

      if (handled) {
        event.preventDefault();
      }
    });
  }, [handleLeftClick, handleRightClick]);

  return (
    <Grid container className={classes.readerRoot} spacing={2}>
      <Grid item xs={12} md={3} xl={3}>
        <TitledSection title={titleMarkup} />
        <List>
          {otherChapters.map((otherChapter) => {
            const currentlyReading = otherChapter.data.id === chapter.id;
            const title = chapterTitle(otherChapter.data);
            const volume = otherChapter.data.attributes.volume;

            return (
              <ListItem
                button
                key={otherChapter.data.id}
                onClick={() => {
                  const params = new URLSearchParams(
                    location.search
                  ).toString();
                  history.push(`/manga/read/${otherChapter.data.id}?${params}`);
                }}
              >
                <ListItemText
                  primary={currentlyReading ? <strong>{title}</strong> : title}
                  secondary={<span>{volume ? `Volume ${volume}` : "N/A"}</span>}
                />
                {currentlyReading && (
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                )}
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item>
        <DesktopReaderPage
          fullScreen
          shouldDisplay={loaded}
          pageNumber={currentIndex + 1}
          pageUrl={currentPageUrl}
          onClickLeft={handleLeftClick}
          onClickRight={handleRightClick}
          onLoaded={() => setLoaded(true)}
        />
      </Grid>
      {/* <Slider
        marks
        value={sliderValue - 1}
        onChangeCommitted={(_, value) => {
          if (typeof value === "number") {
            setCurrentIndices(direction * value);
          }
        }}
        valueLabelFormat={() => `${currentIndex + 1}`}
        valueLabelDisplay="auto"
        min={-pageUrls.length + 1}
        max={-1}
        scale={(x) => -x}
        track="inverted"
      /> */}
    </Grid>
  );
}

function loadImage(url: string) {
  const imageLoader = new Image();
  imageLoader.src = url;
}
