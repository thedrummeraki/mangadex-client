import { Chapter } from "types/chapter";
import { useAtHomeBaseUrl } from "sections/ViewManga/useAtHome";
import { Page, ChapterReader } from "components";
import { chapterTitle, useLocalCurrentlyReading } from "helpers";

interface Props {
  chapter: Chapter;
  mangaId: string;
}

export function ReadChapter({ chapter, mangaId }: Props) {
  const { atHomeBaseUrl, loading, error } = useAtHomeBaseUrl(chapter);
  const { setCurrentlyReading } = useLocalCurrentlyReading({ manga: mangaId });

  setCurrentlyReading({ chapter, manga: mangaId });

  if (!atHomeBaseUrl || loading || error) {
    return null;
  }

  const pageData = chapter.attributes.dataSaver;
  const pageURLs = pageData.map((data) =>
    [atHomeBaseUrl, "data-saver", chapter.attributes.hash, data].join("/")
  );

  return (
    <Page
      backUrl={`/manga/${mangaId}`}
      title={`You are reading: "${chapterTitle(chapter)}"`}
      badges={[
        chapter.attributes.volume !== null
          ? `Volume ${chapter.attributes.volume}`
          : null,
      ]}
    >
      <ChapterReader
        chapter={chapter}
        offset={2}
        pageUrls={pageURLs}
        onPrevious={() => {}}
        onNext={() => {}}
      />
    </Page>
  );
}
