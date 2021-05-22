import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { chapterTitle, mangaTitle } from "helpers";
import { DateTime } from "luxon";
import { ReactNode } from "react";
import { Chapter, GenericResponse, Manga } from "types";
import { localizedDateTime } from "utils";
import CustomGrid from "./CustomGrid";
import { Link } from "./Link";
import { ChapterThumbnail } from "./Thumbnails/ChapterThumbnail";

interface Props {
  chaptersResponse: Array<GenericResponse<Chapter>>;
  manga?: Manga;
  showManga?: boolean;
  renderItem: (chapter: Chapter) => ReactNode;
}

export function ChaptersGrid({
  chaptersResponse,
  manga,
  showManga,
  renderItem,
}: Props) {
  return (
    // <CustomGrid>
    //   {chaptersResponse.map((chapterInfo, index) => {
    //     return (
    //       <ChapterThumbnail
    //         index={index}
    //         chapterInfo={chapterInfo}
    //         manga={manga}
    //       />
    //     );
    //   })}
    // </CustomGrid>
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
          {chaptersResponse.map((chapterInfo) => renderItem(chapterInfo.data))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
