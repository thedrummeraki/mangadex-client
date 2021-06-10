import {
  FormControl,
  OutlinedInput,
  makeStyles,
  Button,
  FormHelperText,
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
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const { loginUser } = useLogin({
    onLogin: (response) => {
      setLoggedIn(Boolean(response));
      setLoading(false);
    },
  });

  const loginNow = () => {
    if (validEntry && !loading) {
      setLoading(true);
      setErrored(false);
      loginUser({ username, password })
        .then((response) => {
          if (!response) {
            setErrored(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setErrored(true);
        })
        .finally(() => setLoading(false));
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
      open={open && !loggedIn}
      onClose={onClose}
    >
      <form noValidate autoComplete="off" className={classes.root}>
        <FormControl error={errored}>
          <OutlinedInput
            id="username"
            type="username"
            value={username}
            placeholder="Your MangaDex username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </FormControl>
        <FormControl error={errored}>
          <OutlinedInput
            id="password"
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(event) => setPassword(event.target.value)}
          />
          {errored && (
            <FormHelperText id="component-error-text">
              Your username or password may not be valid.
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <Button
            disabled={loading || !validEntry}
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
