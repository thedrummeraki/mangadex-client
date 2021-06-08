import { makeStyles } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { MouseEvent, useEffect, useState } from "react";

interface Props {
  pageNumber: number;
  pageUrl: string | null;
  shouldDisplay: boolean;
  fullScreen: boolean;
  onClickLeft: VoidFunction;
  onClickRight: VoidFunction;
  onLoaded: VoidFunction;
}

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "100%",
    // backgroundColor: "#000",
  },
  fullScreenImageContainer: {
    minWidth: "100%",
    width: "100%",
    maxHeight: "calc(100vh - 8px)", // padding from grid item
    overflow: "hidden",
    height: "100%",
  },
  fullScreenImage: {
    cursor: "pointer",
    maxHeight: "calc(100vh - 8px)",
    minHeight: 0,
    height: "auto",
    maxWidth: "100%",
    minWidth: 0,
    objectFit: "contain",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
}));

export function DesktopReaderPage({
  pageNumber,
  pageUrl,
  shouldDisplay,
  fullScreen,
  onClickLeft,
  onClickRight,
  onLoaded,
}: Props) {
  const classes = useStyles();
  const { loading, loaded: imgOk, error } = usePageImageUrl(pageUrl);

  useEffect(() => {
    if (!imgOk) {
      onLoaded();
    }
  }, [imgOk, onLoaded]);

  const onClick = (event: MouseEvent<HTMLDivElement> | undefined) => {
    if (!event) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = rect.right - event.clientX;

    if (x >= y) {
      onClickRight();
    } else {
      onClickLeft();
    }
  };

  const pageTitle = `Page ${pageNumber}`;

  const imageMarkup =
    loading || !shouldDisplay ? (
      <Skeleton variant="rect" style={{ height: "100%" }} />
    ) : error && shouldDisplay ? (
      <Skeleton variant="rect" animation={false} style={{ height: "100%" }} />
    ) : shouldDisplay && pageUrl ? (
      <img alt={pageTitle} src={pageUrl} className={classes.image} />
    ) : null;

  if (fullScreen) {
    if (!pageUrl) {
      return (
        <div className={classes.fullScreenImageContainer}>
          <Skeleton variant="rect" className={classes.fullScreenImage} />
        </div>
      );
    }
    return (
      <div className={classes.fullScreenImageContainer}>
        <img
          alt={pageTitle}
          src={pageUrl}
          className={classes.fullScreenImage}
        />
      </div>
    );
  }

  return (
    <div className={classes.root} onClick={onClick}>
      {imageMarkup}
    </div>
  );
}

function usePageImageUrl(pageUrl: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setReset(true);
    setLoading(true);
    setError(false);
  }, [pageUrl]);

  useEffect(() => {
    if (reset) {
      if (pageUrl !== null) {
        const imageLoader = new Image();
        imageLoader.src = pageUrl;
        imageLoader.onload = () => {
          setLoading(false);
          setError(false);
        };

        imageLoader.onerror = () => {
          setLoading(false);
          setError(true);
        };
      } else {
        setLoading(false);
        setError(true);
      }
      setReset(false);
    }
  }, [reset, pageUrl]);

  return { loading, error, loaded: !loading && !error };
}
