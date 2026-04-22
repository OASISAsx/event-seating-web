const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const stripApiSuffix = (value: string) => value.replace(/\/api\/?$/, "");

const normalizeSocketBaseUrl = (value?: string) => {
  if (!value) return undefined;

  return trimTrailingSlash(stripApiSuffix(value));
};

const normalizePathname = (value?: string) => {
  if (!value || value === "/") return "";
  return trimTrailingSlash(value);
};

const tryParseUrl = (value?: string) => {
  if (!value) return undefined;

  try {
    return new URL(value);
  } catch {
    return undefined;
  }
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

export const getSocketPath = (namespace?: string) => {
  const configuredChatUrl = tryParseUrl(process.env.NEXT_PUBLIC_CHAT_WS_URL);
  const normalizedNamespace = normalizePathname(namespace);

  if (
    configuredChatUrl &&
    normalizedNamespace &&
    normalizePathname(configuredChatUrl.pathname) === normalizedNamespace
  ) {
    return `${normalizedNamespace}/socket.io`;
  }

  return "/socket.io";
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
