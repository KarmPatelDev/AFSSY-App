import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { StyleSheet, View, Text, ScrollView, Pressable, Linking, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import firestore from "@react-native-firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { changeUser } from "../../../redux/UserSlice";
import Toast from "react-native-toast-message";

export default LikedGovSchemes = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user).data;
    const theme = useSelector(state => state.theme).data;

    const [schemes, setSchemes] = useState([]);

    const [likedSchemes, setLikedSchemes] = useState(user.govSchemes);

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

    const removeLikedSchemes = async (id) => {
        try{
            const tempSchemes = user.govSchemes.filter((schemeId) => schemeId != id);
            const userDocRef = firestore().collection("Users").doc(user.uid);
            userDocRef.update({
                govSchemes: tempSchemes
            });
            dispatch(changeUser({
                uid: user.uid,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                profileUrl: user.downloadURL,
                agroPosts: user.agroPosts,
                govSchemes: tempSchemes,
                role: user.role
            }));
            setLikedSchemes(tempSchemes);
            Toast.show({
                type: 'success',
                text1: 'Scheme removed from saved schemes.',
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

    return(<>
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />

            <ScrollView>

            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Liked Gov. Schemes</Text></Pressable>

                <View>

                    {
                        schemes && schemes.map((scheme) => {
                            return (
                            <View key={scheme.id}>
                            {
                                user && likedSchemes && likedSchemes.includes(scheme.id) ?
                                <Pressable key={scheme.id} style={theme == "light" ? lightStyles.schemeContainer : darkStyles.schemeContainer}>
                                    <View style={theme == "light" ? lightStyles.scheme : darkStyles.scheme}>
                                        { scheme._data.thumbnailUrl ? <Image style={theme == "light" ? lightStyles.schemeImage : darkStyles.schemeImage} source={{uri:scheme._data.thumbnailUrl}} /> : <></> }
                                        <Text style={theme == "light" ? lightStyles.schemeTitle : darkStyles.schemeTitle}>{scheme._data.title}</Text>
                                        <Text style={theme == "light" ? lightStyles.schemeDescription : darkStyles.schemeDescription}>{scheme._data.description.substring(0, 120)}...</Text>

                                        <View style={theme == "light" ? lightStyles.schemeEdit : darkStyles.schemeEdit}>
                                        <Pressable onPress={() => { Linking.openURL(scheme._data.schemeUrl)}} style={theme == "light" ? lightStyles.readMore : darkStyles.readMore}>
                                            <Text style={theme == "light" ? lightStyles.readMoreText : darkStyles.readMoreText}>Read More </Text>
                                            <Entypo name="arrow-with-circle-right" size={22} color="#000" />
                                        </Pressable> 
                                        <View>
                                            <AntDesign name="heart" size={25} color="#e60000" onPress={() => removeLikedSchemes(scheme.id)} />
                                        </View>
                                        </View>
                                    </View>
                                </Pressable>
                                :
                                <></>
                            }
                            </View>);
                        })
                    }
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    
    </>);
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
    schemeEdit: {flexDirection: "row", justifyContent: "space-between", marginTop: 10},
    readMore: {flexDirection: 'row', gap: 3, backgroundColor: '#FFD140', padding: 5, borderRadius: 5},
    readMoreText: {textAlign: 'left', color: '#000', fontSize: 17},
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
    schemeEdit: {...defaultStyles.schemeEdit},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText},
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
    schemeEdit: {...defaultStyles.schemeEdit},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText},
});