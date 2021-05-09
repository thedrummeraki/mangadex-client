import clsx from "clsx";
import { useRef } from "react";
import { ThumbnailFeatures } from "./ThumbnailFeatures";
import { ThumbnailImage } from "./ThumbnailImage";
import { ThumbnailWrapper } from "./ThumbnailWrapper";
import { ThumbnailProps } from "./types";
import useThumbnailStyles from "./useThumbnailStyles";

export function Thumbnail({
  img,
  raw,
  title,
  clickable,
  url,
  features,
  onClick,
}: ThumbnailProps) {
  const classes = useThumbnailStyles();
  const hasTitle = Boolean(title);
  const overlayRef = useRef<HTMLDivElement>(null);

  if (raw) {
    return (
      <ThumbnailImage
        overlayRef={overlayRef}
        img={img}
        alt={title || "No image"}
      />
    );
  }

  return (
    <div
      className={clsx(classes.root, {
        [classes.thumbnail]: hasTitle && clickable,
      })}
      style={{ position: "relative" }}
    >
      <ThumbnailWrapper url={url} onClick={onClick}>
        <div style={{ position: "relative" }}>
          <div className={classes.holder}>
            <div ref={overlayRef} className={classes.overlay} />
          </div>
          <div className={clsx(classes.thumbnailWrapper, classes.container)}>
            <ThumbnailFeatures features={features} />
            <ThumbnailImage
              clickable={clickable}
              overlayRef={overlayRef}
              img={img}
              alt={title || "No image"}
            />
          </div>
        </div>
        {hasTitle && <span className={classes.title}>{title}</span>}
      </ThumbnailWrapper>
    </div>
  );
}
