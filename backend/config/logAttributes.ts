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

  AuthLoginSucceeded: "auth.login_succeeded",
  AuthLoginFailed: "auth.login_failed",

  PageCreated: "page.created",
  PageLoadQueued: "page.load_queued",
  PageResponseCreated: "page.response_created",

  ProxyCreated: "proxy.created",
  ProxyUpdated: "proxy.updated",
  ProxyDeleted: "proxy.deleted",

  TargetCreated: "target.created",
  TargetUpdated: "target.updated",
  TargetDeleted: "target.deleted",

  StorageUploadFailed: "storage.upload_failed",
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
  role?: string;

  page_id?: number | string;
  target_id?: number | string;
  proxy_id?: number | string;
  response_id?: number | string;
  job_id?: string;

  url?: string;
  method?: string;
  status_code?: number;
  duration_ms?: number;
  count?: number;

  signal?: string;
  port?: number | string;

  error_name?: string;
  error_message?: string;
  error_stack?: string;
};

export type LogAttributes = KnownLogAttributes & Record<string, unknown>;
