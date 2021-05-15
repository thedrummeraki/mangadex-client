import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const mutation = gql`
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

export default function useLogin() {
  const [login] = useMutation(mutation);

  const loginUser = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    login({ variables: { username, password } })
      .then((result) => {
        if (result.data?.loginUser?.result === "ok") {
          const token = result.data.loginUser.token;

          sessionStorage.setItem("auth.token", token.session);
          sessionStorage.setItem("refresh.token", token.refresh);
        }
      })
      .catch((err) => console.log(err));
  };

  const logoutUser = () => {};

  return { loginUser, logoutUser };
}
