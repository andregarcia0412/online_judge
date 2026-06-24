import React from "react";

export const useFetch = <T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<unknown>(null);
  React.useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher();
        if (active) setData(res);
      } catch (e) {
        if (active) setError(e);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error };
};
