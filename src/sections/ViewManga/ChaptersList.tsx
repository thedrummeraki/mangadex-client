import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { ChaptersGrid, TitledSection } from "components";
import { useEffect } from "react";
import { Manga } from "types";
import { useCurrentBreakpoint } from "utils";
import GetChaptersForManga from "./queries/GetChaptersForManga";

interface Props {
  manga: Manga;
  onFirstChapterReady: (chapterId: string) => void;
}

export function ChaptersList({ manga, onFirstChapterReady }: Props) {
  const { data, loading, error } = useQuery(GetChaptersForManga, {
    variables: { mangaId: manga.id },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
    },
  });

  const bp = useCurrentBreakpoint();

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
      <TitledSection title={`Chapters list (${data?.chapters.total}) ${bp}`} />
      <ChaptersGrid chaptersResponse={data?.chapters.results || []} />
    </>
  );
}
