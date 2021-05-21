import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useSearchAuthors from "helpers/useSearchAuthors";
import { useEffect, useState } from "react";
import { Author } from "types/authors";
import { useDebouncedValue } from "utils";
import { SearchFieldProps } from "./types";

export function AuthorsField({ value, onChange }: SearchFieldProps<Author[]>) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const query = useDebouncedValue(input, 500);

  const { authors, loading, searchAuthors } = useSearchAuthors({ limit: 100 });

  useEffect(() => {
    if (query.trim().length > 0) {
      searchAuthors({ name: query });
    }
  }, [searchAuthors, query]);

  return (
    <Autocomplete
      id="fetch-authors"
      style={{ width: "100%" }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionSelected={(option, value) => option.data.id === value.data.id}
      getOptionLabel={(option) => option.data.attributes.name}
      options={authors}
      loading={loading}
      onChange={(_, newValue) => {
        if (newValue != null) {
          onChange([...value, newValue.data]);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Authors"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          InputProps={{
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
