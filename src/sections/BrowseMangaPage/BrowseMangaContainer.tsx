import { Grid, MenuItem, Select, TextField } from "@material-ui/core";
import { useSearchMangaList } from "helpers";
import { useEffect } from "react";
import { ContentRating, SearchState } from "types";

interface Props {
  searchOptions: SearchState;
  onChange: (options: SearchState) => void;
}

export function BrowseMangaContainer({ searchOptions, onChange }: Props) {
  const { searchManga } = useSearchMangaList({ limit: 100 });

  useEffect(() => {
    searchManga(searchOptions);
  }, [searchOptions, searchManga]);

  return (
    <Grid container spacing={1}>
      <Grid item>
        <TextField placeholder="Title" />
      </Grid>
      <Grid item>
        <Select
          value={ContentRating.safe}
          onChange={(event) =>
            onChange({
              ...searchOptions,
              contentRating: [event.target.value as ContentRating],
            })
          }
        >
          <MenuItem value={ContentRating.safe}>Safe</MenuItem>
          <MenuItem value={ContentRating.suggestive}>Suggestive</MenuItem>
          <MenuItem value={ContentRating.erotica}>Erotica</MenuItem>
          <MenuItem value={ContentRating.pornographic}>Pornographic</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
}
