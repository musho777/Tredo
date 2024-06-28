import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './src/pages/home';
import { Permission } from './src/pages/permission';
import { NavigationContainer } from '@react-navigation/native';
import { LoginNavigation } from './loginNavigation';
import ScanScreen from './src/pages/qrScaner';


const Stack = createStackNavigator();
const MyTheme = {
  dark: false,
  colors: {
    background: "#f9f9f9",
  },
};


export function Navigation({ initialRouteName }) {

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}>
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
          name="connection" component={LoginNavigation} />

        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ScanScreen" component={ScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}