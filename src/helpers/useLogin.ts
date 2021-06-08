import { useAuth } from "config/providers";
import { CurrentUser, useLoginUserMutation } from "generated/graphql";

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
