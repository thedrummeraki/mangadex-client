export interface User {
  id: string;
  type: "user";
  attributes: UserAttributes;
}

export interface UserAttributes {
  username: string;
  version: number;
}

export interface Token {
  session: string | null;
  refresh: string | null;
}
