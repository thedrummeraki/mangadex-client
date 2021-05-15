import { useMutation } from "@apollo/client";
import { useAuth } from "config/providers";
import gql from "graphql-tag";
import { useCallback } from "react";
import { GenericResponse } from "types";
import { User } from "types/user";

const loginMutation = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(body: { username: $username, password: $password })
      @rest(
        type: "Token"
        method: "POST"
        bodyKey: "body"
        path: "/auth/login"
      ) {
      result
      token
    }
  }
`;

export default function useLogin(options?: {
  onLogin: (response: GenericResponse<User>) => void;
}) {
  const { login } = useAuth(options);
  const [requestLogin] = useMutation(loginMutation);

  const loginUser = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const result = await requestLogin({ variables: { username, password } });
    if (result.data?.loginUser?.result === "ok") {
      return login(result.data.loginUser.token);
    }

    return null;
    // .then((result) => {
    //   if (result.data?.loginUser?.result === "ok") {
    //     login(result.data.loginUser.token);
    //   }
    // })
    // .catch((err) => console.log(err));
  };

  const logoutUser = () => {};

  return { loginUser, logoutUser };
}
