import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { ActionResult } from "types";

export default gql`
  mutation UnfollowManga($mangaId: String!) {
    unfollowManga(id: $mangaId, body: {})
      @rest(
        type: "BasicActionResult"
        path: "/manga/{args.id}/unfollow"
        method: "DELETE"
        bodyKey: "body"
      ) {
      result
      errors
    }
  }
` as TypedDocumentNode<{ unfollowManga: ActionResult }, { mangaId: string }>;
