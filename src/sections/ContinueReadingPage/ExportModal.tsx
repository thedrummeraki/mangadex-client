import {
  Button,
  FormControl,
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

export function ExportModal({ open, onClose }: Props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const { exportHistory } = useLocalCurrentlyReading();

  return (
    <BasicModal open={open} onClose={onClose}>
      <TitledSection title="Export your reading history" />
      <Typography>
        This will export every manga in your reading history.
      </Typography>
      <form noValidate autoComplete="off" className={classes.root}>
        <FormControl>
          <OutlinedInput
            id="optional-password"
            type="password"
            value={password}
            placeholder="Password (optional)"
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => {
              if (exportHistory) {
                const exported = exportHistory(password);
                saveTextAsFile(exported, "mangadex-client.exported.txt");
              }
            }}
          >
            Export now
          </Button>
        </FormControl>
      </form>
    </BasicModal>
  );
}
