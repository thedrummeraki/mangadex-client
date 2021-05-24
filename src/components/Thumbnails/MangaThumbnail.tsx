import { Thumbnail } from "components";
import { AllowedIcons } from "components/Thumbnail/types";
import {
  DisplayCoverSize,
  getCoverUrl,
  isExplicit,
  preferredTitle,
  useLocalCurrentlyReading,
} from "helpers";
import { Cover, Manga } from "types";

interface Props {
  manga: Manga;
  cover?: Cover;
  chaptersCount?: number;
  showContentRating?: boolean;
  showReading?: boolean;
}

export function MangaThumbnail({
  chaptersCount,
  manga,
  showContentRating,
  showReading,
  cover,
}: Props) {
  const {
    attributes: { title, year, status },
  } = manga;

  const { isReading } = useLocalCurrentlyReading({ manga });

  const chaptersCountFeature =
    chaptersCount == null
      ? null
      : chaptersCount === 1
      ? "1 chapter"
      : chaptersCount > 0
      ? `${chaptersCount} chapters`
      : null;

  const icons: AllowedIcons[] = [];
  if (isReading) icons.push("play");

  const img = cover
    ? getCoverUrl(manga, cover.attributes.fileName, DisplayCoverSize.Thumb256)
    : "";

  return (
    <Thumbnail
      img={img}
      follow
      explicit={isExplicit(manga, { conservative: false })}
      title={preferredTitle(title)}
      features={[
        showReading && isReading ? "Reading" : null,
        year ? String(year) : null,
        status,
        chaptersCountFeature,
        showContentRating ? manga.attributes.contentRating : null,
      ]}
      icons={icons}
      url={`/manga/${manga.id}`}
    />
  );
}
