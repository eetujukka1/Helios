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
import {
  createEnvService,
  type EnvService,
  type EnvValues,
} from "@helios/shared";
import { LogComponent, LogEvent, LogResult } from "../config/logAttributes.js";
import { logger } from "./logger.js";
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

const isEnvService = (env?: EnvService | EnvValues): env is EnvService =>
  typeof (env as EnvService | undefined)?.get === "function";

const createS3EnvService = (env?: EnvService | EnvValues): EnvService =>
  isEnvService(env) ? env : createEnvService(env);

const getRequiredS3Env = (env: EnvService, name: string): string =>
  env.getRequired(name, `${name} must be configured before using S3 storage`);

export const getS3ConfigFromEnv = (
  env?: EnvService | EnvValues,
): S3ServiceConfig => {
  const envService = createS3EnvService(env);

  return {
    bucket: getRequiredS3Env(envService, "S3_BUCKET"),
    region: getRequiredS3Env(envService, "S3_REGION"),
    endpoint: envService.get("S3_ENDPOINT") || undefined,
    accessKeyId: envService.get("S3_ACCESS_KEY_ID") || undefined,
    secretAccessKey: envService.get("S3_SECRET_ACCESS_KEY") || undefined,
    sessionToken: envService.get("S3_SESSION_TOKEN") || undefined,
    forcePathStyle: envService.getBoolean("S3_FORCE_PATH_STYLE"),
  };
};

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
  }: UploadObjectInput): Promise<PutObjectCommandOutput> => {
    try {
      const response = await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
          Metadata: metadata,
          CacheControl: cacheControl,
        }),
      );

      logger.info("Object uploaded to storage", {
        component: LogComponent.Storage,
        event: LogEvent.StorageUploaded,
        result: LogResult.Success,
        bucket: this.bucket,
        object_key: key,
        content_type: contentType,
      });

      return response;
    } catch (error) {
      logger.error("Object upload to storage failed", error, {
        component: LogComponent.Storage,
        event: LogEvent.StorageUploadFailed,
        result: LogResult.Failure,
        bucket: this.bucket,
        object_key: key,
        content_type: contentType,
      });
      throw error;
    }
  };

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

  deleteObject = async (key: string): Promise<DeleteObjectCommandOutput> => {
    try {
      const response = await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      logger.info("Object deleted from storage", {
        component: LogComponent.Storage,
        event: LogEvent.StorageDeleted,
        result: LogResult.Success,
        bucket: this.bucket,
        object_key: key,
      });

      return response;
    } catch (error) {
      logger.error("Object delete from storage failed", error, {
        component: LogComponent.Storage,
        event: LogEvent.StorageDeleteFailed,
        result: LogResult.Failure,
        bucket: this.bucket,
        object_key: key,
      });
      throw error;
    }
  };
}

export const createS3Service = (
  config: S3ServiceConfig = getS3ConfigFromEnv(),
): S3Service => new S3Service(config);
