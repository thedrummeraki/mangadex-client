import { Grid } from "@material-ui/core";
import { useCallback } from "react";
import { SearchState } from "types";
import {
  ContentRatingField,
  TitleField,
  StatusField,
  PublicationDemographicField,
} from "./components";

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
      <Grid item xs={12} md={12} lg={3}>
        <TitleField
          value={searchOptions.title}
          onChange={(title) => updateSearchOptions({ title })}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <ContentRatingField
          value={searchOptions.contentRating}
          onChange={(newContentRatings) =>
            onChange({ ...searchOptions, contentRating: newContentRatings })
          }
        />
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <StatusField
          value={searchOptions.status}
          onChange={(status) => updateSearchOptions({ status })}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <PublicationDemographicField
          value={searchOptions.publicationDemographic}
          onChange={(publicationDemographic) =>
            updateSearchOptions({ publicationDemographic })
          }
        />
      </Grid>
    </Grid>
  );
}
