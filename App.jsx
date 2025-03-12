import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ExplainScreen from './src/screens/ExplainScreen';
import SeasonalScreen from './src/screens/SeasonalScreen';
import AllScreen from './src/screens/AllScreen';
import FactsScreen from './src/screens/FactsScreen';
import MapScreen from './src/screens/MapScreen';
import SavedScreen from './src/screens/SavedScreen';
import BlogScreen from './src/screens/BlogScreen';
import SurpriseScreen from './src/screens/SurpriseScreen';

enableScreens();

const Stack = createStackNavigator();

const LoadingScreen = ({ navigation }) => {
    const logoOpacity = useRef(new Animated.Value(1)).current;
    const nameOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTimeout(() => {
            Animated.timing(nameOpacity, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        }, 2000);

        setTimeout(() => {
            navigation.replace('ExplainScreen');
        }, 5000);
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
            <Animated.Image 
                source={require('./src/assets/logo.png')} 
                style={{ width: 344, height: 344, resizeMode: 'contain', opacity: logoOpacity }} 
            />

            <Animated.Image 
                source={require('./src/assets/name.png')} 
                style={{ width: 200, height: 50, resizeMode: 'contain', opacity: nameOpacity, marginTop: 20 }} 
            />
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
                      name="ExplainScreen" 
                      component={ExplainScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="SeasonalScreen" 
                      component={SeasonalScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="AllScreen" 
                      component={AllScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="MapScreen" 
                      component={MapScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="SavedScreen" 
                      component={SavedScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="FactsScreen" 
                      component={FactsScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="BlogScreen" 
                      component={BlogScreen} 
                      options={{ headerShown: false }} 
                />
                <Stack.Screen 
                      name="SurpriseScreen" 
                      component={SurpriseScreen} 
                      options={{ headerShown: false }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
