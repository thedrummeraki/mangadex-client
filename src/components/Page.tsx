import { Container, Grid, IconButton, makeStyles } from "@material-ui/core";
import { PropsWithChildren, ReactNode } from "react";
import { TitledSection, TitledSectionProps } from "./TitledSection";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";
import { useQueryParam } from "utils";
import { useDocumentTitle } from "./DocumentTitle";

interface Props {
  backUrl?: string;
  title: string;
  maxWitdh?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  showcase?: {
    imageUrl: string | null;
    content: ReactNode;
  };
}

type PageProps = Props & TitledSectionProps;

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  showcaseImg: {
    display: "block",
    maxHeight: "100%",
    width: "100%",
    marginTop: theme.spacing(4),
    objectFit: "cover",

    [theme.breakpoints.down("sm")]: {
      height: "25vh",
    },
  },
}));

export function Page({
  backUrl,
  title,
  badges,
  tags,
  maxWitdh,
  showcase,
  children,
  primaryAction,
}: PropsWithChildren<PageProps>) {
  const classes = useStyles();
  const history = useHistory();
  const defaultBackUrl = useQueryParam("from", backUrl);

  useDocumentTitle({ title });

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

  if (showcase) {
    return (
      <Container maxWidth={maxWitdh}>
        <Grid container spacing={2}>
          {showcase.imageUrl && (
            <Grid item xs={12} md={3}>
              <img
                alt={`${title}-showcase`}
                src={showcase.imageUrl}
                className={classes.showcaseImg}
              />
            </Grid>
          )}
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
      <TitledSection
        variant="h5"
        title={titleMarkup}
        badges={badges}
        primaryAction={primaryAction}
        tags={tags}
      />
      <div className={classes.root}>{children}</div>
    </Container>
  );
}
