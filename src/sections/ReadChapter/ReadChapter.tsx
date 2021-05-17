import { Chapter } from "types/chapter";
import { Page, ChapterReader } from "components";
import { chapterTitle, useLocalCurrentlyReading } from "helpers";

interface Props {
  chapter: Chapter;
  mangaId: string;
}

export function ReadChapter({ chapter, mangaId }: Props) {
  const { setCurrentlyReading } = useLocalCurrentlyReading({ manga: mangaId });

  setCurrentlyReading({ chapter, manga: mangaId });

  const pageData = chapter.attributes.dataSaver;
  const pageURLs = pageData.map((data, index) =>
    ["http://localhost:3001", "at-home", "img"]
      .join("/")
      .concat(
        `?chapterId=${chapter.id}&page=${index + 1}&cache=true&duration=1`
      )
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
