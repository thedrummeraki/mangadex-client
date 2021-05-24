import { Maybe } from "graphql/jsutils/Maybe";

export interface Cover {
  id: string;
  type: "cover_art";
  attributes: CoverAttributes;
}

export interface CoverAttributes {
  volume: Maybe<string>;
  fileName: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
