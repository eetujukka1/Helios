import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import type { AttributeValue } from "@opentelemetry/api";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { envService } from "./services/envService.js";

const posthogKey = envService.get("POSTHOG_KEY");
const posthogHost =
  envService.get("POSTHOG_HOST") ?? "https://us.i.posthog.com";
const environment = envService.get("NODE_ENV") ?? "unknown";
const serviceName = "helios-backend";

const logsUrl = new URL("/i/v1/logs", posthogHost).toString();

const sdk = posthogKey
  ? new NodeSDK({
      resource: resourceFromAttributes({
        "service.name": serviceName,
        "deployment.environment": environment,
      }),
      logRecordProcessor: new BatchLogRecordProcessor(
        new OTLPLogExporter({
          url: logsUrl,
          headers: {
            Authorization: `Bearer ${posthogKey}`,
          },
        }),
      ),
    })
  : undefined;

sdk?.start();

function toAttributeValue(value: unknown): AttributeValue | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    const values = value.filter(
      (item): item is string | number | boolean =>
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean",
    );

    if (values.length === 0) {
      return undefined;
    }

    if (values.every((item) => typeof item === "string")) {
      return values;
    }

    if (values.every((item) => typeof item === "number")) {
      return values;
    }

    if (values.every((item) => typeof item === "boolean")) {
      return values;
    }

    return JSON.stringify(value);
  }

  if (value === undefined || value === null) {
    return undefined;
  }

  return JSON.stringify(value);
}

export function getPostHogLogAttributes(
  attributes?: Record<string, unknown>,
): Record<string, AttributeValue> {
  const logAttributes: Record<string, AttributeValue> = {
    service: serviceName,
    environment,
  };

  for (const [key, value] of Object.entries(attributes ?? {})) {
    const attributeValue = toAttributeValue(value);

    if (attributeValue !== undefined) {
      logAttributes[key] = attributeValue;
    }
  }

  return logAttributes;
}

export async function shutdownPostHog(): Promise<void> {
  await sdk?.shutdown();
}
