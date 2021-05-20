import { ReactNode } from "react";
import HomeIcon from "@material-ui/icons/Home";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import GroupIcon from "@material-ui/icons/Group";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { useHistory } from "react-router";
import { useAuth } from "config/providers/AuthProvider";
import { noEmptyArray } from "utils";
import { useLocalCurrentlyReading } from "helpers";

interface BaseDrawerItem {
  icon: ReactNode;
  content: string;
  requiresAuth?: boolean;
  hidden?: boolean;
  onClick?: VoidFunction;
  url?: string;
}

interface ClickableDrawerItem extends BaseDrawerItem {
  onClick: VoidFunction;
  url?: string;
}

interface LinkableDrawerItem extends BaseDrawerItem {
  url: string;
  onClick?: VoidFunction;
}

type DrawerItem = ClickableDrawerItem | LinkableDrawerItem;

export default function useDrawerItems() {
  const history = useHistory();
  const { currentUser, loggedIn, logout } = useAuth();
  const { currentlyReading } = useLocalCurrentlyReading();

  const top: Array<DrawerItem> = [
    {
      content: "Home",
      icon: <HomeIcon />,
      onClick: () => history.push("/"),
    },
  ];
  const manga: Array<DrawerItem> = [
    {
      content: "Reading history",
      icon: <PlayArrowIcon />,
      hidden: currentlyReading.length === 0,
      onClick: () => history.push("/continue-reading"),
    },
    {
      content: "Your feed",
      icon: <GroupIcon />,
      requiresAuth: true,
      onClick: () => history.push("/feed"),
    },
    {
      content: "Browse all manga",
      icon: <MenuBookIcon />,
      onClick: () => history.push("/browse-manga"),
    },
    {
      content: "Latest releases",
      icon: <NewReleasesIcon />,
      hidden: true,
      onClick: () => history.push("/"),
    },
  ];
  const user: Array<DrawerItem> =
    (currentUser && [
      {
        content: "My account",
        icon: <AccountCircleIcon />,
        hidden: true,
        onClick: () => history.push("/"),
      },
      {
        content: "Application settings",
        icon: <SettingsIcon />,
        hidden: true,
        onClick: () => history.push("/"),
      },
      {
        content: "Logout",
        icon: <ExitToAppIcon />,
        onClick: logout,
      },
    ]) ||
    [];

  return [top, manga, user]
    .map((categoryList) => {
      return categoryList.filter((category) => {
        if (category.hidden) {
          return null;
        }
        if (!category.requiresAuth) {
          return category;
        }

        return category.requiresAuth && loggedIn;
      });
    })
    .filter(noEmptyArray);
}
