import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { TitledSection } from "components";
import BasicModal from "components/modals/BasicModal";
import useLocalCurrentReadingHistoryManagament from "helpers/useLocalCurrentReadingHistoryManagament";
import { useMemo, useState } from "react";
import { saveTextAsFile } from "utils";

interface Props {
  open: boolean;
  onClose: VoidFunction;
}

type RadioOption = "no-password" | "with-password";

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

export function ExportModal({ open, onClose }: Props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [radioOption, setRadioOption] = useState<RadioOption>("no-password");
  const { exportHistory } = useLocalCurrentReadingHistoryManagament();

  const passwordProtected = useMemo(
    () => radioOption === "with-password",
    [radioOption]
  );

  return (
    <BasicModal open={open} onClose={onClose}>
      <TitledSection title="Export your reading history" />
      <FormControl component="fieldset">
        <FormLabel component="legend">Export options</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={radioOption}
          onChange={(_, value) => setRadioOption(value as RadioOption)}
        >
          <FormControlLabel
            value="no-password"
            control={<Radio />}
            label="No password"
          />
          <FormControlLabel
            value="with-password"
            control={<Radio />}
            label="Add a password"
          />
        </RadioGroup>
      </FormControl>

      <form noValidate autoComplete="off" className={classes.root}>
        {passwordProtected && (
          <FormControl>
            <OutlinedInput
              id="optional-password"
              type="password"
              value={password}
              placeholder="Password (optional)"
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
        )}
        <FormControl>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => {
              const exported = exportHistory(password);
              const timestamp = Math.floor(Date.now());

              saveTextAsFile(
                exported,
                passwordProtected && Boolean(password)
                  ? `mangadex-client.exported.protected.${timestamp}.txt`
                  : `mangadex-client.exported.${timestamp}.txt`
              );
            }}
          >
            Export now
          </Button>
        </FormControl>
      </form>
    </BasicModal>
  );
}
