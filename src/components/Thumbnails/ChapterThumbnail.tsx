import { Thumbnail } from "components";
import { useAtHomeBaseUrl } from "sections/ViewManga/useAtHome";
import { Chapter } from "types/chapter";

interface Props {
  chapter: Chapter;
}

export function ChapterThumbnail({ chapter }: Props) {
  const serverUrl = useAtHomeBaseUrl(chapter);

  if (!serverUrl) {
    return null;
  }

  const path = [
    "data",
    chapter.attributes.hash,
    chapter.attributes.dataSaver[0],
  ].join("/");

  return (
    <Thumbnail
      title={chapter.attributes.title}
      img={new URL(`${serverUrl}/${path}`).toString()}
      onClick={() => {}}
    />
  );
}
