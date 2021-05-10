import { Grid, Slider } from "@material-ui/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chapter } from "types/chapter";
import { DesktopReaderPage } from "./DesktopReaderPage";

interface Props {
  chapter: Chapter;
  pageUrls: Array<string>;
  // How many pages should be flipped at once. Default: 1
  offset?: number;

  // Triggered when going back (before the first page) or forware (after the last page)
  onPrevious: VoidFunction;
  onNext: VoidFunction;
}

interface CurrentIndexState {
  left: number;
  right: number;
}

interface CurrentPageUrlState {
  left: string | null;
  right: string | null;
}

export function ChapterReader({
  chapter,
  pageUrls,
  offset = 1,
  onPrevious,
  onNext,
}: Props) {
  const savedPages = () => ({
    left: parseInt(localStorage.getItem(`chapter-${chapter.id}.left`) || "1"),
    right: parseInt(localStorage.getItem(`chapter-${chapter.id}.right`) || "0"),
  });

  const [currentIndex, setCurrentIndices] = useState<CurrentIndexState>(
    savedPages()
  );

  const [currentPageUrl, setCurrentPageUrl] = useState<CurrentPageUrlState>({
    left: null,
    right: null,
  });

  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [loaded, setLoaded] = useState({ left: false, right: false });

  const sliderValue = useMemo(() => -currentIndex.left, [currentIndex]);
  const pagesLoaded = useMemo(() => loaded.left && loaded.right, [loaded]);

  const requestNextPage = () => {
    if (!canGoNext) {
      return;
    }
    setCurrentIndices((currentIndex) => ({
      left: currentIndex.left + offset,
      right: currentIndex.right + offset,
    }));
    onNext();
  };

  const requestPreviousPage = () => {
    if (!canGoPrevious) {
      return;
    }
    setCurrentIndices((currentIndex) => ({
      left: currentIndex.left - offset,
      right: currentIndex.right - offset,
    }));
    onPrevious();
  };

  useEffect(() => {
    setCurrentPageUrl({
      left: pageUrls[currentIndex.left],
      right: pageUrls[currentIndex.right],
    });
    setCanGoNext(currentIndex.left < pageUrls.length - 1);
    setCanGoPrevious(currentIndex.right > 0);

    localStorage.setItem(
      `chapter-${chapter.id}.left`,
      String(currentIndex.left)
    );
    localStorage.setItem(
      `chapter-${chapter.id}.right`,
      String(currentIndex.right)
    );
  }, [currentIndex]);

  useEffect(() => {
    if (canGoNext) {
      loadImage(pageUrls[currentIndex.left + 1]);
    }
    if (canGoPrevious) {
      loadImage(pageUrls[currentIndex.right - 1]);
    }
  }, [canGoNext, canGoPrevious]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6}>
          <DesktopReaderPage
            shouldDisplay={pagesLoaded}
            pageNumber={currentIndex.left}
            pageUrl={currentPageUrl.left}
            direction="left"
            onClick={requestNextPage}
            onLoaded={() => setLoaded((loaded) => ({ ...loaded, left: true }))}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DesktopReaderPage
            shouldDisplay={pagesLoaded}
            pageNumber={currentIndex.right}
            pageUrl={currentPageUrl.right}
            direction="right"
            onClick={requestPreviousPage}
            onLoaded={() => setLoaded((loaded) => ({ ...loaded, right: true }))}
          />
        </Grid>
      </Grid>
      <Slider
        marks
        value={sliderValue}
        onChangeCommitted={(_, value) => {
          if (typeof value === "number") {
            const index = -value;
            if (index % 2 === 0) {
              setCurrentIndices(() => ({
                left: index + 1,
                right: index,
              }));
            } else {
              setCurrentIndices(() => ({
                left: index,
                right: index - 1,
              }));
            }
          }
        }}
        valueLabelFormat={() => `${currentIndex.left}/${currentIndex.right}`}
        valueLabelDisplay="auto"
        min={-pageUrls.length + 1}
        step={2}
        max={-1}
        scale={(x) => -x}
        track="inverted"
      />
    </>
  );
}

function loadImage(url: string) {
  const imageLoader = new Image();
  imageLoader.src = url;
}
