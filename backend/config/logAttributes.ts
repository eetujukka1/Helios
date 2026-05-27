export const LogComponent = {
  Backend: "backend",
  Auth: "auth",
  Page: "page",
  Proxy: "proxy",
  Target: "target",
  Queue: "queue",
  Storage: "storage",
} as const;

export type LogComponent = (typeof LogComponent)[keyof typeof LogComponent];

export const LogEvent = {
  BackendStarted: "backend.started",
  BackendShutdownRequested: "backend.shutdown_requested",
  BackendShutdownFailed: "backend.shutdown_failed",
  BackendServerCloseFailed: "backend.server_close_failed",
  ValidationFailed: "validation.failed",
  RequestUnauthorized: "request.unauthorized",
  RequestForbidden: "request.forbidden",
  RequestFailed: "request.failed",

  AuthLoginSucceeded: "auth.login_succeeded",
  AuthLoginFailed: "auth.login_failed",
  WorkerAuthSucceeded: "auth.worker_succeeded",
  WorkerAuthFailed: "auth.worker_failed",

  PageCreated: "page.created",
  PageLoadQueued: "page.load_queued",
  PageLoadQueueCleared: "page.load_queue_cleared",
  PageResponseCreated: "page.response_created",

  ProxyCreated: "proxy.created",
  ProxyUpdated: "proxy.updated",
  ProxyDeleted: "proxy.deleted",
  ProxyEnabled: "proxy.enabled",
  ProxyDisabled: "proxy.disabled",
  ProxyCacheLoaded: "proxy.cache_loaded",

  TargetCreated: "target.created",
  TargetUpdated: "target.updated",
  TargetDeleted: "target.deleted",
  TargetEnabled: "target.enabled",
  TargetDisabled: "target.disabled",
  TargetCacheLoaded: "target.cache_loaded",
  TargetPagesCreated: "target.pages_created",

  StorageUploaded: "storage.uploaded",
  StorageUploadFailed: "storage.upload_failed",
  StorageDeleted: "storage.deleted",
  StorageDeleteFailed: "storage.delete_failed",
} as const;

export type LogEvent = (typeof LogEvent)[keyof typeof LogEvent];

export const LogResult = {
  Success: "success",
  Failure: "failure",
  Retry: "retry",
  Skipped: "skipped",
} as const;

export type LogResult = (typeof LogResult)[keyof typeof LogResult];

export type KnownLogAttributes = {
  event?: LogEvent;
  component?: LogComponent;
  result?: LogResult;

  request_id?: string;
  user_id?: number | string;
  username?: string;
  worker_id?: string;
  actor_type?: string;
  role?: string;
  allowed_roles?: string[];

  page_id?: number | string;
  target_id?: number | string;
  proxy_id?: number | string;
  response_id?: number | string;
  job_id?: string;

  url?: string;
  path?: string;
  method?: string;
  status_code?: number;
  duration_ms?: number;
  count?: number;
  reason?: string;

  signal?: string;
  port?: number | string;
  bucket?: string;
  object_key?: string;
  content_type?: string;

  error_name?: string;
  error_message?: string;
  error_stack?: string;
};

export type LogAttributes = KnownLogAttributes & Record<string, unknown>;
