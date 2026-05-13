import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  type DeleteObjectCommandOutput,
  type GetObjectCommandOutput,
  type HeadObjectCommandOutput,
  type PutObjectCommandInput,
  type PutObjectCommandOutput,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
type S3ObjectBody = PutObjectCommandInput["Body"];

export type S3ServiceConfig = {
  bucket: string;
  region: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  forcePathStyle?: boolean;
};

export type UploadObjectInput = {
  key: string;
  body: S3ObjectBody;
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
};

const getRequiredEnv = (env: NodeJS.ProcessEnv, name: string): string => {
  const value = env[name];

  if (!value) {
    throw new Error(`${name} must be configured before using S3 storage`);
  }

  return value;
};

const parseBooleanEnv = (value: string | undefined): boolean | undefined => {
  if (value === undefined || value === "") {
    return undefined;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

export const getS3ConfigFromEnv = (
  env: NodeJS.ProcessEnv = process.env,
): S3ServiceConfig => ({
  bucket: getRequiredEnv(env, "S3_BUCKET"),
  region: getRequiredEnv(env, "S3_REGION"),
  endpoint: env.S3_ENDPOINT || undefined,
  accessKeyId: env.S3_ACCESS_KEY_ID || undefined,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY || undefined,
  sessionToken: env.S3_SESSION_TOKEN || undefined,
  forcePathStyle: parseBooleanEnv(env.S3_FORCE_PATH_STYLE),
});

const getClientConfig = (config: S3ServiceConfig): S3ClientConfig => ({
  region: config.region,
  endpoint: config.endpoint,
  forcePathStyle: config.forcePathStyle,
  credentials:
    config.accessKeyId && config.secretAccessKey
      ? {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
          sessionToken: config.sessionToken,
        }
      : undefined,
});

export class S3Service {
  private readonly bucket: string;

  private readonly client: S3Client;

  constructor(config: S3ServiceConfig, client?: S3Client) {
    this.bucket = config.bucket;
    this.client = client ?? new S3Client(getClientConfig(config));
  }

  uploadObject = async ({
    key,
    body,
    contentType,
    metadata,
    cacheControl,
  }: UploadObjectInput): Promise<PutObjectCommandOutput> =>
    this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        Metadata: metadata,
        CacheControl: cacheControl,
      }),
    );

  getObject = async (key: string): Promise<GetObjectCommandOutput> =>
    this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

  getObjectMetadata = async (key: string): Promise<HeadObjectCommandOutput> =>
    this.client.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

  deleteObject = async (key: string): Promise<DeleteObjectCommandOutput> =>
    this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
}

export const createS3Service = (
  config: S3ServiceConfig = getS3ConfigFromEnv(),
): S3Service => new S3Service(config);
