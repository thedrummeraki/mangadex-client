import {
  AppBar,
  createStyles,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  Chapter,
  ReadingHistory,
  SingleChapter,
  SingleManga,
} from "generated/graphql";
import { chapterTitle } from "helpers";
import React, { PropsWithChildren, useState } from "react";
import DoneIcon from "@material-ui/icons/Done";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";

interface Props {
  chapter?: SingleChapter | Chapter | null;
  manga?: SingleManga | null;
  chaptersReadingStatus?: ReadingHistory[];
  chapters: Chapter[];
  page: number;
  loading: boolean;
  onChapterChange: (chapterId: string) => void;
}

const drawerWidth = 240;
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    toolbarContainer: {
      padding: theme.spacing(1, 2),
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      marginLeft: drawerWidth,
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
    },
  })
);

export function ChapterDrawerToolbar({
  chapter,
  manga,
  page,
  chaptersReadingStatus,
  chapters,
  children,
  onChapterChange,
}: PropsWithChildren<Props>) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  console.log("render", {
    chapter,
    manga,
    page,
    chaptersReadingStatus,
    chapters,
  });

  const pagesCountText = chapter ? (
    <>
      Page <strong>{page}</strong>/{chapter.attributes.data.length}
    </>
  ) : null;

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div className={classes.toolbarContainer}>
          <Typography variant="h6">{pagesCountText}</Typography>

          <Typography variant="subtitle1">
            {chapter?.attributes.volume &&
              `Volume ${chapter.attributes.volume}`}
          </Typography>
          <Typography variant="subtitle2">
            {manga?.attributes.title.en}
          </Typography>
        </div>
      </div>
      <Divider />
      <List>
        {chapters?.map((otherChapter) => {
          const readingStatus = chaptersReadingStatus?.find(
            (status) => status.chapterUuid === otherChapter.id
          );

          const done = readingStatus?.complete;
          const reading = !done && Boolean(readingStatus);

          const selected = chapter ? chapter.id === otherChapter.id : false;

          return (
            <ListItem
              key={otherChapter.id}
              button
              selected={selected}
              onClick={() => {
                onChapterChange(otherChapter.id);
              }}
            >
              <ListItemText primary={chapterTitle(otherChapter, true)} />
              {(reading || done) && (
                <ListItemIcon>
                  {reading && <PlayArrowIcon />}
                  {done && <DoneIcon />}
                </ListItemIcon>
              )}
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const drawerToolbar = (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="back to viewing manga"
            edge="start"
            disabled={!chapter}
            onClick={() => chapter && history.push(`/manga/${chapter.mangaId}`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {chapter && chapterTitle(chapter)}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </>
  );

  return (
    <div className={classes.root}>
      {drawerToolbar}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}
