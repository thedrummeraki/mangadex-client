import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useTags from "helpers/useTags";
import { GenericResponse, MangaTag } from "types";
import { SearchFieldProps } from "../types";

interface Option extends GenericResponse<MangaTag> {
  firstLetter: string;
}

export default function TagsField({
  value,
  onChange,
}: SearchFieldProps<GenericResponse<MangaTag>[]>) {
  const { loading, tags } = useTags();

  return (
    <Autocomplete
      id="tags-field"
      multiple
      disableCloseOnSelect
      limitTags={1}
      value={asOptions(value)}
      options={asOptions(tags).sort(
        (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
      )}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      disabled={loading}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.data.attributes.name.en}
      renderInput={(params) => <TextField {...params} label="Tags" />}
    />
  );
}

function asOptions(values: GenericResponse<MangaTag>[]) {
  const options: Option[] = values.map((option) => {
    const title = option.data.attributes.name;
    const defaultLocale = Object.entries(title)[0][0];
    const firstLetter = title[defaultLocale][0].toUpperCase();

    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  return options;
}
