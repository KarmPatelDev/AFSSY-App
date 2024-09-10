import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { GEOAPIFY_API_KEY } from "../../../assets/ENV";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export default FindResourcesScreen = () => {

    const navigation = useNavigation();
    const theme = useSelector(state => state.theme).data;

    const [postalCode, setPostalCode] = useState("");

    const getGeoCode = () => { 

      if(!postalCode || postalCode.length != 6){
        Toast.show({
          type: 'error',
          text1: 'Something Went Wrong',
          text2: "Enter 6 digit pincode."
        });
      }
      else{
        fetch(`https://api.geoapify.com/v1/geocode/search?postcode=${postalCode}&apiKey=${GEOAPIFY_API_KEY}`, {
          method: 'GET',
        })
        .then(response => response.json())
        .then(result => {
          if(result.features[0]){
            navigation.navigate("ShowMap", {
              latitude: result.features[0].properties.lat,
              longitude: result.features[0].properties.lon,
              postalCode: postalCode
            });
          }
          else{
            Toast.show({
              type: 'error',
              text1: 'Something Went Wrong',
              text2: "Couldn't find pincode."
            });
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
      }
    };

    return(<>
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>
            
            {/* Header */}
            <Header />
            
            <View style={theme == "light" ? lightStyles.formArea : darkStyles.formArea}>
                <Text style={theme == "light" ? [lightStyles.textContainer, lightStyles.formTitle] : [darkStyles.textContainer, darkStyles.formTitle]}>Enter Location</Text>
                <View>
                    <TextInput type='number' placeholder='Enter Postal Code' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} onChangeText={(text) => setPostalCode(text)} value={postalCode} maxLength={6}/>

                    <Pressable style={theme == "light" ? lightStyles.submitButton : darkStyles.submitButton} onPress={() => getGeoCode()}><Text style={theme == "light" ? lightStyles.submitButtonText : darkStyles.submitButtonText}>Submit</Text></Pressable>
                    
                </View>
                
            </View>

        </SafeAreaView>
    </>);
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex: 1},
    textContainer: {color: '#FCFDFF',fontFamily: 'Roboto-Bold',fontSize: 24,marginBottom: 30,position: 'relative',top: '20%',alignSelf: 'center'},
    formArea: {alignSelf: 'center',width: '90%', borderRadius: 5, top: '20%'},
    formTitle: {top: 0,marginTop: 15, fontWeight: "bold"},
    input: {padding: 10,marginVertical: 20, width: "90%", alignSelf: 'center', borderRadius: 10},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginVertical: 20,alignSelf: "center"}, 
    submitButtonText: {textAlign: 'center', color: '#000', fontSize: 18, fontWeight: "bold"},
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    textContainer: {...defaultStyles.textContainer},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    formTitle: {...defaultStyles.formTitle, color: "#FFF"},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    submitButton: {...defaultStyles.submitButton}, 
    submitButtonText: {...defaultStyles.submitButtonText},
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    textContainer: {...defaultStyles.textContainer},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    formTitle: {...defaultStyles.formTitle, color: "#FFF"},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    submitButton: {...defaultStyles.submitButton}, 
    submitButtonText: {...defaultStyles.submitButtonText},
});