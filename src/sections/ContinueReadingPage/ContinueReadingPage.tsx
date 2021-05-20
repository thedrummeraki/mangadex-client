import { CustomGrid } from "components";
import { MangaThumbnail } from "components/Thumbnails";
import { GenericResponse, Manga } from "types";

interface Props {
  mangas: GenericResponse<Manga>[];
}

export function ContinueReadingPage({ mangas }: Props) {
  return (
    <CustomGrid>
      {mangas.map((mangaData) => (
        <MangaThumbnail
          key={mangaData.data.id}
          showContentRating
          manga={mangaData.data}
        />
      ))}
    </CustomGrid>
  );
}
