import { Thumbnail } from "components";
import { preferredTitle } from "helpers";
import { Manga } from "types";

interface Props {
  manga: Manga;
  chaptersCount?: number;
  showContentRating?: boolean;
}

export function MangaThumbnail({
  chaptersCount,
  manga,
  showContentRating,
}: Props) {
  const {
    attributes: { title, year, status },
  } = manga;

  const chaptersCountFeature =
    chaptersCount == null
      ? null
      : chaptersCount === 1
      ? "1 chapter"
      : chaptersCount > 0
      ? `${chaptersCount} chapters`
      : null;

  return (
    <Thumbnail
      img="#"
      follow
      title={preferredTitle(title)}
      features={[
        year ? String(year) : null,
        status,
        chaptersCountFeature,
        showContentRating ? manga.attributes.contentRating : null,
      ]}
      url={`/manga/${manga.id}`}
    />
  );
}
