import BBCode from "@bbob/react/es/Component";
import reactPreset from "@bbob/preset-react";
import { Button, makeStyles } from "@material-ui/core";
import { decodeHTML } from "utils";
import { useCallback, useEffect, useRef, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "& spoiler": {
      ...theme.custom.noSelect,
      ...theme.custom.clampedTitle,
      display: "inline",
      backgroundColor: "#000",
    },
  },
  showing: {
    backgroundColor: "#fff !important",
  },
  showSpoilers: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(2),
  },
  hideSpoilersButton: {
    backgroundColor: theme.palette.success.light,
  },
  hideCancelButton: {
    backgroundColor: theme.palette.warning.light,
  },
}));

export function BBDescription({ description }) {
  const classes = useStyles();
  const [showSpoilers, setShowSpoilers] = useState(false);

  const hasSpoilers = useRef(false);

  useEffect(() => {
    hasSpoilers.current = document.querySelectorAll("spoiler").length > 0;
  }, []);

  useEffect(() => {
    const spoilerElements = document.querySelectorAll("spoiler");
    spoilerElements.forEach((spoilerElement) => {
      if (showSpoilers) {
        spoilerElement.classList.add(classes.showing);
      } else {
        spoilerElement.classList.remove(classes.showing);
      }
    });
  }, [showSpoilers]);

  return (
    <div className={classes.root}>
      <BBCode
        plugins={[reactPreset()]}
        options={{
          onlyAllowTags: ["i", "b", "u", "hr", "url", "spoiler"],
        }}
      >
        {decodeHTML(description)}
      </BBCode>
      <div className={classes.showSpoilers} style={{ width: "100%" }}>
        {hasSpoilers.current && !showSpoilers && (
          <Button
            onClick={() => setShowSpoilers(true)}
            color="secondary"
            variant="contained"
          >
            Spoiler alert! I can handle the truth.
          </Button>
        )}
        {hasSpoilers.current && showSpoilers && (
          <Button
            onClick={() => setShowSpoilers(false)}
            variant="contained"
            className={classes.hideSpoilersButton}
          >
            Hide spoilers
          </Button>
        )}
      </div>
    </div>
  );
}
