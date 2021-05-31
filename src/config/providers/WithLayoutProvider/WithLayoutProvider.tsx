import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import NavigationDrawer from "./NavigationDrawer";

export function WithLayoutProvider({ children }: PropsWithChildren<{}>) {
  const [visible, setVisible] = useState(true);

  return (
    <NavigationBarContext.Provider value={{ visible, setVisible }}>
      <NavigationDrawer>{children}</NavigationDrawer>
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
  }, [setVisibleFn, setVisible]);

  return { visible };
}
