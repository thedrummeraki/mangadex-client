import { useAuth } from "config/providers/AuthProvider";
import { useNavigationBarVisible } from "../WithLayoutProvider";
import AuthenticatedNavigationBar from "./AuthenticatedNavigationBar";
import GuestNavigationBar from "./GuestNavigationBar";

export default function NavigationBar() {
  const { loggedIn } = useAuth();
  const { visible } = useNavigationBarVisible();

  if (!visible) {
    return null;
  }

  return loggedIn ? <AuthenticatedNavigationBar /> : <GuestNavigationBar />;
}
