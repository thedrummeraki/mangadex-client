import { Select, MenuItem } from "@material-ui/core";
import { ContentRating } from "types";
import { SearchFieldProps } from "./types";

export function ContentRatingField({
  value: contentRatings,
  onChange,
}: SearchFieldProps<ContentRating[]>) {
  return (
    <Select
      multiple
      value={contentRatings}
      onChange={(event) => onChange(event.target.value as ContentRating[])}
      style={{ width: "100%" }}
    >
      <MenuItem disabled>Content rating</MenuItem>
      <MenuItem value={ContentRating.safe}>Safe</MenuItem>
      <MenuItem value={ContentRating.suggestive}>Suggestive</MenuItem>
      <MenuItem value={ContentRating.erotica}>Erotica</MenuItem>
      <MenuItem value={ContentRating.pornographic}>Pornographic</MenuItem>
    </Select>
  );
}
