import { Chip, Container, IconButton, makeStyles } from "@material-ui/core";
import { PropsWithChildren } from "react";
import { TitledSection, TitledSectionProps } from "./TitledSection";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";

interface Tag {
  content: string;
  onClick?: VoidFunction;
}

interface Props {
  backUrl?: string;
  title: string;
  maxWitdh?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  tags?: Array<Tag>;
}

type PageProps = Props & TitledSectionProps;

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  tagsContainer: {
    width: "100%",
    margin: theme.spacing(0.5, 0, 2, 0),

    "&:first-child": {
      marginLeft: 0,
    },
    "&:last-child": {
      marginRight: 0,
    },
  },
  tag: {
    marginRight: theme.spacing(0.5),
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

  const titleMarkup = backUrl ? (
    <>
      <IconButton
        size="medium"
        onClick={() => history.push(backUrl)}
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
        title={titleMarkup}
        badges={badges}
        primaryAction={primaryAction}
      />
      <div className={classes.root}>
        {tags && (
          <div className={classes.tagsContainer}>
            {tags.map((tag) => (
              <Chip
                variant="outlined"
                size="small"
                label={tag.content}
                onClick={tag.onClick}
                className={classes.tag}
              />
            ))}
          </div>
        )}
        {children}
      </div>
    </Container>
  );
}
