import { Slider } from "@material-ui/core";
import { useEffect, useMemo, useState } from "react";
import { Chapter } from "types/chapter";
import { DesktopReaderPage } from "./DesktopReaderPage";

export enum Direction {
  LeftToRight = 1,
  RightToLeft = -1,
}

interface Props {
  direction?: Direction;
  chapter: Chapter;
  pageUrls: Array<string>;
  // How many pages should be flipped at once. Default: 1
  offset?: number;

  // Triggered when going back (before the first page) or forware (after the last page)
  onPrevious: VoidFunction;
  onNext: VoidFunction;
}

export function ChapterReader({
  direction = Direction.RightToLeft,
  chapter,
  pageUrls,
  onPrevious,
  onNext,
}: Props) {
  const savedPage = () =>
    parseInt(localStorage.getItem(`chapter-${chapter.id}`) || "0");

  const [currentIndex, setCurrentIndices] = useState(savedPage());

  const [currentPageUrl, setCurrentPageUrl] = useState<string | null>(null);

  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sliderValue = useMemo(
    () => direction * currentIndex,
    [direction, currentIndex]
  );

  const handleLeftClick = () => {
    if (direction === Direction.RightToLeft) {
      requestNextPage();
    } else {
      requestPreviousPage();
    }
  };

  const handleRightClick = () => {
    if (direction === Direction.RightToLeft) {
      requestPreviousPage();
    } else {
      requestNextPage();
    }
  };

  const requestNextPage = () => {
    if (!canGoNext) {
      return;
    }
    setCurrentIndices((currentIndex) => currentIndex + 1);
    onNext();
  };

  const requestPreviousPage = () => {
    if (!canGoPrevious) {
      return;
    }
    setCurrentIndices((currentIndex) => currentIndex - 1);
    onPrevious();
  };

  useEffect(() => {
    setCurrentPageUrl(pageUrls[currentIndex]);
    setCanGoNext(currentIndex < pageUrls.length - 1);
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

  return (
    <>
      <DesktopReaderPage
        shouldDisplay={loaded}
        pageNumber={currentIndex + 1}
        pageUrl={currentPageUrl}
        onClickLeft={handleLeftClick}
        onClickRight={handleRightClick}
        onLoaded={() => setLoaded(true)}
      />
      <Slider
        marks
        value={sliderValue}
        onChangeCommitted={(_, value) => {
          if (typeof value === "number") {
            setCurrentIndices(direction * value);
          }
        }}
        valueLabelFormat={() => `${currentIndex}`}
        valueLabelDisplay="auto"
        min={-pageUrls.length + 1}
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
