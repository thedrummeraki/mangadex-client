import { Chip, Container, IconButton, makeStyles } from "@material-ui/core";
import { PropsWithChildren } from "react";
import { TitledSection, TitledSectionProps } from "./TitledSection";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";
import { useQueryParam } from "utils";

interface Props {
  backUrl?: string;
  title: string;
  maxWitdh?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

type PageProps = Props & TitledSectionProps;

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

export function Page({
  backUrl,
  title,
  badges,
  tags,
  maxWitdh,
  children,
  primaryAction,
}: PropsWithChildren<PageProps>) {
  const classes = useStyles();
  const history = useHistory();
  const defaultBackUrl = useQueryParam("from", backUrl);

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
