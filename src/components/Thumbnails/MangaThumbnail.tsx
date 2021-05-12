import { Thumbnail } from "components";
import { preferredTitle } from "helpers";
import { Manga } from "types";

interface Props {
  manga: Manga;
  chaptersCount: number;
}

export function MangaThumbnail({ chaptersCount, manga }: Props) {
  const {
    attributes: { title, year, status },
  } = manga;

  const chaptersCountFeature =
    chaptersCount === 1
      ? "1 chapter"
      : chaptersCount > 0
      ? `${chaptersCount} chapters`
      : null;

  return (
    <Thumbnail
      img="#"
      title={preferredTitle(title)}
      features={[year ? String(year) : null, status, chaptersCountFeature]}
      url={`/manga/${manga.id}`}
    />
  );
}
