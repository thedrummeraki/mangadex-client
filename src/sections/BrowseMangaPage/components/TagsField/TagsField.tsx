import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useTags from "helpers/useTags";
import { GenericResponse, MangaTag } from "types";
import { SearchFieldProps } from "../types";

interface Option extends MangaTag {
  firstLetter: string;
}

export default function TagsField({
  title,
  value,
  onChange,
}: SearchFieldProps<MangaTag[], { title: string }>) {
  const { loading, tags } = useTags();

  return (
    <Autocomplete
      id="tags-field"
      multiple
      disableCloseOnSelect
      limitTags={1}
      value={asOptions(value)}
      options={asOptions(tags.map((tag) => tag.data)).sort(
        (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
      )}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      disabled={loading}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.attributes.name.en}
      renderInput={(params) => <TextField {...params} label={title} />}
    />
  );
}

function asOptions(values: MangaTag[]) {
  const options: Option[] = values.map((option) => {
    const title = option.attributes.name;
    const defaultLocale = Object.entries(title)[0][0];
    const firstLetter = title[defaultLocale][0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  return options;
}
