import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './src/pages/home';
import { Permission } from './src/pages/permission';
import { Connection } from './src/pages/connection';
import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SmsPage } from './src/pages/SmsPage';
import { AllMsg } from './src/pages/allMsg';

const Stack = createStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    background: "#f9f9f9",
  },
};
export function Navigation({ initialRouteName }) {
  const [i, setI] = useState(initialRouteName);
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName={i}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="home" component={Home} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="permission" component={Permission} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="connection" component={Connection} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SmsPage" component={SmsPage} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="AllMsg" component={AllMsg} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// SmsPage
// AllMsg