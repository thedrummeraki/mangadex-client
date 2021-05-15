import { useMutation } from "@apollo/client";
import { useAuth } from "config/providers";
import gql from "graphql-tag";

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

// const authMutation = gql`
//   mutation AuthUser {
//     me @rest(type: "User", path: "/user/me") {

//     }
//   }
// `;

export default function useLogin() {
  const { login } = useAuth();
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
      return await login(result.data.loginUser.token);
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
