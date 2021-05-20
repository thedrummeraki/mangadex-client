import { AllowedIcons, AllowedIconsMap } from "./types";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DoneIcon from "@material-ui/icons/Done";

import useThumbnailStyles from "./useThumbnailStyles";

const iconsMaps: AllowedIconsMap = {
  play: <PlayArrowIcon />,
  done: <DoneIcon />,
};

interface Props {
  icons?: AllowedIcons[];
}

export function ThumbnailIcons({ icons }: Props) {
  const classes = useThumbnailStyles();

  if (icons == null) {
    return null;
  }

  return (
    <div className={classes.bottomIconsContainer}>
      {icons.map((iconName) => iconsMaps[iconName])}
    </div>
  );
}
