import React, { PropsWithChildren } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

interface Props {
  open: boolean;
  onClose: VoidFunction;
  title?: string | null;
  description?: string | null;
  width?: number | string;
}

export default function BasicModal({
  children,
  open,
  title,
  description,
  width,
  onClose,
}: PropsWithChildren<Props>) {
  const classes = useStyles();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{ width }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          {title && <h2 id="transition-modal-title">{title}</h2>}
          {description && (
            <p id="transition-modal-description">{description}</p>
          )}
          <div>{children}</div>
        </div>
      </Fade>
    </Modal>
  );
}
