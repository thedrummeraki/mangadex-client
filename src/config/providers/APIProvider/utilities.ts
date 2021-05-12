import { FieldPolicy } from "@apollo/client";
import { Reference } from "@apollo/client/utilities";
import { PagedResultsList } from "types";

type KeyArgs = FieldPolicy<any>["keyArgs"];

export function mangadexOffsetLimitPagination<T extends Reference>(
  keyArgs: KeyArgs = false
): FieldPolicy<PagedResultsList<T>> {
  return {
    keyArgs,
    merge(existing, incoming) {
      if (!existing) {
        return incoming;
      }

      return {
        ...incoming,
        results: [...existing.results, ...incoming.results],
      };
    },
  };
}
