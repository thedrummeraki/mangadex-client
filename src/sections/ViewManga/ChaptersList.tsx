import { useLazyQuery } from "@apollo/client";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChaptersGrid, TitledSection } from "components";
import SplitButton from "components/SplitButton";
import { localeName } from "helpers";
import { compareChapters } from "helpers/compare";
import { CompareDirection } from "helpers/compare/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chapter, GenericResponse, Manga } from "types";
import GetChaptersForManga from "./queries/GetChaptersForManga";
import { ViewMangaTableRow } from "./ViewMangaTableRow";

interface Props {
  manga: Manga;
  volumes: string[];
  currentVolume?: string | null;
  defaultLocale?: string | null;
  onFirstChapterReady: (chapterId: string) => void;
  onVolumeChange: (volume: string) => void;
}

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    display: "flex",
    width: "100%",
    margin: theme.spacing(2),
    justifyContent: "center",
  },
}));

export function ChaptersList({
  manga,
  volumes,
  currentVolume: selectedCurrentVolume,
  defaultLocale,
  onFirstChapterReady,
  onVolumeChange,
}: Props) {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [currentLocale, setCurrentLocale] = useState<string | null>(
    defaultLocale || null
  );
  const [currentVolume, setCurrentVolume] = useState<string | null>(null);

  const currentVolumeInitialized = useRef(selectedCurrentVolume != null);

  useEffect(() => {
    if (!currentVolumeInitialized.current && volumes.length > 0) {
      setCurrentVolume(volumes.slice(-1)[0]);
    }
  }, [volumes]);

  const [getChapters, { data, loading, error }] = useLazyQuery(
    GetChaptersForManga,
    {
      // fetchPolicy: "no-cache",
      context: {
        headers: {
          "X-Allow-Cache": "true",
        },
      },
    }
  );

  const chaptersByLocale = useMemo(() => {
    const chapters = data?.chapters.results;
    if (chapters) {
      const group = chapters.reduce(
        (entryMap, e) =>
          entryMap.set(e.data.attributes.translatedLanguage, [
            ...(entryMap.get(e.data.attributes.translatedLanguage) || []),
            e,
          ]),
        new Map<string, GenericResponse<Chapter>[]>()
      );

      return Object.fromEntries(group);
    }
  }, [data]);

  const existingLocales = useMemo(() => {
    if (chaptersByLocale) {
      return Object.entries(chaptersByLocale).map((entry) => entry[0]);
    }

    return [];
  }, [chaptersByLocale]);

  const chapters = useMemo(() => {
    if (data?.chapters.results && chaptersByLocale) {
      const result = currentLocale
        ? chaptersByLocale[currentLocale]
        : data.chapters.results;

      return [...result].sort(compareChapters(CompareDirection.ASC));
    }

    return [];
  }, [chaptersByLocale, data, currentLocale]);

  const pagesCount = useMemo(() => {
    const totalResults = data?.chapters.total;
    if (totalResults) {
      return Math.ceil(totalResults / pageSize);
    }

    return 1;
  }, [data]);

  useEffect(() => {
    if (currentVolume) {
      getChapters({
        variables: {
          limit: pageSize,
          offset: pageSize * (page - 1),
          mangaId: manga.id,
          orderChapter: "asc",
          volume: currentVolume,
        },
      });
    }
  }, [currentVolume, page, manga, getChapters]);

  useEffect(() => {
    if (currentVolume) {
      onVolumeChange(currentVolume);
    }
  }, [currentVolume]);

  useEffect(() => {
    if (data?.chapters?.results?.length) {
      onFirstChapterReady(data?.chapters.results[0].data.id);
    }
  }, [onFirstChapterReady, data?.chapters]);

  if (error || data?.chapters?.result === "error") {
    return <TitledSection title="Error" />;
  }

  const initialSelection = currentVolume
    ? volumes.findIndex((volume) => volume === currentVolume)
    : undefined;

  const primaryAction = volumes.length > 1 && (
    <SplitButton
      options={volumes.map((volume) => ({
        content:
          String(parseInt(volume)) !== "NaN"
            ? `Volume ${volume}`
            : volume === "N/A"
            ? "Other volumes"
            : volume,
        onSelect: () => setCurrentVolume(volume),
      }))}
      initialSelection={initialSelection}
      disabled={loading}
      size="small"
    />
  );

  if (loading) {
    return (
      <TitledSection
        title={
          <span>
            Chapters list <CircularProgress size={18} />
          </span>
        }
        primaryAction={primaryAction}
      />
    );
  }

  if (chapters.length === 0) {
    return <TitledSection title="No chapters were found yet" />;
  }

  return (
    <>
      <TitledSection
        title={`Chapters list (${data?.chapters.total})`}
        primaryAction={primaryAction}
        tagsDescription="Filter by language"
        tags={existingLocales.map((locale) => ({
          content: localeName(locale),
          onClick: () => {
            setCurrentLocale((cl) => (cl === locale ? null : locale));
          },
        }))}
        selectedTag={currentLocale ? localeName(currentLocale) : null}
      />
      <ChaptersGrid
        chaptersResponse={chapters}
        renderItem={(chapter) => (
          <ViewMangaTableRow chapter={chapter} manga={manga} />
        )}
      />
      {pagesCount > 1 && (
        <div className={classes.paginationRoot}>
          <Pagination
            disabled={loading}
            showFirstButton
            showLastButton
            count={pagesCount}
            page={page}
            onChange={(_, number) => setPage(number)}
          />
        </div>
      )}
    </>
  );
}
