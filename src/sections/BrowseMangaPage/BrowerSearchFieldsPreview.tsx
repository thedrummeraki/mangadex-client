import { Chip } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { MangaSearchOptions, MangaTag } from "types";
import { filterObject, useCustomHistory } from "utils";

interface Props {
  searchOptions: Partial<MangaSearchOptions>;
  tags: MangaTag[];
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
  { key: "includedTags", description: "Tag" },
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
      margin: theme.spacing(1, -1, 0),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

export function BrowseSearchFieldsPreview({ searchOptions, tags }: Props) {
  const classes = useStyles();
  const { pushToHistory } = useCustomHistory();
  const [chipData, setChipData] = useState<ChipData[]>([]);

  useEffect(() => {
    const filteredOptions = filterObject(searchOptions);
    // pushToHistory(filteredOptions);

    const data: ChipData[] = [];
    Object.entries(filteredOptions).forEach((entry) => {
      const key = entry[0];
      const entryValue = entry[1];

      if (Array.isArray(entryValue) && entryValue.length > 0) {
        // entryValue.forEach((value) => {
        //   data.push({ key: `${key}-${value}`, label: value });
        // });
        entryValue.forEach((value) => {
          if (key === "includedTags" || key === "excludedTags") {
            const tagName = (value as MangaTag).attributes.name.en;
            data.push({ key, label: getChipLabel(key, tagName) });
          } else {
            data.push({ key, label: getChipLabel(key, String(value)) });
          }
        });
      } else if (typeof entryValue === "string") {
        data.push({ key, label: getChipLabel(key, entryValue) });
      } else if (typeof entryValue === "object") {
        Object.entries(entryValue).forEach((value) => {
          const key = `${value[0]}-${value[1]}`;
          const label = `${value[0]}: ${value[1]}`;

          data.push({ key, label });
        });
      }
    });

    setChipData(data.reverse());
  }, [searchOptions, pushToHistory, tags]);

  return chipData.length > 0 ? (
    <ul className={classes.root}>
      {chipData.map((data) => (
        <li key={data.key}>
          <Chip
            label={data.label}
            size="small"
            // onDelete={data.label === 'React' ? undefined : handleDelete(data)}
            className={classes.chip}
          />
        </li>
      ))}
    </ul>
  ) : null;
}
