import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { chapterTitle } from "helpers";
import { Chapter, GenericResponse, Manga } from "types";
import CustomGrid from "./CustomGrid";
import { ChapterThumbnail } from "./Thumbnails/ChapterThumbnail";

interface Props {
  chaptersResponse: Array<GenericResponse<Chapter>>;
  manga?: Manga;
}

export function ChaptersGrid({ chaptersResponse, manga }: Props) {
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
          <col style={{ width: "5%" }} />
          <col style={{ width: "60%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Volume</TableCell>
            <TableCell>Chapter</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chaptersResponse.map((chapterInfo) => (
            <TableRow key={chapterInfo.data.id}>
              <TableCell>{chapterInfo.data.attributes.volume}</TableCell>
              <TableCell>{chapterInfo.data.attributes.chapter}</TableCell>
              <TableCell>{chapterTitle(chapterInfo.data)}</TableCell>
              <TableCell align="right">
                {chapterInfo.data.attributes.publishAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
