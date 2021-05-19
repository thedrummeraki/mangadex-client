import { Grid } from "@material-ui/core";
import { useCallback } from "react";
import { SearchState } from "types";
import { ContentRatingField, QuerySearchField } from "./components";

interface Props {
  searchOptions: SearchState;
  onChange: (options: SearchState) => void;
}

export function BrowseSearchFields({ searchOptions, onChange }: Props) {
  const updateSearchOptions = useCallback(
    (record: Partial<SearchState>) => {
      onChange({ ...searchOptions, ...record });
    },
    [searchOptions, onChange]
  );

  return (
    <Grid container spacing={1}>
      <Grid item>
        <QuerySearchField
          value={searchOptions.title}
          onChange={(newTitle) => updateSearchOptions({ title: newTitle })}
        />
      </Grid>
      <Grid item>
        <ContentRatingField
          value={searchOptions.contentRating}
          onChange={(newContentRatings) =>
            onChange({ ...searchOptions, contentRating: newContentRatings })
          }
        />
      </Grid>
    </Grid>
  );
}
