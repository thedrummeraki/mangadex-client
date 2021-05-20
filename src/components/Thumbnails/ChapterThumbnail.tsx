import { Thumbnail } from "components";
import { AllowedIcons } from "components/Thumbnail/types";
import { chapterTitle, useLocalCurrentlyReading } from "helpers";
import { savedPage } from "helpers/useCurrentlyReading";
import { GenericResponse, Manga } from "types";
import { Chapter } from "types/chapter";
import { timeAgo } from "utils";

interface Props {
  chapterInfo: GenericResponse<Chapter>;
  manga?: Manga;
  index?: number;
}

interface InternalProps {
  publishedTimeAgo: string | null;
  pagesCount: string;
  volumeText: string | null;
  title: string;
  img: string;
}

export function ChapterThumbnail({ chapterInfo, manga, index }: Props) {
  const {
    data: {
      attributes: { publishAt, data, volume },
    },
  } = chapterInfo;
  const publishedTimeAgo = timeAgo(publishAt);
  const pagesCount = data.length === 1 ? "1 page" : `${data.length} pages`;

  const volumeText = volume != null ? `Vol. ${volume}` : null;

  const title = index
    ? `${index + 1}) ${chapterTitle(chapterInfo.data)}`
    : chapterTitle(chapterInfo.data);

  if (manga) {
    return (
      <ThumbnailWithManga
        chapterInfo={chapterInfo}
        manga={manga}
        publishedTimeAgo={publishedTimeAgo}
        pagesCount={pagesCount}
        volumeText={volumeText}
        title={title}
        img="https://picsum.photos/185/265"
      />
    );
  } else {
    return (
      <BasicThumbnail
        chapterInfo={chapterInfo}
        publishedTimeAgo={publishedTimeAgo}
        pagesCount={pagesCount}
        volumeText={volumeText}
        title={title}
        img="https://picsum.photos/185/265"
      />
    );
  }
}

function ThumbnailWithManga({
  manga,
  volumeText,
  publishedTimeAgo,
  pagesCount,
  title,
  img,
  chapterInfo,
}: Required<Omit<Props, "index">> & InternalProps & { index?: number }) {
  const { isReadingChapter } = useLocalCurrentlyReading({
    chapter: chapterInfo.data.id,
    manga,
  });

  const isDone =
    savedPage(chapterInfo.data) >= chapterInfo.data.attributes.data.length - 1;

  const icons: AllowedIcons[] = [];
  if (isReadingChapter && !isDone) icons.push("play");
  if (isDone) icons.push("done");

  return (
    <Thumbnail
      features={[volumeText || publishedTimeAgo, pagesCount]}
      title={title}
      img={img}
      icons={icons}
      url={`/manga/read/${chapterInfo.data.id}`}
    />
  );
}

function BasicThumbnail({
  volumeText,
  publishedTimeAgo,
  pagesCount,
  img,
  title,
  chapterInfo,
}: Omit<Props, "manga"> & InternalProps) {
  return (
    <Thumbnail
      features={[volumeText || publishedTimeAgo, pagesCount]}
      title={title}
      img={img}
      url={`/manga/read/${chapterInfo.data.id}`}
    />
  );
}
