import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import NotificationListener from 'react-native-android-notification-listener';
// @ts-ignore
import {BatteryOptEnabled} from 'react-native-battery-optimization-check';
import {ApplicationId, WebHook} from '../types';
import {InstalledApps} from 'react-native-launcher-kit';

export function useGetSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const webhook = (await AsyncStorage.getItem('webhook')) || '{}';
      const notification = await NotificationListener.getPermissionStatus();
      const optimization = await BatteryOptEnabled();
      return {
        webhook: JSON.parse(webhook) as WebHook,
        notification: notification === 'authorized',
        optimization,
      };
    },
  });
}

export function useGetAllApplications() {
  return useQuery({
    queryKey: ['all-applications'],
    queryFn: async () => {
      const applicationsData = await AsyncStorage.getItem('applications');
      const enabledApps: ApplicationId[] = JSON.parse(applicationsData || '[]');
      const installedApps = await InstalledApps.getSortedApps();
      return {enabledApps, installedApps};
    },
  });
}
