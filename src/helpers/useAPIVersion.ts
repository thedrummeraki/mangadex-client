import { useEffect, useState } from "react";

export default function useAPIVersion() {
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/version")
      .then((res) => res.json())
      .then((res) => setVersion(res.version))
      .finally(() => setLoading(false));
  }, []);

  return { version, loading };
}
