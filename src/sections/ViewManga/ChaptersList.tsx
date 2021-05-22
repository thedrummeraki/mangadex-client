import { useQuery } from "@apollo/client";
import { Chip, CircularProgress, TableCell, TableRow } from "@material-ui/core";
import { ChaptersGrid, Link, TitledSection } from "components";
import SplitButton from "components/SplitButton";
import { chapterTitle, mangaTitle } from "helpers";
import useGroupedChaptersByVolume from "helpers/useGroupedChaptersByVolume";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Manga } from "types";
import { localizedDateTime } from "utils";
import GetChaptersForManga from "./queries/GetChaptersForManga";

interface Props {
  manga: Manga;
  onFirstChapterReady: (chapterId: string) => void;
}

export function ChaptersList({ manga, onFirstChapterReady }: Props) {
  const { data, loading, error } = useQuery(GetChaptersForManga, {
    variables: { mangaId: manga.id, orderVolume: "asc" },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
    },
  });

  const {} = useGroupedChaptersByVolume(manga, {
    order: { chapter: "desc", volume: "desc" },
  });

  useEffect(() => {
    if (data?.chapters?.results?.length) {
      onFirstChapterReady(data?.chapters.results[0].data.id);
    }
  }, [onFirstChapterReady, data?.chapters]);

  if (error || data?.chapters?.result === "error") {
    return <TitledSection title="Error" />;
  }

  if (loading) {
    return (
      <TitledSection
        title={
          <span>
            Chapters list <CircularProgress size={18} />
          </span>
        }
      />
    );
  }

  if (!data?.chapters || !data?.chapters) {
    return <TitledSection title="No chapters were found yet" />;
  }

  return (
    <>
      <TitledSection
        title={`Chapters list (${data?.chapters.total})`}
        primaryAction={
          <SplitButton
            options={["All", "Sort by volume", "Latest first", "Only unread"]}
            size="small"
          />
        }
      />
      <ChaptersGrid
        chaptersResponse={data?.chapters.results || []}
        manga={manga}
        renderItem={(chapter) => (
          <TableRow key={chapter.id}>
            <TableCell>{chapter.attributes.chapter}</TableCell>
            <TableCell>
              <div>
                <Link to={`/manga/read/${chapter.id}`}>
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
              {manga && <div>{mangaTitle(manga)}</div>}
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
    </>
  );
}
