import { describe, expect, it, jest } from "@jest/globals";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getS3ConfigFromEnv, S3Service } from "../services/s3Service.js";

const config = {
  bucket: "helios-test-bucket",
  region: "us-east-1",
};

const createMockClient = () => ({
  send: jest.fn(async (command: unknown) => {
    void command;
    return { ETag: "test-etag" };
  }),
});

describe("getS3ConfigFromEnv", () => {
  it("reads required and optional S3 values from the environment", () => {
    expect(
      getS3ConfigFromEnv({
        S3_BUCKET: "helios-bucket",
        S3_REGION: "us-west-2",
        S3_ENDPOINT: "https://s3.example.com",
        S3_ACCESS_KEY_ID: "access-key",
        S3_SECRET_ACCESS_KEY: "secret-key",
        S3_SESSION_TOKEN: "session-token",
        S3_FORCE_PATH_STYLE: "true",
      }),
    ).toEqual({
      bucket: "helios-bucket",
      region: "us-west-2",
      endpoint: "https://s3.example.com",
      accessKeyId: "access-key",
      secretAccessKey: "secret-key",
      sessionToken: "session-token",
      forcePathStyle: true,
    });
  });

  it("throws when required S3 values are missing", () => {
    expect(() => getS3ConfigFromEnv({ S3_REGION: "us-east-1" })).toThrow(
      "S3_BUCKET must be configured before using S3 storage",
    );
  });
});

describe("S3Service", () => {
  it("uploads objects to the configured bucket", async () => {
    const client = createMockClient();
    const service = new S3Service(config, client as unknown as S3Client);

    await service.uploadObject({
      key: "pages/index.html",
      body: "<html></html>",
      contentType: "text/html",
      metadata: { page: "home" },
      cacheControl: "no-cache",
    });

    expect(client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
    const command = client.send.mock
      .calls[0]?.[0] as unknown as PutObjectCommand;
    expect(command.input).toEqual({
      Bucket: "helios-test-bucket",
      Key: "pages/index.html",
      Body: "<html></html>",
      ContentType: "text/html",
      Metadata: { page: "home" },
      CacheControl: "no-cache",
    });
  });

  it("gets and deletes objects from the configured bucket", async () => {
    const client = createMockClient();
    const service = new S3Service(config, client as unknown as S3Client);

    await service.getObject("pages/index.html");
    await service.deleteObject("pages/index.html");

    expect(client.send).toHaveBeenNthCalledWith(
      1,
      expect.any(GetObjectCommand),
    );
    expect(client.send).toHaveBeenNthCalledWith(
      2,
      expect.any(DeleteObjectCommand),
    );

    const getCommand = client.send.mock
      .calls[0]?.[0] as unknown as GetObjectCommand;
    const deleteCommand = client.send.mock
      .calls[1]?.[0] as unknown as DeleteObjectCommand;

    expect(getCommand.input).toEqual({
      Bucket: "helios-test-bucket",
      Key: "pages/index.html",
    });
    expect(deleteCommand.input).toEqual({
      Bucket: "helios-test-bucket",
      Key: "pages/index.html",
    });
  });
});
