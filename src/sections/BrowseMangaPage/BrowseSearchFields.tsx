import { Grid } from "@material-ui/core";
import { useCallback, useEffect, useState } from "react";
import {
  GenericResponse,
  MangaSearchOptions,
  MangaTag,
  SearchState,
} from "types";
import {
  ContentRatingField,
  TitleField,
  StatusField,
  PublicationDemographicField,
} from "./components";
import { BrowseSearchFieldsPreview } from "./BrowerSearchFieldsPreview";
import TagsField from "./components/TagsField/TagsField";
import useTags from "helpers/useTags";

export interface BrowseSearchFieldsProps {
  searchOnly?: boolean;
  searchOptions: SearchState;
  onChange: (options: SearchState) => void;
}

export function BrowseSearchFields({
  searchOnly,
  searchOptions,
  onChange,
}: BrowseSearchFieldsProps) {
  const { tags } = useTags();
  const updateSearchOptions = useCallback(
    (record: Partial<SearchState>) => {
      onChange({ ...searchOptions, ...record });
    },
    [searchOptions, onChange]
  );

  const [includedTags, setIncludedTags] = useState<GenericResponse<MangaTag>[]>(
    []
  );

  useEffect(() => {
    updateSearchOptions({
      includedTags: includedTags.map((tag) => tag.data.id),
    });
  }, [updateSearchOptions, includedTags]);

  if (searchOnly) {
    return (
      <div>
        <TitleField
          value={searchOptions.title}
          onChange={(title) => updateSearchOptions({ title })}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        marginBottom: 24,
        marginTop: -16,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md style={{ maxWidth: "20%" }}>
          <TitleField
            value={searchOptions.title}
            onChange={(title) => updateSearchOptions({ title })}
          />
        </Grid>
        <Grid item xs={12} md style={{ maxWidth: "20%" }}>
          <ContentRatingField
            value={searchOptions.contentRating}
            onChange={(newContentRatings) =>
              onChange({ ...searchOptions, contentRating: newContentRatings })
            }
          />
        </Grid>
        <Grid item xs={12} md style={{ maxWidth: "20%" }}>
          <StatusField
            value={searchOptions.status}
            onChange={(status) => updateSearchOptions({ status })}
          />
        </Grid>
        <Grid item xs={12} md style={{ maxWidth: "20%" }}>
          <PublicationDemographicField
            value={searchOptions.publicationDemographic}
            onChange={(publicationDemographic) =>
              updateSearchOptions({ publicationDemographic })
            }
          />
        </Grid>
        <Grid item xs={12} md style={{ maxWidth: "20%" }}>
          <TagsField
            value={includedTags}
            onChange={setIncludedTags}
            tags={tags}
          />
        </Grid>
      </Grid>
      <BrowseSearchFieldsPreview
        searchOptions={toPreviewableSearchState(
          searchOptions,
          tags.map((tag) => tag.data)
        )}
        tags={tags.map((tag) => tag.data)}
      />
    </div>
  );
}

function toPreviewableSearchState(
  options: Partial<SearchState>,
  tags: MangaTag[]
) {
  const searchState: Partial<MangaSearchOptions> = {
    ...options,
    includedTags: tags.filter((tag) => options.includedTags?.includes(tag.id)),
    excludedTags: tags.filter((tag) => options.excludedTags?.includes(tag.id)),
    authors: [],
    artists: [],
  };
  return searchState;
}
