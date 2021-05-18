import { TypedDocumentNode } from "@apollo/client";
import gql from "graphql-tag";
import { GenericResponse } from "types";
import { CustomList } from "types/customList";

const mutation = gql`
  mutation CreateCustomList($name: String!, $visibility: String = "private") {
    createCustomList(body: { name: $name, visibility: $visibility })
      @rest(
        type: "CustomList"
        method: "POST"
        bodyKey: "body"
        path: "/list"
      ) {
      result
      data {
        id
        type
        attributes {
          name
          visibility
          owner
          version
        }
      }
      relationships {
        id
        type
      }
    }
  }
`;

export default mutation as TypedDocumentNode<
  { createCustomList: GenericResponse<CustomList> },
  { name: string; visibility?: "private" | "public" }
>;
