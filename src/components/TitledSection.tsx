import { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import { notEmpty } from "utils";
import { Variant } from "@material-ui/core/styles/createTypography";

interface Tag {
  content: string;
  onClick?: VoidFunction;
}

type TitledSectionBadge = string | null;

export interface TitledSectionProps {
  title: ReactNode;
  badges?: Array<TitledSectionBadge>;
  primaryAction?: ReactNode;
  tags?: Array<Tag>;
  selectedTag?: string | null;
}

type Props = TitledSectionProps & {
  variant?: Variant;
};

const useStyles = makeStyles((theme) => ({
  titledSection: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
    width: "100%",
  },
  titledSectionTitleContainer: {
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  titledSectionTitle: {},
  titledSectionLink: {
    cursor: "pointer",
    textDecoration: "none",
  },
  badge: {
    marginLeft: theme.spacing(),
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

export function TitledSection({
  title,
  variant = "h6",
  badges,
  primaryAction,
  tags,
  selectedTag,
}: Props) {
  const classes = useStyles();
  const badgesMarkup =
    badges &&
    badges
      .map((badge) => badge && <Chip label={badge} className={classes.badge} />)
      .filter(notEmpty);

  return (
    <div key={title?.toString()} className={classes.titledSection}>
      <div className={classes.titledSectionTitleContainer}>
        <>
          <Typography
            variant={variant}
            component="h1"
            className={classes.titledSectionTitle}
          >
            {title}
            {badgesMarkup}
          </Typography>
        </>
        {primaryAction}
      </div>
      {tags && (
        <div className={classes.tagsContainer}>
          {tags.map((tag, index) => {
            const selected = selectedTag === tag.content;

            return (
              <Chip
                key={`${tag}-${index}`}
                variant={selected ? "default" : "outlined"}
                color={selected ? "secondary" : "default"}
                size="small"
                label={tag.content}
                onClick={tag.onClick}
                className={classes.tag}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
