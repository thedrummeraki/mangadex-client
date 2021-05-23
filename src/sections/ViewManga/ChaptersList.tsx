import { useLazyQuery } from "@apollo/client";
import { Chip, CircularProgress, TableCell, TableRow } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChaptersGrid, Link, TitledSection } from "components";
import SplitButton from "components/SplitButton";
import { chapterTitle } from "helpers";
import { compareChapters } from "helpers/compare";
import { CompareDirection } from "helpers/compare/types";
import { DateTime } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chapter, GenericResponse, Manga } from "types";
import { getFollowUrl, localizedDateTime } from "utils";
import GetChaptersForManga from "./queries/GetChaptersForManga";

interface Props {
  manga: Manga;
  volumes: string[];
  currentVolume?: string | null;
  defaultLocale?: string | null;
  onFirstChapterReady: (chapterId: string) => void;
}

export function ChaptersList({
  manga,
  volumes,
  currentVolume: selectedCurrentVolume,
  onFirstChapterReady,
}: Props) {
  const [page, setPage] = useState(1);
  const [currentLocale, setCurrentLocale] = useState<string | null>(null);
  const [currentVolume, setCurrentVolume] = useState<string | null>(null);

  const currentVolumeInitialized = useRef(selectedCurrentVolume != null);

  useEffect(() => {
    if (!currentVolumeInitialized.current && volumes.length > 0) {
      setCurrentVolume(volumes[0]);
    }
  }, [volumes]);

  const [getChapters, { data, loading, error }] = useLazyQuery(
    GetChaptersForManga,
    {
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

  const showLocalesTags = existingLocales.length > 1;

  const chapters = useMemo(() => {
    if (data?.chapters.results && chaptersByLocale) {
      const result = currentLocale
        ? chaptersByLocale[currentLocale]
        : data.chapters.results;

      return [...result].sort(compareChapters(CompareDirection.ASC));
    }

    return [];
  }, [chaptersByLocale, data, currentLocale]);

  useEffect(() => {
    setCurrentLocale(existingLocales[0]);
  }, [existingLocales]);

  const pagesCount = useMemo(() => {
    const totalResults = data?.chapters.total;
    if (totalResults) {
      return Math.ceil(totalResults / 100);
    }

    return 1;
  }, [data]);

  useEffect(() => {
    if (currentVolume) {
      getChapters({
        variables: {
          mangaId: manga.id,
          orderChapter: "asc",
          volume: currentVolume,
        },
      });
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
          String(parseInt(volume)) !== "NaN" ? `Volume ${volume}` : volume,
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
        tags={
          showLocalesTags
            ? existingLocales.map((locale) => ({
                content: locale,
                onClick: () => setCurrentLocale(locale),
              }))
            : []
        }
        selectedTag={currentLocale}
      />
      <ChaptersGrid
        chaptersResponse={chapters}
        renderItem={(chapter) => (
          <TableRow key={chapter.id}>
            <TableCell>{chapter.attributes.chapter || "-"}</TableCell>
            <TableCell>
              <div>
                <Link to={getFollowUrl(`/manga/read/${chapter.id}`)}>
                  {chapterTitle(chapter)}{" "}
                </Link>
                {!showLocalesTags && (
                  <Chip
                    size="small"
                    variant="outlined"
                    color="secondary"
                    label={chapter.attributes.translatedLanguage}
                  />
                )}
                {chapter.attributes.volume && (
                  <Chip
                    label={`Volume ${chapter.attributes.volume}`}
                    size="small"
                    variant="outlined"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </div>
            </TableCell>
            <TableCell align="right">
              {localizedDateTime(
                chapter.attributes.publishAt,
                DateTime.DATE_FULL
              )}
            </TableCell>
          </TableRow>
        )}
      />
      <Pagination
        showFirstButton
        showLastButton
        count={pagesCount}
        page={page}
        onChange={(_, number) => setPage(number)}
      />
    </>
  );
}
