import { chapterTitle } from "helpers";
import { Chapter, GenericResponse } from "types";
import { timeAgo } from "utils";
import CustomGrid from "./CustomGrid";
import { Thumbnail } from "./Thumbnail";

interface Props {
  chaptersResponse: Array<GenericResponse<Chapter>>;
}

export function ChaptersGrid({ chaptersResponse }: Props) {
  return (
    <CustomGrid>
      {chaptersResponse.map((chapterInfo, index) => {
        const {
          data: {
            attributes: { publishAt, data, volume },
          },
        } = chapterInfo;
        const publishedTimeAgo = timeAgo(publishAt);
        const pagesCount =
          data.length === 1 ? "1 page" : `${data.length} pages`;

        const volumeText = volume != null ? `Vol. ${volume}` : null;

        return (
          <Thumbnail
            follow
            features={[volumeText || publishedTimeAgo, pagesCount]}
            title={`${index + 1}) ${chapterTitle(chapterInfo.data)}`}
            img="https://picsum.photos/185/265"
            url={`/manga/read/${chapterInfo.data.id}`}
          />
        );
      })}
    </CustomGrid>
  );
}
