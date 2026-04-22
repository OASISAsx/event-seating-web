const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const stripApiSuffix = (value: string) => value.replace(/\/api\/?$/, "");

const normalizeSocketBaseUrl = (value?: string) => {
  if (!value) return undefined;

  return trimTrailingSlash(stripApiSuffix(value));
};

export const getSocketBaseUrl = () => {
  const fromSocketUrl = normalizeSocketBaseUrl(
    process.env.NEXT_PUBLIC_API_URL_SOCKET,
  );
  if (fromSocketUrl) return fromSocketUrl;

  const fromApiUrl = normalizeSocketBaseUrl(process.env.NEXT_PUBLIC_API_URL);
  if (fromApiUrl) return fromApiUrl;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

export const getSocketNamespaceUrl = (namespace?: string) => {
  const normalizedNamespace = namespace
    ? namespace.startsWith("/")
      ? namespace
      : `/${namespace}`
    : "";

  const configuredChatUrl = normalizeSocketBaseUrl(
    process.env.NEXT_PUBLIC_CHAT_WS_URL,
  );

  if (
    configuredChatUrl &&
    normalizedNamespace &&
    configuredChatUrl.endsWith(normalizedNamespace)
  ) {
    return configuredChatUrl;
  }

  const baseUrl = getSocketBaseUrl();
  if (!baseUrl) return "";
  if (!normalizedNamespace) return baseUrl;

  return `${baseUrl}${normalizedNamespace}`;
};
