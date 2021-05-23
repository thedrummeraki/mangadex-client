import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { ReactNode } from "react";
import { Chapter, GenericResponse } from "types";

interface Props {
  chaptersResponse: Array<GenericResponse<Chapter>>;
  renderItem: (chapter: Chapter) => ReactNode;
}

export function ChaptersGrid({ chaptersResponse, renderItem }: Props) {
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
          {chaptersResponse.map((chapterInfo) => renderItem(chapterInfo.data))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
