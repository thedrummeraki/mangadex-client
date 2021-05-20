import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { PublicationDemographic } from "types";
import { SearchFieldProps } from "./types";

export function PublicationDemographicField({
  value: statuses,
  onChange,
}: SearchFieldProps<PublicationDemographic[]>) {
  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel>Demographic</InputLabel>
      <Select
        multiple
        value={statuses}
        onChange={(event) =>
          onChange(event.target.value as PublicationDemographic[])
        }
      >
        <MenuItem value={PublicationDemographic.none}>None</MenuItem>
        <MenuItem value={PublicationDemographic.josei}>Josei</MenuItem>
        <MenuItem value={PublicationDemographic.seinen}>Seinen</MenuItem>
        <MenuItem value={PublicationDemographic.shonen}>Shounen</MenuItem>
        <MenuItem value={PublicationDemographic.shoujo}>Shoujo</MenuItem>
      </Select>
    </FormControl>
  );
}
