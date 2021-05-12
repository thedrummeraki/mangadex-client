import { useNavigationBarVisible } from "../WithLayoutProvider";
import AuthenticatedNavigationBar from "./AuthenticatedNavigationBar";
import GuestNavigationBar from "./GuestNavigationBar";

export default function NavigationBar() {
  const authenticated = localStorage.getItem("authed") === "true";
  const { visible } = useNavigationBarVisible();

  if (!visible) {
    return null;
  }

  return authenticated ? (
    <AuthenticatedNavigationBar />
  ) : (
    <GuestNavigationBar />
  );
}
