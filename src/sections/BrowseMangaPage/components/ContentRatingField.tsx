import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { ContentRating } from "types";
import { SearchFieldProps } from "./types";

export function ContentRatingField({
  value: contentRatings,
  onChange,
}: SearchFieldProps<ContentRating[]>) {
  return (
    <FormControl variant="outlined" size="small" style={{ width: "100%" }}>
      <InputLabel id="content-rating-label">Content rating</InputLabel>
      <Select
        multiple
        labelId="content-rating-label"
        value={contentRatings}
        onChange={(event) => onChange(event.target.value as ContentRating[])}
        label="Content rating"
      >
        <MenuItem disabled>Content rating</MenuItem>
        <MenuItem value={ContentRating.safe}>Safe</MenuItem>
        <MenuItem value={ContentRating.suggestive}>Suggestive</MenuItem>
        <MenuItem value={ContentRating.erotica}>Erotica</MenuItem>
        <MenuItem value={ContentRating.pornographic}>Pornographic</MenuItem>
      </Select>
    </FormControl>
  );
}
