import { useState } from "react";

interface BaseProps {
  url: URL;
  method: string;
}

type GetProps = {
  body?: never;
};

type PostProps = {
  headers: object;
  body?: object;
};

type ConditionalProps = GetProps | PostProps;
type Props = BaseProps & ConditionalProps;

type FetchReturn = {
  response: Response | null;
  data: { users: User[]; count: number } | null;
  isLoading: boolean;
  error: Error | null;
  execute: () => void;
};

export function useFetch(request: Props) {
  const [response, setResponse] = useState<Response | null>(null);
  const [data, setData] = useState<{ users: User[]; count: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortController = new AbortController();
  const signal = abortController.signal;

  const { url, method, body } = request;

  async function execute() {
    setIsLoading(true);
    try {
      const bodyField =
        body === undefined ? {} : { body: JSON.stringify(body) };
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        signal,
        ...bodyField,
      });
      setResponse(res);
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      else setData(data);
    } catch (err) {
      // if (err instanceof Error && err.name === "AbortError");
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return { response, data, isLoading, error, execute };
}

export function useGet({ url }: BaseProps): FetchReturn {
  return useFetch({ url, method: "GET" });
}

export function usePost({
  url,
  method,
  headers,
  body,
}: BaseProps & PostProps): FetchReturn {
  return useFetch({ url, method, headers, body });
}
