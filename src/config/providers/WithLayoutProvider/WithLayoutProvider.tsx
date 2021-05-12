import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { CustomAppBar } from "./CustomAppBar";
import Body from "./Body";
import JumpToMangaSearchField from "./JumpToMangaSearchField";
import NavigationDrawer from "./NavigationDrawer";

export function WithLayoutProvider({ children }: PropsWithChildren<{}>) {
  const [visible, setVisible] = useState(true);

  return (
    <NavigationBarContext.Provider value={{ visible, setVisible }}>
      <NavigationDrawer>
        <CustomAppBar />
        <Body>{children}</Body>
      </NavigationDrawer>
    </NavigationBarContext.Provider>
  );
}

export const NavigationBarContext = React.createContext({
  visible: true,
  setVisible: (_: boolean) => {},
});

export function useNavigationBarVisible(setVisible?: boolean) {
  const { visible, setVisible: setVisibleFn } =
    useContext(NavigationBarContext);

  useEffect(() => {
    if (setVisible != null) {
      setVisibleFn(setVisible);
    }
  }, [visible]);

  return { visible };
}
