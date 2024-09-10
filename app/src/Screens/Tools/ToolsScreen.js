import React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import Header from "../../Components/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import Tool from "../../Components/Tool";
import { useSelector } from "react-redux";

export default ToolsScreen = () => {

    const theme = useSelector(state => state.theme).data;

    return (
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />
            
            <ScrollView>

            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>AGRO TOOLS</Text></Pressable>

                <View>
                    <Tool data={{
                        title: "Find Resources",
                        description: "Locate Proximate Resources",
                        features: ["Tubewells", "Agro-Centers", "APMCs"],
                        image: <MaterialCommunityIcons name="file-image-marker" size={90} color="#1dbf73" />,
                        navigate: "FindResources"
                    }} />

                    <Tool data={{
                        title: "Gov. Schemes",
                        description: "Best Schemes That Help Farmers",
                        features: ["Crop Insurance", "Agro-Infra Funds", "APMCs"],
                        image: <MaterialIcons name="compost" size={80} color="#1dbf73" />,
                        navigate: "GovSchemes"
                    }} />

                    <Tool data={{
                        title: "Agro-Posts",
                        description: "Enhance Knowledge With New Methods of Agriculture",
                        features: ["IoT", "GIS", "AI/ML", "Drones"],
                        image: <MaterialIcons name="post-add" size={80} color="#1dbf73" />,
                        navigate: "AgroPosts"
                    }} />

                    <Tool data={{
                        title: "Plant Diesease Prediction",
                        description: "Plant Disease Predict using Plant Image or Camera",
                        features: ["Potato", "Tomato", "Pepper"],
                        image: <MaterialCommunityIcons name="image-search-outline" size={80} color="#1dbf73" />,
                        navigate: "PlantDiseasePrediction"
                    }} />

                    <Tool data={{
                        title: "Realtime Market Price",
                        description: "APMCs Realtime Commodities Price",
                        features: ["States", "Districts", "Markets", "Commodities"],
                        image: <Ionicons name="pricetags-outline" size={90} color="#1dbf73" />,
                        navigate: "RealtimeMarketPrice"
                    }} />

                    <Tool data={{
                        title: "Weather Prediction",
                        description: "Accurate Weather Prediction",
                        features: ["Temperature", "Humidity", "Wind", "Pressure"],
                        image: <MaterialCommunityIcons name="weather-partly-rainy" size={90} color="#1dbf73" />,
                        navigate: "WeatherPrediction"
                    }} />

                    <Tool data={{
                        title: "Chatbot",
                        description: "Ask Your Questions",
                        features: ["Crops", "Resources", "Schemes", "Posts"],
                        image: <MaterialCommunityIcons name="robot-happy-outline" size={90} color="#1dbf73" />,
                        navigate: "Chatbot"
                    }} />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex:1, paddingBottom: 50},
    title: {margin: 10},
    titleText: {fontSize: 25, fontWeight: 'bold', textAlign: "center"},
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#0171DF"},
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
});