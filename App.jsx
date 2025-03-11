import React, { useEffect } from 'react';
import { View, Image, Animated } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LogScreen from './src/screens/LogScreen';

enableScreens();

const Stack = createStackNavigator();

const LoadingScreen = ({ navigation }) => {
      const progress = new Animated.Value(0);
  
      useEffect(() => {
          Animated.timing(progress, {
              toValue: 100,
              duration: 5000,
              useNativeDriver: false,
          }).start(() => {
              navigation.replace('LogScreen');
          });
      }, []);
  
      return (
          <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000'}}>
              <Image source={require('./src/assets/logo.png')} style={{ width: 344, height: 344, resizeMode: 'contain'}} />
          </View>
      );
  };

const App = () => {

  return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"LoadingScreen" }>
                <Stack.Screen 
                      name="LoadingScreen" 
                      component={LoadingScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="LogScreen" 
                      component={LogScreen} 
                      options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
