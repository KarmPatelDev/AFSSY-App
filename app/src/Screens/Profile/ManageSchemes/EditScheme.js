import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { ScrollView, Text, Pressable, View, TextInput, StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export default EditScheme = () => {

    const route = useRoute();
    const scheme = route.params.scheme;
    const theme = useSelector(state => state.theme).data;

    const id = scheme.id;
    const [title, setTitle] = useState(scheme._data.title);
    const [description, setDescription] = useState(scheme._data.description);
    const [schemeUrl, setSchemeUrl] = useState(scheme._data.schemeUrl);
    const [imagePath, setImagePath] = useState("");
    const [imageName, setImageName] = useState("");

    const openImagePicker = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "User cancelled image picker."
                });
            } else if (response.error) {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: `${response.error}`
                });
            } else {
                const uri = response?.assets[0]?.uri;
                const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
                setImageName(response.assets[0].fileName);
                setImagePath(path);
            }
        });
    };

    const handleSubmit = async () => {
        try{
            if(!title || !description || !schemeUrl || !imageName){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Enter valid details."
                });
                return;
            }

            const result = await firestore().collection("Schemes").doc(id).update({
                "title": title,
                "description": description,
                "schemeUrl": schemeUrl,
                "thumbnailUrl": ""
            });

            // add image and update thumbnailUrl
            const fileRef = storage().ref().child(`/Schemes/${id}/${imageName}`);

            const uploadTask = fileRef.putFile(imagePath);

            uploadTask.on('state_changed', 
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // if(progress === 100){
                //     console.warn("Image Changed");
                // }
            }, 
            (error) => {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Image not Uploaded"
                });
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                const userDocRef = firestore().collection("Schemes").doc(id);
                userDocRef.update({
                    thumbnailUrl: downloadURL,
                });
                Toast.show({
                    type: "success",
                    text1: "Successfully Edited",
                    text2: ""
                });
                });
            }
            );
        }
        catch(error){
            Toast.show({
                type: "error",
                text1: "Something Went Wrong",
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

                <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Edit Scheme</Text></Pressable>

                <View>
                    <TextInput type='text' placeholder='Enter Title' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={title} onChangeText={(text) => setTitle(text)} />

                    <TextInput type='text' multiline={true} placeholder='Enter Description' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.inputArea : darkStyles.inputArea} value={description} onChangeText={(text) => setDescription(text)} />

                    <TextInput type='text' placeholder='Enter Scheme URL' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={schemeUrl} onChangeText={(text) => setSchemeUrl(text)} />

                    <Pressable style={theme == "light" ? lightStyles.uploadImage : darkStyles.uploadImage} onPress={() => openImagePicker()}><Text style={theme == "light" ? lightStyles.uploadImageText : darkStyles.uploadImageText}>Upload Image</Text><Text style={theme == "light" ? lightStyles.uploadImageName : darkStyles.uploadImageName}> {imageName}</Text></Pressable>

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
    inputArea: {borderRadius: 10,padding: 8,marginVertical: 20,width: "90%",alignSelf: 'center',height: 125},
    uploadImage: {margin: 10, flexDirection:"row", alignItems:"center"},
    uploadImageText: {fontSize: 15, color:"#FFF", textAlign: "center", backgroundColor: "#575757", padding:10, borderRadius: 30},
    uploadImageName: {fontSize: 15, paddingLeft: 5, fontWeight: "bold"},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginVertical: 20,alignSelf: "center"},
    submitButtonText: {textAlign: 'center', color: '#000', fontSize: 18, fontWeight: "bold"}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    inputArea: {...defaultStyles.inputArea, backgroundColor: '#FFF', color: "#000"},
    uploadImage: {...defaultStyles.uploadImage},
    uploadImageText: {...defaultStyles.uploadImageText},
    uploadImageName: {...defaultStyles.uploadImageName},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    inputArea: {...defaultStyles.inputArea, backgroundColor: '#252E2F', color: "#FFF"},
    uploadImage: {...defaultStyles.uploadImage},
    uploadImageText: {...defaultStyles.uploadImageText},
    uploadImageName: {...defaultStyles.uploadImageName},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText}
});