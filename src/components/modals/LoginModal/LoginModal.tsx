import {
  FormControl,
  OutlinedInput,
  makeStyles,
  Button,
} from "@material-ui/core";
import useLogin from "helpers/useLogin";
import { useMemo, useState } from "react";
import BasicModal from "../BasicModal";

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

export default function LoginModal({ open, onClose }: Props) {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser } = useLogin();

  const loginNow = () => {
    if (validEntry) {
      loginUser({ username, password });
    }
  };

  const validEntry = useMemo(
    () =>
      username.trim().length > 1 &&
      username.trim().length < 64 &&
      password.length >= 1,
    [username, password]
  );

  return (
    <BasicModal
      title="Sign in"
      description="Enter your MangaDex account credentials below."
      open={open}
      onClose={onClose}
    >
      <form noValidate autoComplete="off" className={classes.root}>
        <FormControl>
          <OutlinedInput
            id="username"
            type="username"
            value={username}
            placeholder="Your MangaDex username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <OutlinedInput
            id="password"
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <Button
            disabled={!validEntry}
            size="large"
            variant="contained"
            color="primary"
            onClick={loginNow}
          >
            Sign in
          </Button>
        </FormControl>
      </form>
    </BasicModal>
  );
}
