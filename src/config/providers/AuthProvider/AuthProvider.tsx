import {
  gql,
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GenericResponse } from "types";
import { Token, User } from "types/user";

interface CheckSessionResponse extends GenericResponse<User> {
  session?: string | null;
  refresh?: string | null;
}

const currentUserQuery = gql`
  query CurrentUser {
    me @rest(type: "User", path: "/user/me") {
      result
      data {
        id
        type
        attributes {
          username
          version
        }
      }
      relationships
    }
  }
`;

const checkSessionQuery = gql`
  query CheckSession {
    currentUser @rest(type: "UserResponse", path: "/auth/check-and-refresh") {
      result
      data {
        id
        type
        attributes {
          username
          version
        }
      }
      relationships
      session
      refresh
    }
  }
`;

const logoutMutation = gql`
  mutation Logout {
    logout(body: {})
      @rest(
        type: "Logout"
        method: "POST"
        path: "/auth/logout"
        bodyKey: "body"
      ) {
      result
      errors
    }
  }
`;

type AuthUser = User | null;

interface AuthContextState {
  currentUser: AuthUser;
  setCurrentUser: (user: AuthUser) => void;
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const token = getToken();
  const [currentUser, setCurrentUser] = useState<AuthUser>(null);
  const { data } = useQuery(checkSessionQuery, {
    context: {
      headers: {
        "X-Auth-Session": token?.session || "",
        "X-Auth-Refresh": token?.refresh || "",
      },
    },
    skip: token == null,
  });

  useEffect(() => {
    if (data?.currentUser) {
      const response = data?.currentUser as CheckSessionResponse;
      if (response.result === "ok") {
        setCurrentUser(response.data);

        if (response.session?.length && response.refresh?.length) {
          saveToken({ ...response } as Token);
        }
      } else {
        console.error(response);
      }
    }
  }, [data]);

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

export function useAuth(options?: {
  onLogin: (response: GenericResponse<User>) => void;
}) {
  const client = useApolloClient();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const token = useMemo(getToken, [currentUser]);

  const [getCurrentUserCallback, { data, loading, error }] =
    useLazyQuery(currentUserQuery);

  const [clearSession] = useMutation(logoutMutation);

  useEffect(() => {
    if (data?.me) {
      const response = data.me as GenericResponse<User>;
      if (response.result === "ok") {
        setCurrentUser(response.data);

        if (options?.onLogin) {
          options.onLogin(response);
        }
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
        } else if (!data && !error) {
          resolve(null);
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
      if (result.data?.logout?.result === "ok") {
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

  return { currentUser, token, login, logout };
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
