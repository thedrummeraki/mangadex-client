import {
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import { TitledSection } from "components";
import BasicModal from "components/modals/BasicModal";
import { useLocalCurrentlyReading } from "helpers";
import { useState } from "react";
import { saveTextAsFile } from "utils";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "100%",
      margin: theme.spacing(1, 0),
    },
  },
  inputIcon: {},
  inputWrapper: {
    flexBasis: 1,
  },
  fullWidth: {
    width: "100%",
  },
}));

export function ImportModal({ open, onClose }: Props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { importHistory } = useLocalCurrentlyReading();

  return (
    <BasicModal open={open} onClose={onClose}>
      <TitledSection title="Export your reading history" />
      <Typography>Import your reading history from another device!</Typography>
      <form noValidate autoComplete="off" className={classes.root}>
        <FormControl error={Boolean(error)}>
          <OutlinedInput
            id="optional-password"
            type="password"
            value={password}
            placeholder="Password (optional)"
            onChange={(event) => setPassword(event.target.value)}
          />
          {error && (
            <FormHelperText id="import-error-text">{error}</FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <Button
            size="large"
            variant="contained"
            color="primary"
            component="label"
          >
            Import file...
            <input
              hidden
              type="file"
              onChange={(event) => {
                setError("");
                console.log(event.target.files);
                const files = event.target.files;
                if (files && files.length > 0 && importHistory) {
                  const file = files[0];
                  file
                    .text()
                    .then((fileContent) => {
                      const readingHistory = importHistory(
                        fileContent,
                        password
                      );
                      console.log(readingHistory);
                    })
                    .catch(() =>
                      setError(
                        password
                          ? "Your password is invalid."
                          : "This file was not valid or is password-protected."
                      )
                    )
                    .finally(() => setPassword(""));
                }
              }}
            />
          </Button>
        </FormControl>
      </form>
    </BasicModal>
  );
}
