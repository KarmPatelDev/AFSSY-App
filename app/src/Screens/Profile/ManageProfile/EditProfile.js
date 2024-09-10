import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { ScrollView, Text, Pressable, View, TextInput, StyleSheet } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { changeUser } from "../../../redux/UserSlice";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-toast-message";

export default EditProfile = () => {

    const dispatch = useDispatch();

    const user = useSelector(state => state.user).data;
    const theme = useSelector(state => state.theme).data;

    const [name, setName] = useState(user.name);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [address, setAddress] = useState(user.address);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
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

            if(!name){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Enter valid name."
                });
                return;
            }
            else if(!phoneNumber || phoneNumber.length != 10){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Enter valid indian phone number."
                });
                return;
            }
            else if(!address){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Enter valid address."
                });
                return;
            }
            else if(!oldPassword){
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "Old Password mandatory to change profile."
                });
                return;
            }

            const userDetail = await auth().currentUser;
            const credentials = auth.EmailAuthProvider.credential(user.email, oldPassword);
            userDetail.reauthenticateWithCredential(credentials).then(() => {
                if(newPassword != confirmNewPassword){
                    Toast.show({
                        type: "error",
                        text1: "Something Went Wrong",
                        text2: 'New pasword not matched.'
                    });
                }
                else{
                    const password = newPassword == "" ? oldPassword : newPassword;
                    userDetail.updatePassword(password).then(() => {
                        if(imagePath && imageName){
                            // add image and update thumbnailUrl
                            const fileRef = storage().ref().child(`/Users/${user.uid}/${imageName}`);
            
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
                                const userDocRef = firestore().collection("Users").doc(user.uid);
                                userDocRef.update({
                                    name: name,
                                    phoneNumber: phoneNumber,
                                    address: address,
                                    profileUrl: downloadURL,
                                });
                                dispatch(changeUser({
                                    uid: user.uid,
                                    name: name,
                                    email: user.email,
                                    phoneNumber: phoneNumber,
                                    address: address,
                                    profileUrl: downloadURL,
                                    agroPosts: user.agroPosts,
                                    govSchemes: user.govSchemes,
                                    role: user.role
                                }));
                                Toast.show({
                                    type: "success",
                                    text1: "Successfully Updated",
                                    text2: ""
                                });
                                setOldPassword("");
                                setNewPassword("");
                                setConfirmNewPassword("");
                                });
                            }
                            );
                        }
                        else{
                            const userDocRef = firestore().collection("Users").doc(user.uid);
                            userDocRef.update({
                                name: name,
                                phoneNumber: phoneNumber,
                                address: address,
                            });
                            dispatch(changeUser({
                                uid: user.uid,
                                name: name,
                                email: user.email,
                                phoneNumber: phoneNumber,
                                address: address,
                                profileUrl: user.profileUrl,
                                agroPosts: user.agroPosts,
                                govSchemes: user.govSchemes,
                                role: user.role
                            }));
                            Toast.show({
                                type: "success",
                                text1: "Successfully Updated",
                                text2: ""
                            });
                            setOldPassword("");
                            setNewPassword("");
                            setConfirmNewPassword("");
                        }
                    }).catch((error) => {
                        Toast.show({
                            type: "error",
                            text1: "Something Went Wrong",
                            text2: `${error.message}`
                        });
                    });
                }
            }).catch((error) =>{
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: `${error.message}`
                });
            });  
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

                <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Edit Profile</Text></Pressable>

                <View>
                    <TextInput type='text' placeholder='Enter Name' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={name} onChangeText={(text) => setName(text)} />

                    <Text style={theme == "light" ? lightStyles.input : darkStyles.input}>{user.email}</Text>

                    <TextInput type='text' placeholder='Enter Phone Number' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)} />

                    <TextInput type='text' placeholder='Enter Address' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={address} onChangeText={(text) => setAddress(text)} />

                    <TextInput type='text' placeholder='Enter New Password' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={newPassword} onChangeText={(text) => setNewPassword(text)} secureTextEntry={true}/>

                    <TextInput type='text' placeholder='Enter Confirm Password' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={confirmNewPassword} onChangeText={(text) => setConfirmNewPassword(text)} secureTextEntry={true}/>

                    <Pressable style={theme == "light" ? lightStyles.uploadImage : darkStyles.uploadImage} onPress={() => openImagePicker()}><Text style={theme == "light" ? lightStyles.uploadImageText : darkStyles.uploadImageText}>Upload Profile</Text><Text style={theme == "light" ? lightStyles.uploadImageName : darkStyles.uploadImageName}> {imageName}</Text></Pressable>

                    <TextInput type='text' placeholder='Enter Old Password*' placeholderTextColor="#C0C0C0" style={theme == "light" ? lightStyles.input : darkStyles.input} value={oldPassword} onChangeText={(text) => setOldPassword(text)} secureTextEntry={true}/>

                    <Pressable style={theme == "light" ? lightStyles.submitButton : darkStyles.submitButton}><Text style={theme == "light" ? lightStyles.submitButtonText : darkStyles.submitButtonText} onPress={() => handleSubmit()}>Submit</Text></Pressable>
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
    uploadImage: {margin: 10, flexDirection:"row", alignItems:"center"},
    uploadImageText: {fontSize: 15, color:"#FFF", textAlign: "center", backgroundColor: "#575757", padding:10, borderRadius: 30},
    uploadImageName: {fontSize: 15, paddingLeft: 5, fontWeight: "bold"},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginVertical: 20,alignSelf: "center"},
    submitButtonText: {textAlign: 'center', color: '#000', fontSize: 18, fontWeight: "bold"},
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    uploadImage: {...defaultStyles.uploadImage},
    uploadImageText: {...defaultStyles.uploadImageText},
    uploadImageName: {...defaultStyles.uploadImageName},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText},
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    uploadImage: {...defaultStyles.uploadImage},
    uploadImageText: {...defaultStyles.uploadImageText},
    uploadImageName: {...defaultStyles.uploadImageName},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText},
});