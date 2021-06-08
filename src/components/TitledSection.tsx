import { ReactElement, ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import { notEmpty } from "utils";
import { Variant } from "@material-ui/core/styles/createTypography";

export interface TitledSectionTag {
  content: string;
  icon?: ReactElement;
  disabled?: boolean;
  onClick?: VoidFunction;
}

type TitledSectionBadge = string | null;

export interface TitledSectionProps {
  title: ReactNode;
  badges?: Array<TitledSectionBadge>;
  primaryAction?: ReactNode;
  tagsDescription?: string;
  tags?: Array<TitledSectionTag>;
  selectedTag?: string | null;
}

type Props = TitledSectionProps & {
  variant?: Variant;
  id?: string;
};

const useStyles = makeStyles((theme) => ({
  titledSection: {
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
  tagsDescription: {
    marginRight: theme.spacing(),
    color: theme.palette.text.hint,
  },
  tag: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

export function TitledSection({
  title,
  id,
  variant = "h6",
  badges,
  primaryAction,
  tagsDescription,
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
    <div
      key={id || title?.toString()}
      id={id}
      className={classes.titledSection}
    >
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
          {tagsDescription && (
            <Typography
              component="span"
              variant="subtitle2"
              className={classes.tagsDescription}
            >
              {tagsDescription}
            </Typography>
          )}
          {tags.map((tag, index) => {
            const selected = selectedTag === tag.content;

            return (
              <Chip
                key={`${tag}-${index}`}
                variant={selected ? "default" : "outlined"}
                color={selected ? "secondary" : "default"}
                size="small"
                disabled={tag.disabled}
                label={tag.content}
                icon={tag.icon}
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
