import { TextField } from "@material-ui/core";
import { SearchFieldProps } from "./types";

export function TitleField({ value, onChange }: SearchFieldProps<string>) {
  return (
    <TextField
      value={value}
      placeholder="Manga title..."
      onChange={(event) => onChange(event.target.value)}
      style={{ width: "100%" }}
    />
  );
}
