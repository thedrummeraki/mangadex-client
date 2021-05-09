import { notEmpty } from "utils";
import { ThumbnailProps } from "./types";
import useThumbnailStyles from "./useThumbnailStyles";

export function ThumbnailFeatures({
  features,
}: Pick<ThumbnailProps, "features">) {
  const classes = useThumbnailStyles();

  if (!features || features.length < 1) {
    return null;
  }

  return (
    <div className={classes.showShowPropContainer}>
      {features
        .map((feature) =>
          feature ? (
            <span key={`feature-${feature}`} className={classes.showShowProp}>
              {feature}
            </span>
          ) : null
        )
        .filter(notEmpty)}
    </div>
  );
}
