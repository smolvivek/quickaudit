import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CreateAuditScreen from '../screens/CreateAuditScreen';
import AuditDetailsScreen from '../screens/AuditDetailsScreen';
import AddFindingScreen from '../screens/AddFindingScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'QuickAudit',
          }}
        />
        <Stack.Screen
          name="CreateAudit"
          component={CreateAuditScreen}
          options={{
            title: 'New Audit',
          }}
        />
        <Stack.Screen
          name="AuditDetails"
          component={AuditDetailsScreen}
          options={{
            title: 'Audit Details',
          }}
        />
        <Stack.Screen
          name="AddFinding"
          component={AddFindingScreen}
          options={{
            title: 'Add Finding',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
