import { TextField } from "@material-ui/core";
import { SearchFieldProps } from "./types";

export function QuerySearchField({
  value,
  onChange,
}: SearchFieldProps<string>) {
  return (
    <TextField
      value={value}
      placeholder="Manga title..."
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
