import { useTheme } from "@material-ui/core";
import { BreakpointValues } from "@material-ui/core/styles/createBreakpoints";
import { useCallback, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useHistory, useLocation } from "react-router";

export const noop = () => {};

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function useImageLoaded(url: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    const imageLoader = new Image();
    imageLoader.src = url;
    imageLoader.onload = () => {
      setLoaded(true);
      setError(false);
    };

    imageLoader.onerror = () => setError(true);

    return () => {
      if (url) {
        setLoaded(false);
        setError(null);
      }
    };
  }, [url]);

  return { loaded, error };
}

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useScrollListeners(
  element: HTMLElement | null,
  onScrollToBottom: () => void,
  options?: { offset?: number }
) {
  const scrollOptions = options || {
    offset: 0,
  };
  const { offset } = scrollOptions;
  const scrollOffset = offset || 0;

  const handleScroll = () => {
    // if there's no element, add the listener on the window

    if (!element) {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;

      const hasScrolledHeight =
        scrollTop + window.innerHeight + (scrollOffset > 0 ? scrollOffset : 0);
      const scrolledToBottom = hasScrolledHeight + 1 >= scrollHeight;

      const scrollable = document.body.clientHeight > window.innerHeight;

      if (scrolledToBottom && scrollable) {
        onScrollToBottom();
      }
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = element;

    const hasScrolledHeight =
      scrollHeight - scrollOffset > 0 ? scrollOffset : 0;

    const hasScrolledToBottom = hasScrolledHeight - scrollTop === clientHeight;
    const canScroll = hasScrolledHeight > clientHeight;

    if (hasScrolledToBottom && canScroll) {
      onScrollToBottom();
    }
  };

  useEffect(() => {
    let requestId: number | null = null;

    requestId = window.requestAnimationFrame(() => {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    });

    return () => {
      if (requestId) {
        window.cancelAnimationFrame(requestId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  });
}

export function getQueryParam(
  key: string,
  defaultValue = "",
  decode: boolean = false
) {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key) || defaultValue;
  return decode ? decodeURIComponent(value) : value;
}

export function useQueryParam(
  key: string,
  defaultValue = "",
  decode: boolean = false
) {
  return getQueryParam(key, defaultValue);
}

export const repeat = <T>(times: number, mapFn: (index: number) => T) =>
  Array.from({ length: times }, (_, index) => mapFn(index));

export const ordinalize = (number: number) => {
  const n = `${Math.abs(number)}`;
  let suffix = "";
  if (n.endsWith("11") || n.endsWith("12") || n.endsWith("13")) {
    suffix = "th";
  } else if (n.endsWith("1")) {
    suffix = "st";
  } else if (n.endsWith("2")) {
    suffix = "nd";
  } else if (n.endsWith("3")) {
    suffix = "rd";
  } else {
    suffix = "th";
  }

  return `${number}${suffix}`;
};

export function getContrastYIQ(hexcolor: string) {
  hexcolor = hexcolor.replace("#", "");

  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);

  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
} // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function noEmptyString(value: string | null | undefined) {
  return notEmpty(value) && value.trim().length > 0;
}

export function noEmptyArray<T>(
  value: Array<T> | null | undefined
): value is T[] {
  return value != null && value.length > 0;
}

export function openInNewTab(url: string) {
  window.open(url, "_blank");
}

export function useBreakpoints() {
  const theme = useTheme();
  return { ...theme.breakpoints.values };
}

export function removeFromArray<T>(array: T[], value: T) {
  let removed = false;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      removed = true;
      array.splice(i, 1);
    }
  }

  return removed ? value : null;
}

export const getWindowWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

export function useCurrentWidth() {
  // save current window width in the state object
  let [width, setWidth] = useState(getWindowWidth());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    const resizeListener = () => {
      // change width from the state object
      setWidth(getWindowWidth());
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return width;
}

export function useCurrentBreakpoint() {
  const windowWidth = useCurrentWidth();

  const breakpoints = useBreakpoints();
  const allBreakpoints = Object.keys(breakpoints).reverse();

  const [currentBreakpoint, setCurrentBreakpoint] = useState("");

  useEffect(() => {
    const newBreakpoint = allBreakpoints.find((breakpoint) => {
      return windowWidth >= breakpoints[breakpoint as keyof BreakpointValues];
    });

    if (newBreakpoint) {
      setCurrentBreakpoint(newBreakpoint);
    }
  }, [allBreakpoints, breakpoints, windowWidth]);

  return currentBreakpoint as keyof BreakpointValues;
}

export const timeAgo = (
  date: string | null | undefined,
  options?: { showDate?: boolean; capitalize?: boolean }
) => {
  if (!date) {
    return null;
  }

  const units = [
    "year",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
  ] as Intl.RelativeTimeFormatUnit[];

  let dateTime = DateTime.fromISO(date);
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  let relativeTimeInWords = relativeFormatter.format(
    Math.trunc(diff.as(unit)),
    unit
  );

  if (options?.capitalize) {
    relativeTimeInWords = capitalize(relativeTimeInWords);
  }

  if (options?.showDate) {
    return `${relativeTimeInWords} (${dateTime.toLocaleString(
      DateTime.DATE_FULL
    )})`;
  }

  return relativeTimeInWords;
};

export function decodeHTML(htmlString: string) {
  const element = document.createElement("div");
  element.innerHTML = htmlString;

  return element.innerText;
}

export function filterObject(object: object) {
  return Object.fromEntries(
    Object.entries(object).filter(([_, v]) => {
      return v != null && ((Array.isArray(v) && v.length > 0) || v !== "");
    })
  );
}

export function useCustomHistory() {
  const history = useHistory();
  const location = useLocation();

  const pushToHistory = useCallback(
    (object: object, append: boolean = false) => {
      const pairs: string[][] = append
        ? Object.entries(
            Object.fromEntries(new URLSearchParams(location.search))
          )
        : [];
      Object.entries(object).forEach((pair) => {
        const key = pair[0];
        const value = pair[1];

        if (Array.isArray(value) && value.length > 0) {
          pairs.push([key, value.map((v) => encodeURIComponent(v)).join(",")]);
        } else if (["string", "number", "boolean"].includes(typeof value)) {
          pairs.push([key, encodeURIComponent(String(value))]);
        }
      });

      const newParams = new URLSearchParams(pairs).toString();
      history.replace({ search: `?${newParams}` });
    },
    [history, location.search]
  );

  return { ...history, pushToHistory };
}

export function localizedDateTime(
  dateTimeISO?: string | null,
  format: Intl.DateTimeFormatOptions = DateTime.DATETIME_FULL
) {
  if (!dateTimeISO) {
    return null;
  }

  const dateTime = DateTime.fromISO(dateTimeISO);
  return dateTime.toLocaleString(format);
}

export function getFollowUrl(targetUrl: string) {
  const url = new URL(window.location.toString());
  url.pathname = targetUrl;
  url.searchParams.set(
    "from",
    encodeURIComponent(window.location.pathname + window.location.search)
  );

  return url.pathname + url.search;
}

export function between(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

export function saveTextAsFile(string: string, filename: string) {
  const blob = new Blob([string], { type: "text/plain" });
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);

  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}
