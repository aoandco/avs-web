type ApiErrorItem = {
  code?: string;
  message?: string;
};

type ApiResponsePayload = {
  message?: string;
  data?: {
    message?: string;
    errors?: ApiErrorItem[];
  };
};

const GENERIC_API_MESSAGES = new Set([
  "Failed to complete",
  "Task report approval failed.",
]);

function tryParseErrorArray(value: string): ApiErrorItem[] | null {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function formatErrorItems(errors: ApiErrorItem[]): string {
  return errors
    .map((error) => error.message || error.code)
    .filter((text): text is string => Boolean(text))
    .join("; ");
}

function formatMessageWithEmbeddedErrors(message: string): string | null {
  const bracketIndex = message.indexOf("[");
  if (bracketIndex === -1) {
    return null;
  }

  const prefix = message.slice(0, bracketIndex).trim();
  const parsed = tryParseErrorArray(message.slice(bracketIndex));
  if (!parsed?.length) {
    return null;
  }

  const readableErrors = formatErrorItems(parsed);
  return prefix ? `${prefix} ${readableErrors}` : readableErrors;
}

export function formatApiResponseMessage(
  responseData?: ApiResponsePayload | null,
  fallback = "Something went wrong"
): string {
  if (!responseData) {
    return fallback;
  }

  const topLevelMessage =
    typeof responseData.message === "string" ? responseData.message.trim() : "";
  const nestedMessage =
    typeof responseData.data?.message === "string"
      ? responseData.data.message.trim()
      : "";
  const nestedErrors = Array.isArray(responseData.data?.errors)
    ? responseData.data.errors
    : [];

  if (topLevelMessage) {
    const formattedTopLevel = formatMessageWithEmbeddedErrors(topLevelMessage);
    if (formattedTopLevel) {
      return formattedTopLevel;
    }

    if (!GENERIC_API_MESSAGES.has(topLevelMessage)) {
      return topLevelMessage;
    }
  }

  if (nestedErrors.length > 0) {
    const readableErrors = formatErrorItems(nestedErrors);
    if (readableErrors) {
      if (topLevelMessage && !GENERIC_API_MESSAGES.has(topLevelMessage)) {
        return `${topLevelMessage}: ${readableErrors}`;
      }
      return readableErrors;
    }
  }

  if (topLevelMessage) {
    return topLevelMessage;
  }

  if (nestedMessage) {
    const formattedNested = formatMessageWithEmbeddedErrors(nestedMessage);
    return formattedNested || nestedMessage;
  }

  return fallback;
}
