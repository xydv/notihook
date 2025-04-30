import {useMutation, useQueryClient} from '@tanstack/react-query';
import NotificationListener from 'react-native-android-notification-listener';
import {
  RequestDisableOptimization,
  BatteryOptEnabled,
  // @ts-expect-error
} from 'react-native-battery-optimization-check';
import {WebHook} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useDisableBatteryOptimization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['battery-optimization'],
    mutationFn: async () => {
      while (await BatteryOptEnabled()) {
        RequestDisableOptimization();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['settings']});
    },
  });
}

export function useGrantNotificationPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['notification-permission'],
    mutationFn: async () => {
      while ((await NotificationListener.getPermissionStatus()) === 'denied') {
        NotificationListener.requestPermission();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['settings']});
    },
  });
}

export function useSetWebHookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['notification-permission'],
    mutationFn: async (data: WebHook) => {
      await AsyncStorage.setItem('webhook', JSON.stringify(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['settings']});
    },
  });
}
