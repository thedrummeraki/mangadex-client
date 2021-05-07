import { useCallback, useRef } from "react";
import { useImageLoaded } from "utils";
import { ThumbnailSkeleton } from "./ThumbnailSkeleton";
import useThumbnailStyles from "./useThumbnailStyles";

interface Props {
  img: string;
  alt: string;
  clickable?: boolean | null;
}

export function ThumbnailImage({ img, alt, clickable }: Props) {
  const classes = useThumbnailStyles();
  const { loaded, error } = useImageLoaded(img);

  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const onImageLoad = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.classList.add(classes.loaded);
    }
    if (overlayRef.current) {
      overlayRef.current.classList.add(classes.overlayLoaded);
    }
  }, [classes.loaded, classes.overlayLoaded]);

  if (loaded && !error) {
    return (
      <img
        alt={alt}
        ref={imageRef}
        onLoad={onImageLoad}
        className={clickable ? classes.image : classes.imageNoHover}
        src={img}
      />
    );
  }

  return <ThumbnailSkeleton hideTitle error={error} />;
}
