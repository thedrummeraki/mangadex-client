import { useTheme } from "@material-ui/core";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { ThumbnailFeatures } from "./ThumbnailFeatures";
import { ThumbnailIcons } from "./ThumbnailIcons";
import { ThumbnailImage } from "./ThumbnailImage";
import { ThumbnailWrapper } from "./ThumbnailWrapper";
import { ThumbnailProps } from "./types";
import useThumbnailStyles from "./useThumbnailStyles";

function Thumbnail({
  img,
  explicit,
  raw,
  title,
  clickable,
  url,
  follow,
  features,
  icons,
  onClick,
}: ThumbnailProps) {
  const classes = useThumbnailStyles();
  const theme = useTheme();
  const hasTitle = Boolean(title);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ThumbnailWrapper
        title={title}
        follow={follow}
        url={url}
        onClick={onClick}
      >
        <div
          style={{
            ...theme.custom.withPrettyBoxShadow,
            position: "relative",
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <div className={classes.holder}>
            <div ref={overlayRef} className={classes.overlay} />
          </div>
          <div className={clsx(classes.thumbnailWrapper, classes.container)}>
            <ThumbnailFeatures explicit={explicit} features={features} />
            <ThumbnailImage
              clickable={clickable}
              explicit={explicit}
              overlayRef={overlayRef}
              img={img}
              alt={title || "No image"}
            />
            <ThumbnailIcons icons={icons} />
          </div>
        </div>
        {hasTitle && (
          <small
            style={{ color: hovered ? "black" : undefined }}
            className={classes.title}
          >
            {title}
          </small>
        )}
      </ThumbnailWrapper>
    </div>
  );
}

const MemoizedThumbnail = React.memo(Thumbnail, (prevProps, nextProps) => {
  return prevProps.img === nextProps.img && prevProps.title === nextProps.title;
});

export default MemoizedThumbnail;
