import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { ScrollView, Text, Pressable, View, StyleSheet } from "react-native";
import { Table, Row} from 'react-native-reanimated-table';
import firestore from "@react-native-firebase/firestore";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export default EditRemoveResources = () => {

    const theme = useSelector(state => state.theme).data;
    const [resources, setResources] = useState();

    useEffect(() => {
        getResources();
    }, []);

    const getResources = async () => {
        try{
            const allResources = await firestore().collection("Resources").get();
            setResources(allResources.docs);
        }
        catch(error){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: `${error.message}`
            });
        }
    };

    const deleteResource = async (id, resource, deleteIndex) => {
        try{
            const docRef = firestore().collection("Resources").doc(id);
            docRef.get().then((docSnap) => {
                const result = docSnap.data()[resource].filter((res, index) => index !== deleteIndex);
                docRef.update({
                    [resource]: result,
                });
            });
            getResources();
            Toast.show({
                type: 'success',
                text1: 'Successfully Deleted',
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
    }

    return (
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />

            <ScrollView>

            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Edit/Remove Resources</Text></Pressable>

            <View>

                {
                    resources && resources.map((resource) => {
                        return(
                            <View key={resource.id} style={theme == "light" ? lightStyles.resourceContainer : darkStyles.resourceContainer}>
                                <View><Text style={theme == "light" ? lightStyles.resource : darkStyles.resource}>{resource.id}</Text></View>

                                <View><Text style={theme == "light" ? lightStyles.resourceTitle : darkStyles.resourceTitle}>TubeWells</Text></View>

                                <View style={theme == "light" ? lightStyles.container : darkStyles.container}>
                                    <Table borderStyle={theme == "light" ? lightStyles.borderStyle : darkStyles.borderStyle}>
                                        <Row data={['Latitude', 'Longitude', 'Edit']} style={theme == "light" ? lightStyles.head : darkStyles.head} textStyle={theme == "light" ? lightStyles.text : darkStyles.text}/>
                                        {
                                            resource.data().Tubewells.map((tubewell, index) => <Row data={[tubewell.latitude, tubewell.longitude, <Pressable onPress={()=> deleteResource(resource.id, "Tubewells", index)} style={{alignSelf:"center"}}><AntDesign name="delete" size={22} color="#d9534f"/></Pressable>]} textStyle={theme == "light" ? lightStyles.text : darkStyles.text} key={index}/>)
                                        }
                                    </Table>
                                </View>

                                <View><Text style={theme == "light" ? lightStyles.resourceTitle : darkStyles.resourceTitle}>AgroCenters</Text></View>

                                <View style={theme == "light" ? lightStyles.container : darkStyles.container}>
                                    <Table borderStyle={theme == "light" ? lightStyles.borderStyle : darkStyles.borderStyle}>
                                        <Row data={['Latitude', 'Longitude', 'Edit']} style={theme == "light" ? lightStyles.head : darkStyles.head} textStyle={theme == "light" ? lightStyles.text : darkStyles.text}/>
                                        {
                                            resource.data().AgroCenters.map((agrocenter, index) => <Row data={[agrocenter.latitude, agrocenter.longitude, <Pressable onPress={()=> deleteResource(resource.id, "AgroCenters", index)} style={{alignSelf:"center"}}><AntDesign name="delete" size={22} color="#d9534f"/></Pressable>]} textStyle={theme == "light" ? lightStyles.text : darkStyles.text} key={index}/>)
                                        }
                                    </Table>
                                </View>

                                <View><Text style={theme == "light" ? lightStyles.resourceTitle : darkStyles.resourceTitle}>APMCs</Text></View>

                                <View style={theme == "light" ? lightStyles.container : darkStyles.container}>
                                    <Table borderStyle={theme == "light" ? lightStyles.borderStyle : darkStyles.borderStyle}>
                                        <Row data={['Latitude', 'Longitude', 'Edit']} style={theme == "light" ? lightStyles.head : darkStyles.head} textStyle={theme == "light" ? lightStyles.text : darkStyles.text}/>
                                        {
                                            resource.data().APMCs.map((apmc, index) => <Row data={[apmc.latitude, apmc.longitude, <Pressable onPress={()=> deleteResource(resource.id, "APMCs", index)} style={{alignSelf:"center"}}><AntDesign name="delete" size={22} color="#d9534f"/></Pressable>]} textStyle={theme == "light" ? lightStyles.text : darkStyles.text} key={index}/>)
                                        }
                                    </Table>
                                </View>

                            </View>
            
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
    resourceContainer: {margin: 10, backgroundColor: 'white', padding: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 10, marginVertical: 15},
    resource: {fontSize: 25, fontWeight: "bold", marginVertical: 10, color: "#000"},
    resourceTitle: {fontSize: 20, fontWeight: "bold", color:"#1dbf73"},
    table: {marginVertical: 10},
    borderStyle: {borderWidth: 1},
    container: {padding: 16, width: "95%", alignSelf: "center", borderRadius: 10,marginVertical: 15},
    head: {height: 40},
    row: {height: 28},
    text: {textAlign: 'center', paddingVertical: 5}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#0171DF"},
    resourceContainer: {...defaultStyles.resourceContainer},
    resource: {...defaultStyles.resource},
    resourceTitle: {...defaultStyles.resourceTitle},
    table: {...defaultStyles.table},
    borderStyle: {...defaultStyles.borderStyle, borderColor: "#000"},
    container: {...defaultStyles.container, backgroundColor: '#fff'},
    head: {...defaultStyles.head,  backgroundColor: '#f1f8ff'},
    row: {...defaultStyles.row},
    text: {...defaultStyles.text, color: "#000"}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    resourceContainer: {...defaultStyles.resourceContainer},
    resource: {...defaultStyles.resource},
    resourceTitle: {...defaultStyles.resourceTitle},
    table: {...defaultStyles.table},
    borderStyle: {...defaultStyles.borderStyle, borderColor: "#FFF"},
    container: {...defaultStyles.container, backgroundColor: '#252E2F'},
    head: {...defaultStyles.head},
    row: {...defaultStyles.row},
    text: {...defaultStyles.text, color: "#FFF"}
});