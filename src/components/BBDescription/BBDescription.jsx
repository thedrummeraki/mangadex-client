import BBCode from "@bbob/react/es/Component";
import reactPreset from "@bbob/preset-react/es";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { decodeHTML } from "utils";

const useStyles = makeStyles(() => ({
  root: {
    spoiler: {
      color: "red",
    },
  },
}));

export function BBDescription({ description }) {
  const classes = useStyles();

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
    </div>
  );
}
