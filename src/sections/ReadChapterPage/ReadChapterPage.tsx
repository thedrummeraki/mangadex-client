import { ChapterReader } from "components";
import { SingleChapter, useGetMangaQuery } from "generated/graphql";
import { useLocalCurrentlyReading, useSearchMangaList } from "helpers";
import { useEffect, useMemo } from "react";

interface Props {
  chapter: SingleChapter;
}

// TODO: Rename to ViewChapterPage (to stay consistent)
export function ReadChapterPage({ chapter }: Props) {
  const { setCurrentlyReading } = useLocalCurrentlyReading({
    manga: chapter.mangaId,
  });
  const { data } = useGetMangaQuery({ variables: { id: chapter.mangaId } });

  const manga = data?.manga;

  // setCurrentlyReading({ chapter, manga: chapter.mangaId });

  const pageData = chapter.attributes.dataSaver;
  const pageURLs = pageData.map((_, index) =>
    ["https://mangadex-client-proxy.herokuapp.com", "at-home", "img"]
      .join("/")
      .concat(`?chapterId=${chapter.id}&page=${index + 1}`)
  );

  if (!manga) {
    return null;
  }

  return (
    <p>Reading {chapter.attributes.title}</p>
    // <ChapterReader
    //   chapter={chapter}
    //   manga={manga}
    //   offset={2}
    //   pageUrls={pageURLs}
    //   onPrevious={() => {}}
    //   onNext={() => {}}
    // />
  );
}
