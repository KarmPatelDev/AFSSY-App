import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { ScrollView, Text, Pressable, View, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { changeUser } from "../../../redux/UserSlice";

export default RegisterScreen = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme).data;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
        try{

            if(!email || !password || !confirmPassword){
                Toast.show({
                  type: 'error',
                  text1: 'Something Went Wrong',
                  text2: "Enter Valid Details."
                });
                return;
            }

            if(password == confirmPassword){
                const result = await auth().createUserWithEmailAndPassword(email, password);
                await result.user.updateProfile({
                    displayName: "User"
                });
                const res = await firestore().collection("Users").doc(result.user.uid).set({
                    name: "",
                    email: email,
                    phoneNumber: "",
                    address: "",
                    profileUrl: "",
                    govSchemes: [],
                    agroPosts: [],
                    role: 1
                });
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                navigation.navigate("MainBar", { screen: 'Home'});
                Toast.show({
                    type: 'success',
                    text1: 'Successfully Registered.',
                    text2: ""
                });
            }
            else{
                Toast.show({
                    type: 'error',
                    text1: 'Something Went Wrong',
                    text2: "Password not matched."
                });
            }
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

                <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}>
                    <Text style={theme == "dark" ? lightStyles.titleText : darkStyles.titleText}>Register</Text>
                </Pressable>

                <View>

                    <TextInput type='text' placeholder='Enter Email' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={email} onChangeText={(text) => setEmail(text)} />

                    <TextInput type='text' placeholder='Enter Password' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={true} />

                    <TextInput type='text' placeholder='Enter Confirm Password' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} secureTextEntry={true} />

                    <Pressable style={theme == "light" ? lightStyles.submitButton : darkStyles.submitButton} onPress={() => handleSubmit()}>
                        <Text style={theme == "light" ? lightStyles.submitButtonText : darkStyles.submitButtonText}>Submit</Text>
                    </Pressable>

                    <View style={theme == "light" ? lightStyles.register : darkStyles.register}>
                        <Text>If you have an account,</Text> 
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text style={theme == "light" ? lightStyles.registerText : darkStyles.registerText}>Click Here</Text>
                        </Pressable>
                    </View>

                </View>
                
            </View>

            </ScrollView>

        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex: 1},
    formArea: {flex: 1,width: '90%',alignSelf: "center",borderRadius: 15,marginVertical: 25},
    title: {margin: 10 },
    titleText: {fontSize: 25,fontWeight: 'bold',textAlign: "center"},
    input: {padding: 10,marginVertical: 20, width: "90%", alignSelf: 'center', borderRadius: 10},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginVertical: 20,alignSelf: "center"},
    submitButtonText: {textAlign: 'center',color: '#000',fontSize: 18,fontWeight: "bold"},
    register: {flexDirection: "row",gap: 5,alignSelf: "center",marginVertical: 5},
    registerText: {color:"#e60000"}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    formArea: { ...defaultStyles.formArea, backgroundColor: "#5257f1"},
    title: { ...defaultStyles.title },
    titleText: { ...defaultStyles.titleText,color:"#FFF"},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    submitButton: { ...defaultStyles.submitButton },
    submitButtonText: { ...defaultStyles.submitButtonText },
    register: { ...defaultStyles.register },
    registerText: { ...defaultStyles.registerText }
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    formArea: { ...defaultStyles.formArea, backgroundColor: "#5257f1"},
    title: { ...defaultStyles.title },
    titleText: { ...defaultStyles.titleText,color:"#FFF"},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    submitButton: { ...defaultStyles.submitButton },
    submitButtonText: { ...defaultStyles.submitButtonText },
    register: { ...defaultStyles.register },
    registerText: { ...defaultStyles.registerText }
});