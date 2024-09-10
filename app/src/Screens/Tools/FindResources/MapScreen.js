import React, { useState, useEffect } from "react";
import { WebView } from 'react-native-webview';
import { useRoute } from "@react-navigation/native";
import { GEOAPIFY_API_KEY } from "../../../assets/ENV";
import firestore from "@react-native-firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

export default MapScreen = () => {

    const route = useRoute();
    const navigation = useNavigation();
    const latitude = route.params.latitude;
    const longitude = route.params.longitude;
    const postalCode = route.params.postalCode;
    const [url, setUrl] = useState("");

    const theme = useSelector(state => state.theme).data;

    useEffect(() => {
        getResources();
    }, []);

    const getResources = async () => {
        const allResources = await firestore().collection("Resources").doc(postalCode).get();

        if(!allResources.data()){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: "Couldn't find resources."
            });
            navigation.goBack();
            return;
        }
        

        var resultant = `https://maps.geoapify.com/v1/staticmap?style=positron&width=500&height=500&center=lonlat:${longitude},${latitude}&zoom=11.7625&marker=lonlat:${longitude},${latitude};type:awesome;color:%23bb3f73;size:x-large;icon:paw`;
        {
            allResources.data().Tubewells && allResources.data().Tubewells.map((item) => {
                if (Math.sqrt(
                    Math.pow(69.1 * (item.latitude - latitude), 2) +
                    Math.pow(69.1 * (longitude - item.longitude) * Math.cos(item.latitude / 57.3), 2)) <= 5) {
                        resultant = resultant.concat(`|lonlat:${item.longitude},${item.latitude};type:awesome;color:%2332dce1;size:large;icon:tint;iconsize:small;textsize:small`);
                }
            })
        }
        {
            allResources.data().AgroCenters && allResources.data().AgroCenters.map((item) => {
                if (Math.sqrt(
                    Math.pow(69.1 * (item.latitude - latitude), 2) +
                    Math.pow(69.1 * (longitude - item.longitude) * Math.cos(item.latitude / 57.3), 2)) <= 5) {
                        resultant = resultant.concat(`|lonlat:${item.longitude},${item.latitude};type:awesome;color:%23dfec52;size:large;icon:store;iconsize:small;textsize:small`);
                }
            })
        }
        {
            allResources.data().APMCs && allResources.data().APMCs.map((item) => {
                if (Math.sqrt(
                    Math.pow(69.1 * (item.latitude - latitude), 2) +
                    Math.pow(69.1 * (longitude - item.longitude) * Math.cos(item.latitude / 57.3), 2)) <= 5) {
                        resultant = resultant.concat(`|lonlat:${item.longitude},${item.latitude};type:awesome;color:%2352ec68;size:large;icon:warehouse;iconsize:small;textsize:small`);
                }
            })
        }
        resultant = resultant.concat(`&apiKey=${GEOAPIFY_API_KEY}`);
        setUrl(resultant);  
    };


    return (
        <>
        {
            url !== "" ? <WebView source={{ uri: url}} style={{ flex: 1 }} /> : <View style={{flex: 1}}><Text style={theme == "light" ? lightStyles.title : darkStyles.title}>Loading...</Text></View>
        }
        </>
    );
};

const defaultStyles = StyleSheet.create({
    title: {alignSelf: "center", fontSize:25, fontWeight: "bold", color: "#d9534f"},
});

const lightStyles = StyleSheet.create({
    title: {...defaultStyles.title},
});

const darkStyles = StyleSheet.create({
    title: {...defaultStyles.title},
});