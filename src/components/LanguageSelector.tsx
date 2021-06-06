import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";
import ISO6391 from "iso-639-1";
import { TextField } from "@material-ui/core";

interface Props {
  defaultLocale?: string;
  onLocaleChange?: (locales: string[]) => void;
}

export default function LanguageSelector({
  onLocaleChange,
  defaultLocale = "en",
}: Props) {
  const [locales, setLocales] = useState([defaultLocale]);

  return (
    <Autocomplete
      id="language-field"
      multiple
      limitTags={2}
      size="small"
      value={locales}
      options={ISO6391.getAllCodes()}
      onChange={(_, newValue) => {
        if (newValue) {
          setLocales(newValue);
          if (onLocaleChange) {
            onLocaleChange(newValue);
          }
        }
      }}
      getOptionLabel={(option) => ISO6391.getName(option)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={locales.length === 0 ? "Read any language" : "Read in..."}
        />
      )}
    />
  );
}
