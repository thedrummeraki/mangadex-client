import { CustomGrid, Thumbnail } from "components";
import { Chapter, Manga, SingleManga } from "generated/graphql";
import { getFollowUrl, repeat } from "utils";
import ISO6391 from "iso-639-1";
import { ThumbnailSkeleton } from "components/Thumbnail/ThumbnailSkeleton";
import { chapterTitle } from "helpers";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { ViewMangaTableRow } from "./ViewMangaTableRow";

export enum DisplayStyle {
  Image = "Image",
  Grid = "Grid",
}

interface Props {
  manga: Manga | SingleManga;
  refetching: boolean;
  chapters: Chapter[];
  displayStyle?: DisplayStyle;
}

export function ChapterCustomGrid({
  manga,
  refetching,
  chapters,
  displayStyle = DisplayStyle.Image,
}: Props) {
  if (refetching) {
    if (displayStyle === DisplayStyle.Image) {
      return (
        <CustomGrid>
          {repeat(chapters.length, (index) => (
            <ThumbnailSkeleton key={`refetching-chapter-thumb-${index}`} />
          ))}
        </CustomGrid>
      );
    } else {
      return null;
    }
  }

  if (displayStyle === DisplayStyle.Image) {
    return (
      <CustomGrid>
        {chapters.map((chapter) => {
          const { dataSaver, chapterHash, translatedLanguage, volume } =
            chapter.attributes;
          const filename = dataSaver[0];
          const img = [
            "https://uploads.mangadex.org",
            "data-saver",
            chapterHash,
            filename,
          ].join("/");

          const pagesCount =
            dataSaver.length === 1 ? "1 page" : `${dataSaver.length} pages`;

          return (
            <Thumbnail
              features={[
                volume ? `Vol. ${volume}` : null,
                ISO6391.getName(translatedLanguage.split("-")[0]),
                pagesCount,
              ]}
              img={img}
              url={getFollowUrl(`/manga/read/${chapter.id}`)}
              title={chapterTitle(chapter, true)}
            />
          );
        })}
      </CustomGrid>
    );
  }

  return (
    <TableContainer>
      <Table aria-label="chapters list">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "65%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Chapter</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chapters.map((chapter) => (
            <ViewMangaTableRow chapter={chapter} manga={manga} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
