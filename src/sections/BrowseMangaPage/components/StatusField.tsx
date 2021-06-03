import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { MangaStatus } from "types";
import { SearchFieldProps } from "./types";

export function StatusField({
  value: statuses,
  onChange,
}: SearchFieldProps<MangaStatus[]>) {
  return (
    <FormControl variant="outlined" size="small" style={{ width: "100%" }}>
      <InputLabel id="status-label">Manga status</InputLabel>
      <Select
        multiple
        labelId="status-label"
        value={statuses}
        onChange={(event) => onChange(event.target.value as MangaStatus[])}
        label="Manga status"
      >
        <MenuItem value={MangaStatus.ongoing}>Ongoing</MenuItem>
        <MenuItem value={MangaStatus.completed}>Completed</MenuItem>
        <MenuItem value={MangaStatus.hiatus}>Hiatus</MenuItem>
        <MenuItem value={MangaStatus.cancelled}>Cancelled</MenuItem>
      </Select>
    </FormControl>
  );
}
