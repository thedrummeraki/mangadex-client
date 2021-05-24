import { CustomGrid } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { MangaThumbnail } from "components/Thumbnails";
import { GenericResponse, Manga } from "types";

interface Props {
  mangas: GenericResponse<Manga>[];
}

export function ContinueReadingPage({ mangas }: Props) {
  return <MangaCustomGrid mangasInfo={mangas} />;
}
