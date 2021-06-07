import { ChapterReader } from "components";
import { SingleChapter, useGetMangaQuery } from "generated/graphql";
import { bindKeyboard } from "react-swipeable-views-utils";
import { useLocalCurrentlyReading, useSearchMangaList } from "helpers";
import { useEffect, useMemo, useState } from "react";

import SwipeableViews from "react-swipeable-views";
import { CSSProperties } from "@material-ui/styles";

interface Props {
  chapter: SingleChapter;
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const zoomedOutStyles: CSSProperties = {
  height: "100vh",
  objectFit: "contain",
};
const zoomedInStyles: CSSProperties = { width: "100%" };

// TODO: Rename to ViewChapterPage (to stay consistent)
export function ReadChapterPage({ chapter }: Props) {
  const { setCurrentlyReading } = useLocalCurrentlyReading({
    manga: chapter.mangaId,
  });
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const { data } = useGetMangaQuery({ variables: { id: chapter.mangaId } });

  const manga = data?.manga;

  if (!manga) {
    return null;
  }

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <BindKeyboardSwipeableViews
        enableMouseEvents
        index={index}
        onChangeIndex={setIndex}
      >
        {chapter.pages.map((page, index) => (
          <img
            alt={`Page ${index + 1}`}
            src={page.url}
            onClick={() => setZoomed((zoomed) => !zoomed)}
            style={zoomed ? zoomedInStyles : zoomedOutStyles}
          />
        ))}
      </BindKeyboardSwipeableViews>
    </div>
  );
}
