import clsx from "clsx";
import { notEmpty } from "utils";
import { ThumbnailProps } from "./types";
import useThumbnailStyles from "./useThumbnailStyles";

interface Feature {
  content: string;
  className: string;
}

export function ThumbnailFeatures({
  features,
  explicit,
}: Pick<ThumbnailProps, "features" | "explicit">) {
  const classes = useThumbnailStyles();

  const chosenFeatures: Feature[] = [];
  if (explicit) {
    chosenFeatures.push({
      content: "E",
      className: clsx(classes.showShowProp, classes.explicitFeature),
    });
  }

  if (features) {
    features.forEach((feature) => {
      if (!feature) {
        return;
      }

      chosenFeatures.push({
        content: feature,
        className: classes.showShowProp,
      });
    });
  }

  if (chosenFeatures.length === 0) {
    return null;
  }

  return (
    <div className={classes.showShowPropContainer}>
      {chosenFeatures
        .map((feature) =>
          feature ? (
            <span
              key={`feature-${feature.content}`}
              className={feature.className}
            >
              {feature.content}
            </span>
          ) : null
        )
        .filter(notEmpty)}
    </div>
  );
}
