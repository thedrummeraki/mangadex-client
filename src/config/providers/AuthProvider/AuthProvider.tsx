import { useApolloClient } from "@apollo/client";
import { LoginModal } from "components/modals";
import {
  CurrentUser,
  useGetCurrentUserLazyQuery,
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "generated/graphql";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GenericResponse } from "types";
import { Token, User } from "types/user";

type AuthUser = CurrentUser | null;

interface AuthContextState {
  currentUser: AuthUser;
  loginModalOpen: boolean;
  setCurrentUser: (user: AuthUser) => void;
  setLoginModalOpen: (open: boolean) => void;
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const token = getToken();
  const [currentUser, setCurrentUser] = useState<AuthUser>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { data, loading } = useGetCurrentUserQuery({
    skip: token == null,
  });

  useEffect(() => {
    if (data?.currentUser) {
      setCurrentUser(data.currentUser);

      if (
        data.currentUser.session?.length &&
        data.currentUser.refresh?.length
      ) {
        saveToken({ ...data.currentUser } as Token);
      }
    }
  }, [data]);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, loginModalOpen, setCurrentUser, setLoginModalOpen }}
    >
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      {children}
    </AuthContext.Provider>
  );
}

const AuthContext = React.createContext<AuthContextState>({
  currentUser: null,
  loginModalOpen: false,
  setCurrentUser: (_: AuthUser) => {},
  setLoginModalOpen: (_: boolean) => {},
});

export function useAuth(options?: {
  onLogin: (response: CurrentUser) => void;
}) {
  const client = useApolloClient();
  const { currentUser, setCurrentUser, setLoginModalOpen } =
    useContext(AuthContext);
  const token = useMemo(getToken, [currentUser]);

  const [getCurrentUserCallback, { data, loading, error }] =
    useGetCurrentUserLazyQuery();

  const [clearSession] = useLogoutMutation();

  useEffect(() => {
    if (data?.currentUser) {
      const response = data.currentUser;
      setCurrentUser(response);

      if (options?.onLogin) {
        options.onLogin(response);
      }
    }
  }, [data, options, setCurrentUser]);

  // Call this after manually logging in the user
  const login = async (token: Token) => {
    setCurrentUser(null);
    saveToken(token);

    const promise = new Promise<GenericResponse<User> | null>(
      (resolve, reject) => {
        if (error) {
          reject(error);
        }
        if (!loading && data) {
          resolve(data as GenericResponse<User>);
          setLoginModalOpen(false);
        } else if (!data && !error) {
          resolve(null);
          setLoginModalOpen(false);
        }
      }
    );

    getCurrentUserCallback();

    return await promise;
  };

  const logout = () => {
    if (!currentUser) {
      return;
    }

    clearSession().then((result) => {
      if (result.data?.logout) {
        client
          .resetStore()
          .catch(console.error)
          .finally(() => {
            setCurrentUser(null);
            clearToken();
          });
      }
    });
  };

  return { currentUser, token, login, logout, loggedIn: Boolean(currentUser) };
}

// Use this to open the modal from anywhere in the app.
export function useLoginModal() {
  const { currentUser, loginModalOpen, setLoginModalOpen } =
    useContext(AuthContext);

  const requestLoginModal = useCallback(() => {
    if (!currentUser && !loginModalOpen) {
      setLoginModalOpen(true);
    }
  }, [currentUser, loginModalOpen, setLoginModalOpen]);

  return { open: loginModalOpen, requestLoginModal };
}

export function getToken(): Token | null {
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
