import { Chapter, GenericResponse, Manga } from "types";
import CustomGrid from "./CustomGrid";
import { ChapterThumbnail } from "./Thumbnails/ChapterThumbnail";

interface Props {
  chaptersResponse: Array<GenericResponse<Chapter>>;
  manga?: Manga;
}

export function ChaptersGrid({ chaptersResponse, manga }: Props) {
  return (
    <CustomGrid>
      {chaptersResponse.map((chapterInfo, index) => {
        return (
          <ChapterThumbnail
            index={index}
            chapterInfo={chapterInfo}
            manga={manga}
          />
        );
      })}
    </CustomGrid>
  );
}
