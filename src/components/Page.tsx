import { Container, Grid, IconButton, makeStyles } from "@material-ui/core";
import { PropsWithChildren, ReactNode, useRef } from "react";
import { TitledSection, TitledSectionProps } from "./TitledSection";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";
import { useQueryParam, useScrollListeners } from "utils";
import { useDocumentTitle } from "./DocumentTitle";
import {
  BrowseSearchFieldsProps,
  BrowseSearchFields,
} from "sections/BrowseMangaPage/BrowseSearchFields";

interface Props {
  backUrl?: string;
  title: string;
  maxWitdh?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  showcase?: {
    imageUrl: string | null;
    imageDescription?: ReactNode;
    content: ReactNode;
  };
  onScrolledToBottom?: VoidFunction;
}

type PageProps = Props &
  TitledSectionProps & { searchFields?: BrowseSearchFieldsProps };

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  showcaseImg: {
    ...theme.custom.withPrettyBoxShadow,
    display: "block",
    maxHeight: "100%",
    width: "100%",
    objectFit: "cover",
    borderRadius: 10,
    transition: "all .7s ease-in-out;",

    [theme.breakpoints.down("sm")]: {
      height: "25vh",
    },
  },
  showcaseDescription: {
    marginTop: theme.spacing(),
  },
}));

export function Page(props: PropsWithChildren<PageProps>) {
  const {
    backUrl,
    title,
    badges,
    tags,
    maxWitdh,
    showcase,
    children,
    primaryAction,
    searchFields,
    onScrolledToBottom,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const defaultBackUrl = useQueryParam("from", backUrl);

  useDocumentTitle({ title });

  useScrollListeners(
    null,
    () => {
      if (onScrolledToBottom) {
        onScrolledToBottom();
      }
    },
    { offset: 400 }
  );

  const imageMarkup = showcase?.imageUrl && (
    <img
      alt={`${title}-showcase`}
      src={showcase.imageUrl}
      className={classes.showcaseImg}
    />
  );

  const titleMarkup = defaultBackUrl ? (
    <>
      <IconButton
        size="medium"
        onClick={() => history.push(decodeURIComponent(defaultBackUrl))}
        style={{ marginRight: 8 }}
      >
        <ArrowBackIcon />
      </IconButton>
      {title}
    </>
  ) : (
    title
  );

  const searchFieldsMarkup = searchFields && (
    <BrowseSearchFields {...searchFields} />
  );

  if (showcase) {
    return (
      <Container maxWidth={maxWitdh}>
        {searchFieldsMarkup}
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            {imageMarkup}
            <div className={classes.showcaseDescription}>
              {showcase.imageDescription}
            </div>
          </Grid>
          <Grid item xs={12} md={showcase.imageUrl ? 9 : 12}>
            <TitledSection
              variant="h5"
              title={titleMarkup}
              badges={badges}
              primaryAction={primaryAction}
              tags={tags}
            />
            {showcase.content}
          </Grid>
          <Grid item xs={12}>
            <div className={classes.root}>{children}</div>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth={maxWitdh}>
      {searchFieldsMarkup}
      <TitledSection {...props} variant="h5" title={titleMarkup} />
      <div className={classes.root}>{children}</div>
    </Container>
  );
}
