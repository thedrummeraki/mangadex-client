import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { PagedResultsList } from "types";
import { CustomList } from "types/customList";

const query = gql`
  query GetCurrentCustomList {
    customList @rest(type: "CustomList", path: "/user/list") {
      limit
      offset
      total
      results {
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
  }
`;

export default query as TypedDocumentNode<{
  customList: PagedResultsList<CustomList>;
}>;
