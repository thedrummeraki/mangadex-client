import { Thumbnail } from "components/Thumbnail/Thumbnail";
import { useAtHome } from "sections/ViewManga/useAtHome";
import { Chapter } from "types/chapter";

interface Props {
  chapter: Chapter;
}

export function ChapterThumbnail({ chapter }: Props) {
  const serverUrl = useAtHome(chapter);

  if (!serverUrl) {
    return null;
  }

  const path = [
    "data",
    chapter.attributes.hash,
    chapter.attributes.dataSaver[0],
  ].join("/");

  console.log("serverUrl", serverUrl);
  console.log("built", new URL(`${serverUrl}/${path}`).toString());

  return (
    <Thumbnail
      title={chapter.attributes.title}
      img={new URL(`${serverUrl}/${path}`).toString()}
      onClick={() => {}}
    />
  );
}
