import { S3Client } from "@aws-sdk/client-s3";

const DEFAULT_REGION = "us-east-1";

function getRequiredEnvVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required for S3 storage`);
  }
  return value;
}

function parseForcePathStyle(): boolean {
  const value = process.env.S3_FORCE_PATH_STYLE;

  if (!value) {
    return false;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(
    'S3_FORCE_PATH_STYLE must be either "true" or "false" when provided',
  );
}

function buildS3Client(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION ?? DEFAULT_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: parseForcePathStyle(),
    credentials: {
      accessKeyId: getRequiredEnvVariable("S3_ACCESS_KEY_ID"),
      secretAccessKey: getRequiredEnvVariable("S3_SECRET_ACCESS_KEY"),
    },
  });
}

let cachedClient: S3Client | undefined;

export function getS3Client(): S3Client {
  if (!cachedClient) {
    cachedClient = buildS3Client();
  }

  return cachedClient;
}

export function getS3BucketName(): string {
  return getRequiredEnvVariable("S3_BUCKET_NAME");
}
