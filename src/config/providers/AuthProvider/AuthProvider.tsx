import { useApolloClient } from "@apollo/client";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Token, User } from "types/user";

type AuthUser = User | null;

interface AuthContextState {
  currentUser: AuthUser;
  setCurrentUser: (user: AuthUser) => void;
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [currentUser, setCurrentUser] = useState<AuthUser>(null);
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

const AuthContext = React.createContext<AuthContextState>({
  currentUser: null,
  setCurrentUser: (_: AuthUser) => {},
});

export function useAuth() {
  const client = useApolloClient();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const token = useMemo(getToken, [currentUser]);

  const login = useCallback(
    async (token: Token) => {
      if (currentUser) {
        return;
      }

      // setCurrentUser(user);
      saveToken(token);
    },
    [currentUser]
  );

  const logout = useCallback(() => {
    if (!currentUser) {
      return;
    }

    setCurrentUser(null);
    clearToken();
    client.resetStore();
  }, [currentUser]);

  return { currentUser, token, login, logout };
}

function getToken(): Token | null {
  const savedSession = sessionStorage.getItem("auth.session");
  const savedRefresh = sessionStorage.getItem("auth.refresh");

  if (savedSession?.length && savedRefresh?.length) {
    return { session: savedSession, refresh: savedRefresh };
  }

  return null;
}

function saveToken(token: Token) {
  sessionStorage.setItem("auth.session", token.session);
  sessionStorage.setItem("auth.refresh", token.refresh);
}

function clearToken() {
  sessionStorage.removeItem("auth.session");
  sessionStorage.removeItem("auth.refresh");
}
