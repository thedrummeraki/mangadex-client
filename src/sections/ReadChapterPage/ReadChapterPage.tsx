import { Chapter } from "types/chapter";
import { Page, ChapterReader } from "components";
import {
  chapterTitle,
  useLocalCurrentlyReading,
  useSearchMangaList,
} from "helpers";
import { useEffect, useMemo } from "react";

interface Props {
  chapter: Chapter;
  mangaId: string;
}

export function ReadChapterPage({ chapter, mangaId }: Props) {
  const { setCurrentlyReading } = useLocalCurrentlyReading({ manga: mangaId });
  const {
    mangaList,
    loading: mangaLoading,
    searchManga,
  } = useSearchMangaList({ limit: 1 });

  const manga = useMemo(() => {
    if (mangaList.results?.length) {
      return mangaList.results[0];
    }
    return null;
  }, [mangaList]);

  setCurrentlyReading({ chapter, manga: mangaId });

  const pageData = chapter.attributes.dataSaver;
  const pageURLs = pageData.map((_, index) =>
    ["https://mangadex-client-proxy.herokuapp.com", "at-home", "img"]
      .join("/")
      .concat(`?chapterId=${chapter.id}&page=${index + 1}`)
  );

  useEffect(() => {
    if (!manga && !mangaLoading) {
      searchManga({ ids: [mangaId] });
    }
  }, [manga, mangaLoading, searchManga, mangaId]);

  if (!manga) {
    return null;
  }

  return (
    <ChapterReader
      chapter={chapter}
      manga={manga.data}
      offset={2}
      pageUrls={pageURLs}
      onPrevious={() => {}}
      onNext={() => {}}
    />
  );
}
