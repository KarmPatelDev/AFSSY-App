import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, TextInput, Pressable } from 'react-native';
import Header from '../../../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { OPEN_WEATHER_KEY } from '../../../assets/ENV';
import Toast from 'react-native-toast-message';

let urlCurrent = `https://api.openweathermap.org/data/2.5/weather?units=metric&exclude=minutely&appid=${OPEN_WEATHER_KEY}`;
let urlDays = `https://api.openweathermap.org/data/2.5/forecast?units=metric&exclude=minutely&appid=${OPEN_WEATHER_KEY}`;

export default WeatherPredictionScreen = () => {

    const theme = useSelector(state => state.theme).data;

    const [forecast, setForecast] = useState(null);
    const [forecastDays, setForecastDays] = useState([]);
    const [city, setCity] = useState();
    const [showData, setShowData] = useState(false);

    const loadForecast = () => {
        setShowData(false);
        setForecast(null);
        setForecastDays([]);

        fetch( `${urlCurrent}&q=${city}`)
        .then((response) => {
            if(response.ok) return response.json();
            else return null;
        })
        .then(data => {
            if(!data){
                Toast.show({
                    type: 'error',
                    text1: 'Something Went Wrong',
                    text2: 'Weather records not found.'
                });
                return;
            }
            else{
                Toast.show({
                    type: 'success',
                    text1: `Weather records found for ${city}.`,
                    text2: ''
                });
                setForecast(data);
            }
            
        })
        .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Something Went Wrong',
              text2: "Please Try Letter. Check internet connection."
            });
            return;
        });

        fetch( `${urlDays}&q=${city}`)
        .then((response) => {
            if(response.ok) return response.json();
            else return null;
        })
        .then(data => {
            if(!data){
                Toast.show({
                    type: 'error',
                    text1: 'Something Went Wrong',
                    text2: 'Weather records not found.'
                })
                return;
            }
            else{
                Toast.show({
                    type: 'success',
                    text1: `Weather records found for ${city}.`,
                    text2: ''
                });
                setForecastDays(data.list);
            }  
        })
        .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Something Went Wrong',
              text2: "Please Try Letter. Check internet connection."
            });
            return;
        });

        setShowData(true);
    };

    return (<>
    <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

        <Header />

        <ScrollView>
            <View style={theme == "light" ? lightStyles.formArea : darkStyles.formArea}>
                <Text style={theme == "light" ? lightStyles.formTitle :  darkStyles.formTitle}>Enter Location</Text>

                <TextInput type='text' placeholder='Enter City' placeholderTextColor="#C0C0C0" onChangeText={(text) => setCity(text)} value={city} style={theme == "light" ? lightStyles.input : darkStyles.input}/>

                <Pressable style={theme == "light" ? lightStyles.submitButton : darkStyles.submitButton} onPress={() => loadForecast()}><Text style={theme == "light" ? lightStyles.submitButtonText : darkStyles.submitButtonText}>Search</Text></Pressable>
            </View>   

            <View style={{margin:10}}> 
            {
                showData && forecast
                ? 
                <>
                <View style={theme == "light" ? lightStyles.current : darkStyles.current}>
                <Image
                    style={theme == "light" ? lightStyles.largeIcon : darkStyles.largeIcon}
                    source={{
                    uri: `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`,
                    }}
                />
                <Text style={theme == "light" ? lightStyles.currentTemp : darkStyles.currentTemp}>{Math.round(forecast.main.temp)}°C</Text>
                </View>
                <Text style={theme == "light" ? lightStyles.currentDescription : darkStyles.currentDescription}>{forecast.weather[0].description}</Text>

                <Text style={theme == "light" ? lightStyles.subtitle : darkStyles.subtitle}>Hourly Forecast</Text>
                <FlatList horizontal
                    data={forecastDays}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(d, index) => {
                    var dt = new Date(d.item.dt * 1000);
                    var today = new Date().toLocaleDateString();
                    return (<View key={index}>
                        {
                            dt.toLocaleDateString() == today 
                            ?
                            <View style={theme == "light" ? lightStyles.hour : darkStyles.hour}>
                            <Text>{dt.toLocaleTimeString().replace(/:\d+ /, ' ')}</Text>
                            <Text>Temp - {Math.round(d.item.main.temp)}°C</Text>
                            <Text>Humidity - {Math.round(d.item.main.humidity)}%</Text>
                            <Text>Pressure - {Math.round(d.item.main.pressure)}mPa</Text>
                            <Text>Speed - {Math.round(d.item.wind.speed)}m/s</Text>
                            <Text>visibility - {Math.round(d.item.visibility)}km</Text>
                            <Image
                            style={theme == "light" ? lightStyles.smallIcon : darkStyles.smallIcon}
                            source={{
                                uri: `http://openweathermap.org/img/wn/${d.item.weather[0].icon}@4x.png`,
                            }}
                            />
                            <Text>{d.item.weather[0].description}</Text>
                            
                        </View>
                        : <></>
                        }
                    </View>);
                    }}
                />
            

                <Text style={theme == "light" ? lightStyles.subtitle : darkStyles.subtitle}>Next 5 Days</Text>
                {forecastDays.map((d, index) => { //Only want the next 5 days
                var dt = new Date(d.dt * 1000);
                var today = new Date().toLocaleDateString();
                return <View key={index}>
                    {
                        dt.toLocaleDateString() != today 
                        ?
                        <View style={theme == "light" ? lightStyles.day : darkStyles.day} key={d.dt}>
                            <Text style={theme == "light" ? lightStyles.dayTemp : darkStyles.dayTemp}>{Math.round(d.main.temp)}°C</Text>
                            <Image
                            style={theme == "light" ? lightStyles.smallIcon : darkStyles.smallIcon}
                            source={{
                                uri: `http://openweathermap.org/img/wn/${d.weather[0].icon}@4x.png`,
                            }}
                            />
                            <View style={theme == "light" ? lightStyles.dayDetails : darkStyles.dayDetails}>
                            <Text>{d.dt_txt}</Text>
                            <Text>{d.weather[0].description}</Text>
                            <Text>Humidity - {Math.round(d.main.humidity)}%</Text>
                            <Text>Pressure - {Math.round(d.main.pressure)}mPa</Text>
                            <Text>Speed - {Math.round(d.wind.speed)}m/s</Text>
                            <Text>visibility - {Math.round(d.visibility)}km</Text>
                            </View>
                        </View>
                    : <></>
                    }
                </View>})} 
                </>
                : <></>
            }
            </View>
      </ScrollView>
    </SafeAreaView>
    </>);
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex:1},
    formArea: {alignSelf: 'center',width: '90%', borderRadius: 5},
    formTitle: {top: 0, marginTop: 15, fontWeight: "bold", alignSelf: "center", fontSize: 24},
    subtitle: {fontSize: 24,marginVertical: 12,marginLeft: 4, fontWeight: "bold", color: "#1dbf73"},
    current: {flexDirection: 'row',alignItems: 'center',alignContent: 'center',},
    currentTemp: {fontSize: 32,fontWeight: 'bold',textAlign: 'center',},  
    currentDescription: {width: '100%',textAlign: 'center',fontWeight: '200',fontSize: 24,marginBottom: 24},
    hour: {padding: 6,alignItems: 'center',},
    day: {flexDirection: 'row',marginVertical:10,alignSelf: "center",borderWidth: 2,borderRadius: 20,width: "100%",padding: 15},
    dayDetails: {justifyContent: 'center',},
    dayTemp: {marginLeft: 12,alignSelf: 'center',fontSize: 20},
    largeIcon: {width: 250,height: 200,},
    smallIcon: {width: 100,height: 100,},
    input: {padding: 10,marginVertical: 20, width: "90%", alignSelf: 'center', borderRadius: 10},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginTop: 5,marginBottom:20,alignSelf: "center"},
    submitButtonText: {textAlign: 'center', color: '#000', fontSize: 18, fontWeight: "bold"},
    inputText: {alignSelf: "center", color: "#e60000", fontSize: 22}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    formTitle: {...defaultStyles.formTitle, color: "#FFF"},
    subtitle: {...defaultStyles.subtitle},
    current: {...defaultStyles.current},
    currentTemp: {...defaultStyles.currentTemp, color: "#FFF"},  
    currentDescription: {...defaultStyles.currentDescription},
    hour: {...defaultStyles.hour},
    day: {...defaultStyles.day, borderColor: "#FFF"},
    dayDetails: {...defaultStyles.dayDetails},
    dayTemp: {...defaultStyles.dayTemp},
    largeIcon: {...defaultStyles.largeIcon},
    smallIcon: {...defaultStyles.smallIcon},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText},
    inputText: {...defaultStyles.inputText}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    formTitle: {...defaultStyles.formTitle, color: "#FFF"},
    subtitle: {...defaultStyles.subtitle},
    current: {...defaultStyles.current},
    currentTemp: {...defaultStyles.currentTemp, color: "#000"},  
    currentDescription: {...defaultStyles.currentDescription},
    hour: {...defaultStyles.hour},
    day: {...defaultStyles.day,borderColor: "#252E2F"},
    dayDetails: {...defaultStyles.dayDetails},
    dayTemp: {...defaultStyles.dayTemp},
    largeIcon: {...defaultStyles.largeIcon},
    smallIcon: {...defaultStyles.smallIcon},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText},
    inputText: {...defaultStyles.inputText}
});