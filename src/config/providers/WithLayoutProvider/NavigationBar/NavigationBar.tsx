import { useAuth } from "config/providers/AuthProvider";
import { useNavigationBarVisible } from "../WithLayoutProvider";
import BasicNavigationBar from "./BasicNavigationBar";

export default function NavigationBar() {
  const { loggedIn } = useAuth();
  const { visible } = useNavigationBarVisible();

  if (!visible) {
    return null;
  }

  return <BasicNavigationBar loggedIn={loggedIn} />;
}
