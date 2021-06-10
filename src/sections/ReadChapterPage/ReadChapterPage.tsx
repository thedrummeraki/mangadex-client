import {
  SingleChapter,
  useChapterAddProgressMutation,
  useGetChapterReadingStatusesQueryLazyQuery,
  useGetMangaQuery,
} from "generated/graphql";
import { bindKeyboard } from "react-swipeable-views-utils";
import { useEffect, useState } from "react";

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
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DoneIcon from "@material-ui/icons/Done";
import { useHistory } from "react-router";
import { chapterTitle } from "helpers";

interface Props {
  chapter: SingleChapter;
  initialPage: number;
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
      marginLeft: drawerWidth,
      [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
      },
    },
    zoomedOut: {
      height: `calc(100vh - 66px)`,
      objectFit: "contain",
    },
    page: {
      cursor: "point",
      minWidth: "100%",
      width: "100%",
      height: "100%",
      flexShrink: 1,
      position: "relative",
      display: "grid",
      // gridTemplateRows: "minmax(0px, 1fr) 1fr minmax(0px, 1fr)",
      "-moz-box-pack": "center",
      justifyContent: "center",
      scrollbarWidth: "none",
    },
    zoomedIn: {
      objectFit: "contain",
      maxWidth: "100%",
      minWidth: 0,
      width: "100%",
      height: "auto",
      scrollbarWidth: "none",
    },
  })
);

// TODO: Rename to ViewChapterPage (to stay consistent)
export function ReadChapterPage({ chapter, initialPage }: Props) {
  const history = useHistory();
  const classes = useStyles();
  const [index, setIndex] = useState(initialPage - 1);
  const [zoomed] = useState(true);
  const { data } = useGetMangaQuery({
    variables: {
      id: chapter.mangaId,
      translatedLanguage: chapter.attributes.translatedLanguage,
      chaptersForVolume: chapter.attributes.volume,
      chapterLimit: 100,
    },
  });

  const [getChapterReadingStatuses, { data: readingStatusData }] =
    useGetChapterReadingStatusesQueryLazyQuery();

  const [addProgressForChapter] = useChapterAddProgressMutation();

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const manga = data?.manga;

  useEffect(() => {
    if (manga) {
      getChapterReadingStatuses({
        variables: { ids: manga.chapters.map((chapter) => chapter.id) },
      });
    }
  }, [getChapterReadingStatuses, manga]);

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const page = index + 1;
    const complete = page === chapter.attributes.data.length || undefined;
    if (manga) {
      addProgressForChapter({
        variables: {
          chapterUuid: chapter.id,
          mangaUuid: manga.id,
          page,
          complete,
        },
        refetchQueries: ["GetChapterReadingStatusesQuery"],
      });
    }
  }, [addProgressForChapter, index, chapter, manga]);

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
        {manga?.chapters?.map((otherChapter) => {
          const readingStatus = readingStatusData?.chaptersReadingStatus?.find(
            (status) => status.chapterUuid === otherChapter.id
          );

          const done = readingStatus?.complete;
          const reading = !done && Boolean(readingStatus);

          return (
            <ListItem
              key={otherChapter.id}
              button
              selected={chapter.id === otherChapter.id}
              onClick={() => {
                history.replace(`/manga/read/${otherChapter.id}`);
                setIndex(0);
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
    </>
  );

  return (
    <div className={classes.root}>
      {drawerToolbar}
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <BindKeyboardSwipeableViews
          enableMouseEvents
          resistance
          ignoreNativeScroll
          index={index}
          onChangeIndex={(newIndex) => {
            if (newIndex === chapter.pages.length - 1 && index === 0) {
              return;
            }
            if (newIndex === 0 && index === chapter.pages.length - 1) {
              return;
            }
            setIndex(newIndex);
          }}
        >
          {chapter.pages.map((page, index) => (
            <div id={`page-${index + 1}`} className={classes.page}>
              <img
                alt={`Page ${index + 1}`}
                src={page.url}
                className={zoomed ? classes.zoomedIn : classes.zoomedOut}
              />
            </div>
          ))}
        </BindKeyboardSwipeableViews>
      </main>
    </div>
  );
}
