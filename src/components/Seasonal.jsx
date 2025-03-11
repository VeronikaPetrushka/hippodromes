import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ImageBackground, Share, Animated, ScrollView } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import dailyFacts from "../constants/dailyFacts";
import seasons from "../constants/seasons";
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const Seasonal = () => {
    const navigation = useNavigation();
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [savedFacts, setSavedFacts] = useState([]);
    const [savedItems, setSavedItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedMap, setSelectedMap] = useState(null);
    const [visible, setVisible] = useState(true);
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        if (selected) {
            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500, 
                    useNativeDriver: true,
                }).start(() => {
                    setVisible(false);
                });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [selected]);

    useEffect(() => {
        const loadData = async () => {
            const storedFactIndex = await AsyncStorage.getItem('currentFactIndex');
            const savedFacts = await AsyncStorage.getItem('savedFacts');
            const lastFactTimestamp = await AsyncStorage.getItem('lastFactTimestamp');
    
            if (storedFactIndex) {
                setCurrentFactIndex(parseInt(storedFactIndex, 10));
            }
            if (savedFacts) {
                setSavedFacts(JSON.parse(savedFacts));
            }
    
            if (lastFactTimestamp) {
                const timeDifference = Date.now() - parseInt(lastFactTimestamp, 10);
                if (timeDifference > 86400000) {
                    showNextFact();
                }
            }
        };
    
        loadData();
    }, []);
    
    useEffect(() => {
        const updateTimestamp = async () => {
            await AsyncStorage.setItem('lastFactTimestamp', Date.now().toString());
        };
    
        updateTimestamp();
    }, [currentFactIndex]);
    
    const showNextFact = () => {
        const nextIndex = (currentFactIndex + 1) % dailyFacts.length;
        setCurrentFactIndex(nextIndex);
    };    

    useEffect(() => {
        AsyncStorage.setItem('currentFactIndex', currentFactIndex.toString());
    }, [currentFactIndex]);

    const handleShare = async (fact) => {
        try {
            await Share.share({
                message: fact,
            });
        } catch (error) {
            console.error('Error sharing the fact', error);
        }
    };

    const handleShareItem = async (item) => {
        try {
            const shareOptions = {
                title: item.name, 
                message: `${item.name}\n\n${item.description}`,
            };
            await Share.share(shareOptions);
        } catch (error) {
            console.error("Error sharing the event:", error.message);
        }
    };

    const handleSave = async (fact) => {
        const newSavedFacts = [...savedFacts];
        const factIndex = newSavedFacts.indexOf(fact);

        if (factIndex !== -1) {
            newSavedFacts.splice(factIndex, 1);
        } else {
            newSavedFacts.push(fact);
        }

        setSavedFacts(newSavedFacts);
        await AsyncStorage.setItem('savedFacts', JSON.stringify(newSavedFacts));
    };

    const handleSaveResult = async (item) => {
        const newSavedItems = [...savedItems];
        const factIndex = newSavedItems.indexOf(item);

        if (factIndex !== -1) {
            newSavedItems.splice(factIndex, 1);
        } else {
            newSavedItems.push(item);
        }

        setSavedItems(newSavedItems);
        await AsyncStorage.setItem('savedHippodrome', JSON.stringify(newSavedItems));
    };

    const currentFact = dailyFacts[currentFactIndex];
    const isSaved = savedFacts.includes(currentFact);

    const toggleMap = (item) => {
        if(mapVisible) {
            setMapVisible(false)
            setSelectedMap(null);
        } else {
            setSelectedMap(item)
            setMapVisible(true)
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.row}>
                <TouchableOpacity style={styles.upperBtn}>
                    <Icons type={'menu'} />
                </TouchableOpacity>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
                <TouchableOpacity style={styles.upperBtn}>
                    <Icons type={'surprise'} />
                </TouchableOpacity>
            </View>

            {
                selected ? (
                    <View style={{width: '100%', backgroundColor: '#000', flexGrow: 1, paddingHorizontal: 34}}>
                        {visible ? (
                            <Animated.View style={{ opacity: fadeAnim, width: '100%', flexGrow: 1, alignItems: 'center' }}>
                                <View style={styles.seasonBtn}>
                                    <ImageBackground source={selected.image} style={{width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
                                        <Text style={styles.btnText}>{selected.season}</Text>
                                        <LinearGradient
                                            colors={['transparent', '#000']}
                                            style={styles.overlay}
                                        />
                                    </ImageBackground>
                                </View>
                                <Text style={[styles.title, {marginVertical: 34}]}>Searching hippodrome for you...</Text>
                                <Text style={[styles.fact, {marginVertical: 34}]}>please wait...</Text>
                            </Animated.View>
                            ) : (
                                <View style={{width: '100%'}}>
                                    <Text style={styles.title}>Search Result:</Text>
                                    <ScrollView style={{width: '100%'}}>
                                        {
                                            selected.items.map((item, index) => (
                                                <View key={index} style={styles.card}>
                                                    <Image source={item.image} style={styles.cardImg} />
                                                    <View style={{width: '100%', padding: 21, backgroundColor: '#171717'}}>
                                                        <Text style={styles.cardName}>{item.name}</Text>
                                                        <Text style={styles.fact}>{item.description}</Text>
                                                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                            <TouchableOpacity style={[styles.factBtn, {width: 180, padding: 8}]} onPress={() => toggleMap(item)}>
                                                                <Text style={styles.cardBtnText}>{mapVisible && item === selectedMap ? 'Close' : 'Open'}</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity 
                                                                style={[styles.cardBtn, savedItems.includes(item) && {backgroundColor: '#313131'}]} 
                                                                onPress={() => handleSaveResult(item)}
                                                                >
                                                                <Icons type={'save'} saved={savedItems.includes(item)} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.cardBtn} onPress={() => handleShareItem(item)}>
                                                                <Icons type={'share'} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                        {
                                                            mapVisible && item === selectedMap && (
                                                                <MapView
                                                                    style={{ width: '100%', height: 188, borderTopColor: '#dabc67', borderTopWidth: 1 }}
                                                                    initialRegion={{
                                                                        latitude: item.coordinates.lat,
                                                                        longitude: item.coordinates.lon,
                                                                        latitudeDelta: 0.5,
                                                                        longitudeDelta: 0.5,
                                                                    }}
                                                                >
                                                                    <Marker
                                                                        coordinate={{
                                                                            latitude: item.coordinates.lat,
                                                                            longitude: item.coordinates.lon,
                                                                        }}
                                                                        title={item.name}
                                                                    />
                                                                </MapView>
                                                            )
                                                        }
                                                </View>
                                            ))
                                        }
                                        <TouchableOpacity style={[styles.factBtn, {width: '100%', padding: 15}]} onPress={() => setSelected(false)}>
                                            <Text style={[styles.cardBtnText, {fontSize: 16}]}>Search Again</Text>
                                        </TouchableOpacity>
                                        <View style={{height: 350}} />
                                    </ScrollView>
                                </View>
                            )}
                    </View>
                ) : (
                    <View style={{width: '100%', backgroundColor: '#000', flexGrow: 1, paddingHorizontal: 34}}>
                        <ScrollView style={{width: '100%'}}>
                            <Text style={styles.title}>Seasonal Hippodrome Finder:</Text>
                            <View style={styles.seasonsContainer}>
                                {
                                    seasons.map((item, index) => (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={styles.seasonBtn}
                                            onPress={() => {
                                                setSelected(item);
                                                setVisible(true);
                                            }}
                                            >
                                            <ImageBackground source={item.image} style={{width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
                                                <Text style={styles.btnText}>{item.season}</Text>
                                                <LinearGradient
                                                    colors={['transparent', '#000']}
                                                    style={styles.overlay}
                                                />
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
            
                            <Text style={styles.title}>Daily Fact:</Text>
                            <View style={styles.factContainer}>
                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 14}}>
                                    <View style={{width: 20, height: 20, marginRight: 15}}>
                                        <Icons type={'tick'} />
                                    </View>
                                    <Text style={[styles.title, {marginBottom: 0}]}>Ascot Racecourse</Text>
                                </View>
                                <Text style={styles.fact}>{currentFact}</Text>
                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <TouchableOpacity style={[styles.factBtn, isSaved && {backgroundColor: '#313131'}]} onPress={() => handleSave(currentFact)}>
                                        <View style={{width: 20, height: 20}}>
                                            <Icons type={'save'} saved={isSaved} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.factBtn} onPress={() => handleShare(currentFact)}>
                                        <View style={{width: 20, height: 20}}>
                                            <Icons type={'share'} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{height: 100}} />
                        </ScrollView>        
                    </View>    
                )
            }

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#000'
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 34,
        paddingTop: height * 0.07,
        paddingHorizontal: 34,
        paddingBottom: 20,
        backgroundColor: '#171717',
        borderBottomColor: '#dabc67',
        borderBottomWidth: 1
    },

    upperBtn: {
        width: 48,
        height: 48,
        backgroundColor: '#000',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#dabc67',
        padding: 14
    },

    logo: {
        width: 86,
        height: 86,
        resizeMode: 'contain'
    },

    seasonsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 33
    },

    title: {
        fontWeight: '400',
        fontSize: 18,
        color: '#fff',
        lineHeight: 22,
        marginBottom: 20
    },

    seasonBtn: {
        width: '47%',
        height: 128,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#dabc67',   
        alignItems: 'center',
        overflow: 'hidden',
        margin: '1.5%'
    },

    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },

    btnText: {
        fontWeight: '600',
        fontSize: 17,
        color: '#fff',
        lineHeight: 22,
        zIndex: 10,
        marginBottom: 12
    },

    factContainer: {
        width: '100%',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#dabc67',   
        padding: 21,
    },

    fact: {
        fontWeight: '400',
        fontSize: 14,
        color: '#fff',
        lineHeight: 20,
        marginBottom: 10
    },

    factBtn: {
        width: '48%',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dabc67'
    },

    card: {
        width: '100%',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#dabc67',
        marginBottom: 20,
        overflow: 'hidden'
    },

    cardImg: {
        width: '100%',
        height: 188,
        resizeMode: 'cover',
    },

    cardName: {
        fontWeight: '400',
        fontSize: 16,
        color: '#fff',
        lineHeight: 22,
        marginBottom: 10
    },

    cardBtn: {
        width: 36,
        height: 36,
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#dabc67'
    },

    cardBtnText: {
        fontWeight: '700',
        fontSize: 14,
        color: '#000',
        lineHeight: 22,
    }

})

export default Seasonal;