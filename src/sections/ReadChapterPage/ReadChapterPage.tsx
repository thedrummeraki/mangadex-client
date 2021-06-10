import {
  SingleChapter,
  SingleManga,
  useChapterAddProgressMutation,
} from "generated/graphql";
import { bindKeyboard } from "react-swipeable-views-utils";
import { useEffect, useState } from "react";

import SwipeableViews from "react-swipeable-views";
import { createStyles } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core";
import { ChapterDrawerToolbar } from "./ChapterDrawerToolbar";

interface Props {
  chapter?: SingleChapter | null;
  manga?: SingleManga | null;
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onChapterChange: (chapterId: string) => void;
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

const useStyles = makeStyles(() =>
  createStyles({
    zoomedOut: {
      height: `calc(100vh - 66px)`,
      objectFit: "contain",
    },
    page: {
      cursor: "point",
      minWidth: "100%",
      width: "100%",
      height: "100%",
      flexShrink: 1,
      position: "relative",
      display: "grid",
      // gridTemplateRows: "minmax(0px, 1fr) 1fr minmax(0px, 1fr)",
      "-moz-box-pack": "center",
      justifyContent: "center",
      scrollbarWidth: "none",
    },
    zoomedIn: {
      objectFit: "contain",
      maxWidth: "100%",
      minWidth: 0,
      width: "100%",
      height: "auto",
      scrollbarWidth: "none",
    },
  })
);

// TODO: Rename to ViewChapterPage (to stay consistent)
export function ReadChapterPage({
  chapter,
  manga,
  page,
  loading,
  onPageChange,
  onChapterChange,
}: Props) {
  const classes = useStyles();
  const [zoomed] = useState(true);

  const [addProgressForChapter] = useChapterAddProgressMutation();

  useEffect(() => {
    window.scrollTo({ top: 0 });

    if (manga && chapter) {
      const complete = page === chapter.attributes.data.length || undefined;
      addProgressForChapter({
        variables: {
          chapterUuid: chapter.id,
          mangaUuid: manga.id,
          page,
          complete,
        },
        refetchQueries: ["GetChapterReadingStatusesQuery"],
      });
    }
  }, [addProgressForChapter, page, chapter, manga]);

  return (
    <ChapterDrawerToolbar
      chapter={chapter}
      manga={manga}
      chapters={manga?.chapters || []}
      page={page}
      loading={loading}
      onChapterChange={onChapterChange}
    >
      <BindKeyboardSwipeableViews
        enableMouseEvents
        resistance
        ignoreNativeScroll
        index={page - 1}
        onChangeIndex={(newIndex) => {
          if (!chapter) {
            return;
          }
          if (newIndex === chapter.pages.length - 1 && page === 1) {
            return;
          }
          if (newIndex === 0 && page === chapter.pages.length) {
            return;
          }
          onPageChange(newIndex + 1);
        }}
      >
        {chapter?.pages.map((page, index) => (
          <div id={`page-${index + 1}`} className={classes.page}>
            <img
              alt={`Page ${index + 1}`}
              src={page.url}
              className={zoomed ? classes.zoomedIn : classes.zoomedOut}
            />
          </div>
        ))}
      </BindKeyboardSwipeableViews>
    </ChapterDrawerToolbar>
  );
}
