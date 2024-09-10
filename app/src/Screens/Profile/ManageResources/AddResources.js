import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { ScrollView, Text, Pressable, View, TextInput, StyleSheet } from "react-native";
import Dropdown from 'react-native-input-select';
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default AddResources = () => {

    const theme = useSelector(state => state.theme).data;

    const [resource, setResource] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const handleSubmit = async () => {
        try{
            if(!resource || !postalCode || !latitude || !longitude){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Invalid Details"
                });
                return;
            }
            else if(postalCode.length != 6){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Enter 6 digits pincode."
                });
                return;
            }

            const result = await firestore().collection("Resources").doc(postalCode).get();
            if(!result.exists){
                await firestore().collection("Resources").doc(postalCode).set({
                    "Tubewells": [],
                    "AgroCenters": [],
                    "APMCs": []
                });
            }
            updateData();
        }
        catch(error){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: `${error.message}`
            });
        }
    };

    const updateData = async () => {
        try{
            const result = await firestore().collection("Resources").doc(postalCode).get();
            if(result.exists){
                await firestore().collection("Resources").doc(postalCode).update({
                    [resource] : [...result.data()[resource], {"latitude": latitude, "longitude": longitude}],
                });
            }
            setResource("");
            setPostalCode("");
            setLatitude("");
            setLongitude("");
            Toast.show({
                type: 'success',
                text1: 'Successfully Added.',
                text2: ""
            });
        }
        catch(error){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: `${error.message}`
            });
        }
    };

    return (
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />

            <ScrollView>

            <View style={theme == "light" ? lightStyles.formArea : darkStyles.formArea}>

                <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Add Resources</Text></Pressable>

                <View>
                    
                    <Dropdown
                        placeholder="Select an resource..."
                        options={[
                            { label: 'Tubewells', value: 'Tubewells' },
                            { label: 'AgroCenters', value: 'AgroCenters' },
                            { label: 'APMCs', value: 'APMCs' },
                        ]}
                        selectedValue={resource}
                        onValueChange={(text) => setResource(text)}
                        dropdownStyle={theme == "light" ? lightStyles.input : darkStyles.input}
                        placeholderStyle={{color: 'purple', fontSize: 15, fontWeight: '500'}}
                        checkboxLabelStyle={theme == "light" ? {color: "#000"} : {color:"#000"}}
                    />

                    <TextInput type='number' placeholder='Enter Postal Code' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} onChangeText={(text) => setPostalCode(text)} value={postalCode} maxLength={6}/>

                    <TextInput type='text' placeholder='Enter Latitude' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={latitude} onChangeText={(text) => setLatitude(text)} />

                    <TextInput type='text' placeholder='Enter Longitude' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={longitude} onChangeText={(text) => setLongitude(text)} />

                    <Pressable style={theme == "light" ? lightStyles.submitButton : darkStyles.submitButton} onPress={() => handleSubmit()}><Text style={theme == "light" ? lightStyles.submitButtonText : darkStyles.submitButtonText}>Submit</Text></Pressable>
                    
                </View>
                
            </View>   

            </ScrollView>

        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex: 1},
    title: {margin: 10},
    titleText: {fontSize: 25, fontWeight: 'bold', textAlign: "center"},
    formArea: {flex: 1,width: '90%',alignSelf: "center",borderRadius: 15,marginVertical: 25},
    input: {padding: 10,marginVertical: 20, width: "90%", alignSelf: 'center', borderRadius: 10},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginVertical: 20,alignSelf: "center"},
    submitButtonText: {textAlign: 'center', color: '#000', fontSize: 18, fontWeight: "bold"}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText}
});