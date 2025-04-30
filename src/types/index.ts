export type NotificationService = {
  notification?: string;
};

export type ApplicationId = string;

export type WebHook = {
  url?: string;
  header?: string;
};

export type Notification = {
  // other parts not required for parsing
  app: string;
};
