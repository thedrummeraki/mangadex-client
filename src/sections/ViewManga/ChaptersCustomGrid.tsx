import { CustomGrid, Thumbnail } from "components";
import { Chapter } from "generated/graphql";
import { getFollowUrl, repeat } from "utils";
import ISO6391 from "iso-639-1";
import { ThumbnailSkeleton } from "components/Thumbnail/ThumbnailSkeleton";

interface Props {
  refetching: boolean;
  chapters: Chapter[];
}

export function ChapterCustomGrid({ refetching, chapters }: Props) {
  if (refetching) {
    return (
      <CustomGrid>
        {repeat(chapters.length, (index) => (
          <ThumbnailSkeleton key={`refetching-chapter-thumb-${index}`} />
        ))}
      </CustomGrid>
    );
  }

  return (
    <CustomGrid>
      {chapters.map((chapter) => {
        const {
          dataSaver,
          chapterHash,
          title,
          translatedLanguage,
          chapter: number,
          volume,
        } = chapter.attributes;
        const filename = dataSaver[0];
        const img = [
          "https://uploads.mangadex.org",
          "data-saver",
          chapterHash,
          filename,
        ].join("/");

        const pagesCount =
          dataSaver.length === 1 ? "1 page" : `${dataSaver.length} pages`;

        return (
          <Thumbnail
            features={[
              volume ? `Vol. ${volume}` : null,
              ISO6391.getName(translatedLanguage.split("-")[0]),
              pagesCount,
            ]}
            img={img}
            url={getFollowUrl(`/manga/read/${chapter.id}`)}
            title={`${number}) ${title || `Chapter ${number}`}`}
          />
        );
      })}
    </CustomGrid>
  );
}
