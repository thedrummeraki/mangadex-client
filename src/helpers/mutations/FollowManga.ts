import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { ActionResult } from "types";

export default gql`
  mutation FollowManga($mangaId: String!) {
    followManga(id: $mangaId, body: {})
      @rest(
        type: "BasicActionResult"
        path: "/manga/{args.id}/follow"
        method: "POST"
        bodyKey: "body"
      ) {
      result
      errors
    }
  }
` as TypedDocumentNode<{ followManga: ActionResult }, { mangaId: string }>;
