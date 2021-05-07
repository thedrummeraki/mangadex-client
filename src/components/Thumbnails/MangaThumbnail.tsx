import { Thumbnail } from "components";
import { Manga } from "types";

interface Props {
  manga: Manga;
}

export function MangaThumbnail({ manga }: Props) {
  return (
    <Thumbnail
      img="#"
      title={manga.attributes.title.en}
      url={`/manga/${manga.id}`}
    />
  );
}
