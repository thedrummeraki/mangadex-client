import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { CustomGrid, Thumbnail, TitledSection } from "components";
import { chapterTitle } from "helpers";
import { useEffect } from "react";
import { Manga } from "types";
import { timeAgo, useCurrentBreakpoint } from "utils";
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
      <CustomGrid>
        {data?.chapters.results.map((chapterInfo, index) => {
          const {
            data: {
              attributes: { publishAt, data, volume },
            },
          } = chapterInfo;
          const publishedTimeAgo = timeAgo(publishAt);
          const pagesCount =
            data.length === 1 ? "1 page" : `${data.length} pages`;

          const volumeText = volume != null ? `Vol. ${volume}` : null;

          return (
            <Thumbnail
              features={[volumeText || publishedTimeAgo, pagesCount]}
              title={`${index + 1}) ${chapterTitle(chapterInfo.data)}`}
              img="https://picsum.photos/185/265"
              url={`/manga/read/${chapterInfo.data.id}`}
            />
          );
        })}
      </CustomGrid>
    </>
  );
}
