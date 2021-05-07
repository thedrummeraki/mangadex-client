import AuthenticatedNavigationBar from "./AuthenticatedNavigationBar";
import GuestNavigationBar from "./GuestNavigationBar";

export default function NavigationBar() {
  const authenticated = localStorage.getItem("authed") === "true";

  return authenticated ? (
    <AuthenticatedNavigationBar />
  ) : (
    <GuestNavigationBar />
  );
}
