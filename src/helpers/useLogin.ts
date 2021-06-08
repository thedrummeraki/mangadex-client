import { useMutation } from "@apollo/client";
import { useAuth } from "config/providers";
import { CurrentUser, useLoginUserMutation } from "generated/graphql";
import gql from "graphql-tag";
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
  onLogin: (response: CurrentUser) => void;
}) {
  const { login } = useAuth(options);
  const [requestLogin] = useLoginUserMutation();

  const loginUser = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const result = await requestLogin({ variables: { username, password } });
    const { data } = result;

    if (!data?.loginUser) {
      return null;
    }

    return login({ ...data.loginUser });
  };

  const logoutUser = () => {};

  return { loginUser, logoutUser };
}
