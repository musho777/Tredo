import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './src/pages/home';
import { Permission } from './src/pages/permission';
import { Connection } from './src/pages/connection';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    background: "#f9f9f9",
  },
};
export function Navigation() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="home">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}