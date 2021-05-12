import { ReactNode } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import { notEmpty } from "utils";

type TitledSectionBadge = string | null;

export interface TitledSectionProps {
  title: ReactNode;
  badges?: Array<TitledSectionBadge>;
  primaryAction?: ReactNode;
}

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
}));

export function TitledSection({
  title,
  badges,
  primaryAction,
}: TitledSectionProps) {
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
            variant="h5"
            component="h1"
            className={classes.titledSectionTitle}
          >
            {title}
            {badgesMarkup}
          </Typography>
        </>
        {primaryAction}
      </div>
    </div>
  );
}
