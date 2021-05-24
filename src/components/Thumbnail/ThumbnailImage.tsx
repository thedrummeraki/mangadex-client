import clsx from "clsx";
import { useCallback, useRef } from "react";
import { useImageLoaded } from "utils";
import { ThumbnailSkeleton } from "./ThumbnailSkeleton";
import useThumbnailStyles from "./useThumbnailStyles";

interface Props {
  img: string;
  alt: string;
  overlayRef: React.RefObject<HTMLDivElement>;
  clickable?: boolean | null;
  explicit?: boolean | null;
}

export function ThumbnailImage({
  img,
  alt,
  clickable,
  explicit,
  overlayRef,
}: Props) {
  const classes = useThumbnailStyles();
  const { loaded, error } = useImageLoaded(img);

  const imageRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.classList.add(classes.loaded);
    }
    if (overlayRef.current) {
      overlayRef.current.classList.add(classes.overlayLoaded);

      if (explicit) {
        overlayRef.current.classList.add(classes.explicitImage);
      }
    }
  }, [classes, explicit, overlayRef]);

  if (loaded && !error) {
    return (
      <img
        alt={alt}
        ref={imageRef}
        onLoad={onImageLoad}
        className={clsx(
          explicit && classes.explicitImage,
          clickable ? classes.image : classes.imageNoHover
        )}
        src={img}
      />
    );
  }

  return <ThumbnailSkeleton hideTitle error={error} />;
}
