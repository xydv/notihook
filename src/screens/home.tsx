import React, {useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Card,
  Chip,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import {useGetAllApplications} from '../services/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const theme = useTheme();
  const {isPending, isError, data, refetch} = useGetAllApplications();
  const [localEnabledApps, setLocalEnabledApps] = useState<string[]>([]);

  useEffect(() => {
    if (data?.enabledApps) {
      setLocalEnabledApps(data.enabledApps);
    }
  }, [data?.enabledApps]);

  if (isPending) {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.mainView}>
        <Chip
          style={{backgroundColor: theme.colors.tertiary}}
          textStyle={[styles.chipText, {color: theme.colors.onTertiary}]}>
          Couldn't Fetch Applications
        </Chip>
      </View>
    );
  }

  async function handleSwitchChange(packageName: string, enabled: boolean) {
    let updatedEnabledApps: string[];

    if (enabled) {
      updatedEnabledApps = localEnabledApps.filter(app => app !== packageName);
    } else {
      updatedEnabledApps = [...localEnabledApps, packageName];
    }

    setLocalEnabledApps(updatedEnabledApps);

    await AsyncStorage.setItem(
      'applications',
      JSON.stringify(updatedEnabledApps),
    );

    refetch();
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isPending}
          onRefresh={async () => await refetch()}
        />
      }>
      <View style={styles.mainView}>
        {data.installedApps.length === 0 && (
          <Chip
            style={{backgroundColor: theme.colors.onTertiary}}
            textStyle={[styles.chipText, {color: theme.colors.tertiary}]}>
            no requests found
          </Chip>
        )}
        {data.installedApps.map(app => {
          const isEnabled = localEnabledApps.includes(app.packageName);
          return (
            <Card mode="contained" key={app.packageName}>
              <Card.Content style={styles.cardContent}>
                <Image source={{uri: app.icon}} style={styles.image} />
                <View style={styles.cardHeader}>
                  <Text variant="bodyLarge">{app.label}</Text>
                  <Text variant="bodyMedium" numberOfLines={1}>
                    {app.packageName}
                  </Text>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={() =>
                    handleSwitchChange(app.packageName, isEnabled)
                  }
                />
              </Card.Content>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    padding: 14,
    gap: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  chipText: {
    padding: 4,
  },
});
