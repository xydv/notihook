import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApplicationId,
  Notification,
  NotificationService,
  WebHook,
} from '../types';

export const listenerService = async ({notification}: NotificationService) => {
  if (!notification) {
    return;
  }

  const webhookData = (await AsyncStorage.getItem('webhook')) || '{}';
  const applicationsData = (await AsyncStorage.getItem('applications')) || '[]';

  const webhook: WebHook = JSON.parse(webhookData);
  const applications: ApplicationId[] = JSON.parse(applicationsData);

  if (!webhook.url) {
    return;
  }

  const parsedNotification: Notification = JSON.parse(notification);

  if (applications.includes(parsedNotification.app)) {
    await fetch(webhook.url, {
      body: notification,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(webhook.header && {'x-webhook-key': webhook.header}),
      },
    });
  }
};
