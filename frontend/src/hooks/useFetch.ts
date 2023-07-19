import { useState } from "react";

interface BaseProps {
  url: URL;
  method: string;
  headers: HeadersInit | undefined;
}

type GetProps = {
  body?: never;
};

type PostProps = {
  body?: object;
};

type ConditionalProps = GetProps | PostProps;
type Props = BaseProps & ConditionalProps;

type FetchReturn = {
  response: Response | null;
  data: { users: User[]; count: number } | null;
  isLoading: boolean;
  error: Error | null;
  execute: (controller?: AbortController) => void;
};

export function useFetch(request: Props) {
  const [response, setResponse] = useState<Response | null>(null);
  const [data, setData] = useState<{ users: User[]; count: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { url, method, headers, body } = request;

  async function execute(controller?: AbortController) {
    setIsLoading(true);
    try {
      const bodyField =
        body === undefined ? {} : { body: JSON.stringify(body) };
      const res = await fetch(url, {
        method,
        headers,
        signal: controller?.signal,
        ...bodyField,
      });
      setResponse(res);
      const data = await res.json();

      if (res.ok) {
        setData(data);
      } else {
        console.log(res);
        throw new Error(data.message);
      }
    } catch (err) {
      //Disregard errors caused by user abort signal
      if ((err as Error).name !== "AbortError") setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  return { response, data, isLoading, error, execute };
}

export const useGet = ({ url, method, headers }: BaseProps): FetchReturn => {
  return useFetch({ url, method, headers });
};

export const usePost = ({
  url,
  method,
  headers,
  body,
}: BaseProps & PostProps): FetchReturn => {
  return useFetch({ url, method, headers, body });
};
