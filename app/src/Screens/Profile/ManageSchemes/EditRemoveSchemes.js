import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { Text, ScrollView, Pressable, View, Image, Linking, StyleSheet, LogBox } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export default EditRemoveSchemes = () => {

    const navigation = useNavigation();
    const theme = useSelector(state => state.theme).data;
    const [schemes, setSchemes] = useState([]);
    LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state', ]);

    useEffect(() => {
        getSchemes();
    }, []);

    const getSchemes = async () => {
        try{
            const allSchemes = await firestore().collection("Schemes").get();
            setSchemes(allSchemes.docs);
        }
        catch(error){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: `${error.message}`
            });
        }
    };

    const deleteScheme = async (id) => {
        try{
            await firestore().collection("Schemes").doc(id).delete();
            Toast.show({
                type: 'success',
                text1: 'Successfully Deleted',
                text2: ''
            });
            getSchemes();
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

            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Edit/Remove Schemes</Text></Pressable>

            <View>
                {
                    schemes && schemes.map((scheme) => {
                        return (
                        <Pressable key={scheme.id} style={theme == "light" ? lightStyles.schemeContainer : darkStyles.schemeContainer}>
                            <View style={theme == "light" ? lightStyles.scheme : darkStyles.scheme}>
                                {scheme._data.thumbnailUrl ? <Image style={theme == "light" ? lightStyles.schemeImage : darkStyles.schemeImage} source={{uri:scheme._data.thumbnailUrl}} /> : <></>}
                                <Text style={theme == "light" ? lightStyles.schemeTitle : darkStyles.schemeTitle}>{scheme._data.title}</Text>
                                <Text style={theme == "light" ? lightStyles.schemeDescription : darkStyles.schemeDescription}>{scheme._data.description.substring(0, 120)}...</Text>
                                <Pressable onPress={() => { Linking.openURL(scheme._data.schemeUrl)}} style={theme == "light" ? lightStyles.readMore : darkStyles.readMore}>
                                    <Text style={theme == "light" ? lightStyles.readMoreText : darkStyles.readMoreText}>Read More </Text>
                                    <Entypo name="arrow-with-circle-right" size={22} color="#000" />
                                </Pressable> 
                                <View style={theme == "light" ? lightStyles.schemeEditRemove : darkStyles.schemeEditRemove}>
                                    <Pressable style={theme == "light" ? lightStyles.schemeEdit : darkStyles.schemeEdit} onPress={() => navigation.navigate("EditScheme", {scheme: scheme})}>
                                        <Feather name="edit" size={22} color="#FFF" />
                                        <Text style={theme == "light" ? lightStyles.schemeEditText : darkStyles.schemeEditText}> Edit</Text>
                                    </Pressable> 

                                    <Pressable style={theme == "light" ? lightStyles.schemeRemove : darkStyles.schemeRemove} onPress={() => deleteScheme(scheme.id)}>
                                        <AntDesign name="delete" size={22} color="#FFF" />
                                        <Text style={theme == "light" ? lightStyles.schemeRemoveText : darkStyles.schemeRemoveText}> Delete</Text>
                                    </Pressable> 
                                </View>
                            </View>
                        </Pressable>
                        );
                    })
                }    
            </View>

            </ScrollView> 

        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex: 1},
    title: {margin: 10},
    titleText: {fontSize: 25, fontWeight: 'bold', textAlign: "center"},
    schemeContainer: {margin: 10, padding: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 10},
    scheme: {marginHorizontal: 12, marginTop: 10},
    schemeImage: {width: "100%", height: 200, borderWidth: 2, borderColor: "#000", borderRadius: 10, marginBottom: 10, objectFit: "fill"},
    schemeTitle: {fontSize: 25, fontWeight: 'bold', color:"#1dbf73"},
    schemeDescription: {fontSize: 17, fontWeight: 'bold'},
    readMore: {flexDirection: 'row', gap: 3, backgroundColor: '#FFD140', padding: 5, borderRadius: 5, width: 130, marginTop: 10},
    readMoreText: {textAlign: 'left', color: '#000', fontSize: 17},
    schemeEditRemove: {flexDirection: "row", justifyContent: "space-between"},
    schemeEdit: {flexDirection: 'row', gap: 3, backgroundColor: '#0171DF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, width: 80, marginTop: 10},
    schemeEditText: {textAlign: 'left', color: '#FFF', fontSize: 17},
    schemeRemove: {flexDirection: 'row', gap: 3, backgroundColor: '#d9534f', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, width: 100, marginTop: 10},
    schemeRemoveText: {textAlign: 'left', color: '#FFF', fontSize: 17}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#0171DF"},
    schemeContainer: {...defaultStyles.schemeContainer, backgroundColor: '#FFF'},
    scheme: {...defaultStyles.scheme},
    schemeImage: {...defaultStyles.schemeImage},
    schemeTitle: {...defaultStyles.schemeTitle},
    schemeDescription: {...defaultStyles.schemeDescription, color:"#000"},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText},
    schemeEditRemove: {...defaultStyles.schemeEditRemove},
    schemeEdit: {...defaultStyles.schemeEdit},
    schemeEditText: {...defaultStyles.schemeEditText},
    schemeRemove: {...defaultStyles.schemeRemove},
    schemeRemoveText: {...defaultStyles.schemeRemoveText}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    schemeContainer: {...defaultStyles.schemeContainer, backgroundColor: '#252E2F'},
    scheme: {...defaultStyles.scheme},
    schemeImage: {...defaultStyles.schemeImage},
    schemeTitle: {...defaultStyles.schemeTitle},
    schemeDescription: {...defaultStyles.schemeDescription, color:"#FFF"},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText},
    schemeEditRemove: {...defaultStyles.schemeEditRemove},
    schemeEdit: {...defaultStyles.schemeEdit},
    schemeEditText: {...defaultStyles.schemeEditText},
    schemeRemove: {...defaultStyles.schemeRemove},
    schemeRemoveText: {...defaultStyles.schemeRemoveText}
});