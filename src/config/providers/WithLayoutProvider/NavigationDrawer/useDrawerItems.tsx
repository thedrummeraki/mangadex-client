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

interface BaseDrawerItem {
  icon: ReactNode;
  content: string;
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
  const { currentUser, logout } = useAuth();

  const top: Array<DrawerItem> = [
    {
      content: "Home",
      icon: <HomeIcon />,
      onClick: () => history.push("/"),
    },
  ];
  const manga: Array<DrawerItem> = [
    {
      content: "Continue reading...",
      icon: <PlayArrowIcon />,
      onClick: () => history.push("/"),
    },
    {
      content: "Follows",
      icon: <GroupIcon />,
      onClick: () => history.push("/"),
    },
    {
      content: "All manga",
      icon: <MenuBookIcon />,
      onClick: () => history.push("/"),
    },
    {
      content: "Latest releases",
      icon: <NewReleasesIcon />,
      onClick: () => history.push("/"),
    },
  ];
  const user: Array<DrawerItem> =
    (currentUser && [
      {
        content: "My account",
        icon: <AccountCircleIcon />,
        onClick: () => history.push("/"),
      },
      {
        content: "Application settings",
        icon: <SettingsIcon />,
        onClick: () => history.push("/"),
      },
      {
        content: "Logout",
        icon: <ExitToAppIcon />,
        onClick: logout,
      },
    ]) ||
    [];

  return [top, manga, user].filter(noEmptyArray);
}
