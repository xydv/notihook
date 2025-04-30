import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TopBar} from './components/top-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BottomNavigation} from 'react-native-paper';
import HomeScreen from './screens/home';
import SettingsScreen from './screens/settings';

export default function App() {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'applications',
      title: 'Applications',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'settings',
      title: 'Settings',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    applications: HomeScreen,
    settings: SettingsScreen,
  });

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <TopBar />
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        sceneAnimationEnabled
        sceneAnimationType="opacity"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
