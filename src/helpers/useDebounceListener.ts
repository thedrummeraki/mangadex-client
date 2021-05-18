import { useEffect, useState } from "react";

interface Options<T> {
  delayMs: number;
  value: T;
  maxProgress?: number;
  minLength?: number;
}

export default function useDebounceListener<T extends { length: number }>({
  delayMs,
  value,
}: Options<T>) {
  const [tick, setTick] = useState(delayMs);

  useEffect(() => {
    setTick(0);
  }, [value]);

  // console.log("perc", (tick * 100) / delayMs, "%");

  useEffect(() => {
    const id = setInterval(() => {
      setTick((tick) => {
        if (tick < delayMs) {
          return tick + 10;
        } else {
          return delayMs;
        }
      });
    }, 1);

    return () => clearInterval(id);
  }, [delayMs]);

  return { tick };
}
