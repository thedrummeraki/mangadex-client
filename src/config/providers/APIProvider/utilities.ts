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
      if (!existing || !existing.results) {
        return incoming;
      }

      if (!incoming.results) {
        return existing;
      }

      return {
        ...incoming,
        results: [...existing.results, ...incoming.results],
      };
    },
  };
}

// This is similar to Apollo's offsetLimitPagination. The idea here is to not
// return anything if there are no incoming results...
export function betterOffsetLimitPagination<T extends Reference>(
  keyArgs: KeyArgs = false
): FieldPolicy<Array<T>> {
  return {
    keyArgs,
    merge(existing, incoming, { args }) {
      // console.log("existing", existing, "incoming", incoming, "args", args);
      if (!existing) {
        return incoming;
      }

      if (incoming.length === 0) {
        return existing;
      }

      // this is the same as Apollo's offsetLimitPagination...
      const merged = existing ? existing.slice(0) : [];
      if (args) {
        const { offset = 0 } = args;
        for (let i = 0; i < incoming.length; ++i) {
          merged[offset + i] = incoming[i];
        }
      } else {
        // ...except we actually throw an error... don't ask why.
        throw new Error("missing arguments");
      }

      return merged;
    },
  };
}
