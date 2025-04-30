import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Divider,
  TextInput,
} from 'react-native-paper';
import {useGetSettings} from '../services/queries';
import {
  useDisableBatteryOptimization,
  useGrantNotificationPermission,
  useSetWebHookMutation,
} from '../services/mutations';

export default function SettingsScreen() {
  const [url, setUrl] = useState<string>('');
  const [header, setHeader] = useState<string>('');

  const getSettings = useGetSettings();
  const batteryOptimization = useDisableBatteryOptimization();
  const notificationPermission = useGrantNotificationPermission();
  const setWebhook = useSetWebHookMutation();

  useEffect(() => {
    if (getSettings.data) {
      setUrl(getSettings.data.webhook.url || '');
      setHeader(getSettings.data.webhook.header || '');
    }
  }, [getSettings.data]);

  async function handleSetWebhook() {
    await setWebhook.mutateAsync({url, header});
  }

  if (getSettings.isPending || getSettings.isError) {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.mainView}>
      <TextInput
        mode="flat"
        label="Webhook URL"
        value={url}
        onChangeText={t => setUrl(t)}
        autoCorrect={false}
      />
      <TextInput
        mode="flat"
        label="Webhook Header"
        value={header}
        onChangeText={t => setHeader(t)}
        autoCorrect={false}
      />
      <Button
        mode="contained"
        icon="content-save"
        style={styles.saveButton}
        onPress={handleSetWebhook}
        loading={setWebhook.isPending}
        disabled={!url && !header}>
        Save Webhook
      </Button>
      {!getSettings.data.notification && getSettings.data.optimization && (
        <Divider />
      )}
      {!getSettings.data.notification && (
        <Button
          mode="elevated"
          onPress={() => notificationPermission.mutate()}
          icon="bell-alert">
          Grant Notification Permission
        </Button>
      )}
      {getSettings.data.optimization && (
        <Button
          mode="elevated"
          onPress={() => batteryOptimization.mutate()}
          icon="battery">
          Disable Battery Optimization
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    padding: 14,
    gap: 12,
  },
  saveButton: {
    marginTop: 2,
  },
});
