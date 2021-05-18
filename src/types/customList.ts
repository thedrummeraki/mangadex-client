import { User } from "./user";

export interface CustomList {
  id: string;
  type: "custom_list";
  attributes: CustomListAttributes;
}

export interface CustomListAttributes {
  name: string;
  visibility: "private" | "public";
  owner: User;
  version: number;
}
