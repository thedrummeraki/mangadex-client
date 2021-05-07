import clsx from "clsx";
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
  onClick,
}: ThumbnailProps) {
  const classes = useThumbnailStyles();
  const hasTitle = Boolean(title);

  if (raw) {
    return <ThumbnailImage img={img} alt={title || "No image"} />;
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
          <div className={classes.holder} />
          <div className={clsx(classes.thumbnailWrapper, classes.container)}>
            <ThumbnailImage
              clickable={clickable}
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
