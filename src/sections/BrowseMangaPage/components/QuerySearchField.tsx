import { FormControl, TextField } from "@material-ui/core";
import { SearchFieldProps } from "./types";

export function TitleField({ value, onChange }: SearchFieldProps<string>) {
  return (
    <FormControl style={{ width: "100%" }}>
      <TextField
        label="Manga title"
        variant="outlined"
        size="small"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormControl>
  );
}
