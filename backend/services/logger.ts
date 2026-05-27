import { logs } from "@opentelemetry/api-logs";
import { getPostHogLogAttributes } from "../posthog.js";

const shouldLogToConsole = process.env.NODE_ENV !== "prod";
const postHogLogger = logs.getLogger("helios-backend");

export type LoggerAttributes = Record<string, unknown>;
export type LoggerBody = unknown;

type ErrorAttributes = {
  error_name?: string;
  error_message?: string;
  error_stack?: string;
};

type LogMethod = (body: LoggerBody, attributes?: LoggerAttributes) => void;
type ConsoleSeverity = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

function getErrorAttributes(error: unknown): ErrorAttributes {
  if (error instanceof Error) {
    return {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
    };
  }

  if (error === undefined) {
    return {};
  }

  return {
    error_message: String(error),
  };
}

function getLogMessage(body: LoggerBody): string {
  if (typeof body === "string") {
    return body;
  }

  if (body instanceof Error) {
    return body.message;
  }

  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}

function emit(
  severityText: ConsoleSeverity,
  body: LoggerBody,
  attributes?: LoggerAttributes,
) {
  postHogLogger.emit({
    severityText,
    body: getLogMessage(body),
    attributes: getPostHogLogAttributes(attributes),
  });

  if (shouldLogToConsole) {
    const consoleMethod =
      severityText === "fatal" ? console.error : console[severityText];

    consoleMethod(body, attributes);
  }
}

export const logger: {
  trace: LogMethod;
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: (
    body: LoggerBody,
    error?: unknown,
    attributes?: LoggerAttributes,
  ) => void;
  fatal: (
    body: LoggerBody,
    error?: unknown,
    attributes?: LoggerAttributes,
  ) => void;
} = {
  trace: (body, attributes) => emit("trace", body, attributes),

  debug: (body, attributes) => emit("debug", body, attributes),

  info: (body, attributes) => emit("info", body, attributes),

  warn: (body, attributes) => emit("warn", body, attributes),

  error: (body, error, attributes) =>
    emit("error", body, {
      ...attributes,
      ...getErrorAttributes(error),
    }),

  fatal: (body, error, attributes) =>
    emit("fatal", body, {
      ...attributes,
      ...getErrorAttributes(error),
    }),
};
