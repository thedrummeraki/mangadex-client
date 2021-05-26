import { Chip, Paper } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { queryFriendlySearchState, toPreviewableSearchState } from "helpers";
import { useEffect, useState } from "react";
import { MangaSearchOptions } from "types";
import { filterObject, useCustomHistory } from "utils";

interface Props {
  searchOptions: MangaSearchOptions;
}

interface ChipData {
  key: string;
  label: string;
}

interface ChipDescription {
  key: keyof MangaSearchOptions;
  description: string;
}

const chipDescriptionMap: ChipDescription[] = [
  { key: "title", description: "Title contains" },
  { key: "contentRating", description: "Rating" },
  { key: "status", description: "Status" },
  { key: "includedTags", description: "With tags" },
  { key: "excludedTags", description: "Without tags" },
];

const getChipLabel = (key: string, entryValue: string) => {
  const description = chipDescriptionMap.find((map) => map.key === key);
  return description
    ? `${description.description}: "${entryValue}"`
    : entryValue;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: theme.spacing(2, 0),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

export function BrowseSearchFieldsPreview({ searchOptions }: Props) {
  const classes = useStyles();
  const { pushToHistory } = useCustomHistory();
  const [chipData, setChipData] = useState<ChipData[]>([]);

  useEffect(() => {
    const filteredSearchOptions = filterObject(searchOptions);
    const filteredOptions = toPreviewableSearchState(filteredSearchOptions);
    pushToHistory(queryFriendlySearchState(filteredSearchOptions));

    const data: ChipData[] = [];
    Object.entries(filteredOptions).forEach((entry) => {
      const key = entry[0];
      const entryValue = entry[1];

      if (Array.isArray(entryValue) && entryValue.length > 0) {
        // entryValue.forEach((value) => {
        //   data.push({ key: `${key}-${value}`, label: value });
        // });
        const finalEntryValue = entryValue.join(", ");
        data.push({ key, label: getChipLabel(key, finalEntryValue) });
      } else if (typeof entryValue === "string") {
        data.push({ key, label: getChipLabel(key, entryValue) });
      } else if (typeof entryValue === "object") {
        // Object.entries(entryValue).forEach((value) => {
        //   const key = `${value[0]}-${value[1]}`;
        //   const label = `${value[0]}: ${value[1]}`;
        //   data.push({ key, label });
        // });
      }
    });

    setChipData(data.reverse());
  }, [searchOptions, pushToHistory]);

  return chipData.length > 0 ? (
    <Paper component="ul" className={classes.root}>
      {chipData.map((data) => (
        <li key={data.key}>
          <Chip
            label={data.label}
            // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
            className={classes.chip}
          />
        </li>
      ))}
    </Paper>
  ) : null;
}
