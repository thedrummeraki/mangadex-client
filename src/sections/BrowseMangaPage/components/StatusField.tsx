import { Select, MenuItem } from "@material-ui/core";
import { MangaStatus } from "types";
import { SearchFieldProps } from "./types";

export function StatusField({
  value: statuses,
  onChange,
}: SearchFieldProps<MangaStatus[]>) {
  return (
    <Select
      multiple
      value={statuses}
      onChange={(event) => onChange(event.target.value as MangaStatus[])}
      style={{ width: "100%" }}
    >
      <MenuItem value={MangaStatus.ongoing}>Ongoing</MenuItem>
      <MenuItem value={MangaStatus.completed}>Completed</MenuItem>
      <MenuItem value={MangaStatus.hiatus}>Hiatus</MenuItem>
      <MenuItem value={MangaStatus.cancelled}>Cancelled</MenuItem>
    </Select>
  );
}
