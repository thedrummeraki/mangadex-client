import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomHistory, useQueryParam } from "utils";

interface Options {
  firstPage?: number;
  pageSize?: number;
  pushPageInfoToHistory?: boolean;
}

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_FIRST_PAGE = 1;

export default function usePagination(
  options: Options = {
    firstPage: DEFAULT_FIRST_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    pushPageInfoToHistory: true,
  }
) {
  const { pushToHistory } = useCustomHistory();
  const requestedFirstPage = parseInt(useQueryParam("page"));
  const firstPage = useMemo(() => {
    if (String(requestedFirstPage) !== "NaN") {
      return requestedFirstPage;
    }

    return options.firstPage || 1;
  }, [requestedFirstPage, options]);
  const pageSize = useMemo(
    () => options.pageSize || DEFAULT_PAGE_SIZE,
    [options]
  );
  const pushPageInfoToHistory = useMemo(
    () =>
      options.pushPageInfoToHistory != null
        ? options.pushPageInfoToHistory
        : true,
    [options]
  );

  const [page, setPage] = useState(firstPage);
  const nextPage = useCallback(() => setPage((page) => page + 1), []);
  const previousPage = useCallback(() => setPage((page) => page + 1), []);

  const limit = useMemo(() => options.pageSize || DEFAULT_PAGE_SIZE, [options]);
  const offset = useMemo(() => limit * (page - 1), [page, limit]);

  const getPagesCount = useCallback(
    (total?: number | null) => {
      return total ? Math.ceil(total / pageSize) : 1;
    },
    [pageSize]
  );

  useEffect(() => {
    if (pushPageInfoToHistory) {
      pushToHistory({ page }, true);
    }
  }, [pushPageInfoToHistory, pushToHistory, page]);

  return {
    pageSize,
    limit,
    offset,
    page,
    setPage,
    getPagesCount,
    nextPage,
    previousPage,
  };
}
