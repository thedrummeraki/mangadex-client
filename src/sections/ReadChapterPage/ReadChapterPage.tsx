import { SingleChapter, useGetMangaQuery } from "generated/graphql";
import { bindKeyboard } from "react-swipeable-views-utils";
import { useState } from "react";

import SwipeableViews from "react-swipeable-views";
import { createStyles } from "@material-ui/styles";
import {
  AppBar,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";
import { chapterTitle } from "helpers";

interface Props {
  chapter: SingleChapter;
}

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews);

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
      marginLeft: drawerWidth + 100,
    },
    zoomedOut: {
      height: `calc(100vh - 66px)`,
      width: "100vw",
      objectFit: "contain",
    },
    zoomedIn: {
      width: "100%",
    },
  })
);

// TODO: Rename to ViewChapterPage (to stay consistent)
export function ReadChapterPage({ chapter }: Props) {
  const history = useHistory();
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const { data } = useGetMangaQuery({
    variables: {
      id: chapter.mangaId,
      translatedLanguage: chapter.attributes.translatedLanguage,
      chaptersForVolume: chapter.attributes.volume,
      chapterLimit: 100,
    },
  });

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const manga = data?.manga;

  if (!manga) {
    return null;
  }

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <div className={classes.toolbarContainer}>
          <Typography variant="h6">
            Page <strong>{index + 1}</strong>/{chapter.attributes.data.length}
          </Typography>

          <Typography variant="subtitle1">
            {chapter.attributes.volume && `Volume ${chapter.attributes.volume}`}
          </Typography>
          <Typography variant="subtitle2">
            {manga?.attributes.title.en}
          </Typography>
        </div>
      </div>
      <Divider />
      <List>
        {manga.chapters.map((otherChapter) => (
          <ListItem
            key={otherChapter.id}
            button
            selected={chapter.id === otherChapter.id}
            onClick={() => history.replace(`/manga/read/${otherChapter.id}`)}
          >
            <ListItemText primary={chapterTitle(otherChapter, true)} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
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
            onClick={() => history.push(`/manga/${chapter.mangaId}`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {chapterTitle(chapter)}
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
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <BindKeyboardSwipeableViews
          enableMouseEvents
          resistance
          index={index}
          onChangeIndex={setIndex}
        >
          {chapter.pages.map((page, index) => (
            <img
              alt={`Page ${index + 1}`}
              src={page.url}
              onClick={() => setZoomed((zoomed) => !zoomed)}
              className={zoomed ? classes.zoomedIn : classes.zoomedOut}
            />
          ))}
        </BindKeyboardSwipeableViews>
      </main>
    </div>
  );
}
