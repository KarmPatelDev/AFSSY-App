import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../Components/Header";
import { ScrollView, StyleSheet, Pressable, Text, View, Image, FlatList, Linking } from "react-native";
import { useSelector } from "react-redux";
import Entypo from "react-native-vector-icons/Entypo";
import Features from "../../assets/Features";
import Partners from "../../assets/Partners";
import Tools from "../../assets/Tools";
import { useNavigation } from "@react-navigation/native";

export default HomeScreen = () => {

    const theme = useSelector(state => state.theme).data;

    const navigation = useNavigation();
    
    return (
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />

            <ScrollView>


            <View style={theme == "light" ? lightStyles.featuresContainer : darkStyles.featuresContainer}>
            <FlatList horizontal
                data={Features}
                keyExtractor={(item, index) => index}
                renderItem={(d) => {
                return (
                <Pressable key={d.item.id} style={theme == "light" ? lightStyles.featureContainer : darkStyles.featureContainer}>
                    {d.item.imageUrl ? <Image style={theme == "light" ? lightStyles.featureImage : darkStyles.featureImage} source={{uri: d.item.imageUrl}} /> : <></>}
                </Pressable>
                );
                }}
            />
            </View>


            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>AGRO TOOLS</Text></Pressable>

            <View style={theme == "light" ? lightStyles.toolsContainer : darkStyles.toolsContainer}>
                {
                    Tools && Tools.map((tool) => {
                        return(
                        <View key={tool.id} style={theme == "light" ? lightStyles.toolImageNavContainer : darkStyles.toolImageNavContainer}>

                            <View style={theme == "light" ? lightStyles.toolImageContainer : darkStyles.toolImageContainer}>
                            { tool.imageUrl ? <Image style={theme == "light" ? lightStyles.toolImage : darkStyles.toolImage} source={{uri:tool.imageUrl}} /> : <></> }
                            </View>

                            <Pressable onPress={() => navigation.navigate(tool.screenName)} style={theme == "light" ? lightStyles.toolNavigate : darkStyles.toolNavigate}>
                                <Text style={theme == "light" ? lightStyles.toolNavigateText : darkStyles.toolNavigateText}>{tool.name}</Text>
                                <Entypo name="arrow-with-circle-right" size={20} color="#FFF" />
                            </Pressable>

                        </View>
                    );
                    })
                }

                <View style={theme == "light" ? lightStyles.toolImageNavContainer : darkStyles.toolImageNavContainer}>

                <View style={theme == "light" ? lightStyles.toolImageContainer : darkStyles.toolImageContainer}>
                <Image style={theme == "light" ? lightStyles.toolImage : darkStyles.toolImage} source={{uri:"https://www.shutterstock.com/image-vector/leaf-gear-eco-industry-icon-600nw-1912070746.jpg"}} />
                </View>

                <Pressable onPress={() => navigation.navigate("Tools")} style={theme == "light" ? lightStyles.toolNavigate : darkStyles.toolNavigate}>
                    <Text style={theme == "light" ? lightStyles.toolNavigateText : darkStyles.toolNavigateText}>More Tools</Text>
                    <Entypo name="arrow-with-circle-right" size={20} color="#FFF" />
                </Pressable>

                </View>
                
            </View>


            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Useful Links</Text></Pressable>

            <View style={theme == "light" ? lightStyles.partnersContainer : darkStyles.partnersContainer}>
            <FlatList horizontal
                data={Partners}
                keyExtractor={(item, index) => index}
                renderItem={(d) => {
                return (
                <Pressable onPress={() => { Linking.openURL(d.item.navUrl)}} key={d.item.id} style={theme == "light" ? lightStyles.partnerContainer : darkStyles.partnerContainer}>
                { d.item.imageUrl ? <Image style={theme == "light" ? lightStyles.partnerImage : darkStyles.partnerImage} source={{uri:d.item.imageUrl}} /> : <></>}    
                </Pressable>
                );
                }}
            />
            </View>
                

            </ScrollView>

        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex:1, paddingBottom: 50},
    title: {marginTop: 15},
    titleText: {fontSize: 25, fontWeight: 'bold', textAlign: "center"},

    featuresContainer: {marginVertical: 15},
    featureContainer: {margin: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 10},
    featureImage: {width: 390, height: 200, borderWidth: 2, borderColor: "#000", borderRadius: 10, objectFit: "fill"},

    toolsContainer: {flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center"},
    toolImageNavContainer: {flexDirection: 'column', gap: 6, alignItems: 'center', margin: 25, flexWrap:"wrap"},
    toolImageContainer: {width: 150, height: 150, borderWidth: 3, borderRadius: 150, borderColor: "#1dbf73"},
    toolImage: {borderRadius: 150, width: 150, height: 150},

    toolNavigate: {flexDirection: 'row',justifyContent: "space-between",backgroundColor: '#0171DF',paddingVertical: 5,paddingHorizontal: 5,borderRadius: 5, gap: 15},
    toolNavigateText: {textAlign: 'left', color: '#FFF', fontSize: 15, fontWeight: "bold"},
    
    partnersContainer: {marginBottom: 20},
    partnerContainer: {margin: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 10, padding: 10},
    partnerImage: {width: 250, height: 100, objectFit: "fill", backgroundColor: "#FFF", borderRadius: 10},
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#fff"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#0171DF"},

    featuresContainer: {...defaultStyles.featuresContainer},
    featureContainer: {...defaultStyles.featureContainer},
    featureImage: {...defaultStyles.featureImage},

    toolsContainer: {...defaultStyles.toolsContainer},
    toolImageNavContainer: {...defaultStyles.toolImageNavContainer},
    toolImageContainer: {...defaultStyles.toolImageContainer, backgroundColor: "#000"},
    toolImage: {...defaultStyles.toolImage, backgroundColor: "#FFF"},
    toolNavigate: {...defaultStyles.toolNavigate},
    toolNavigateText: {...defaultStyles.toolNavigateText},

    partnersContainer: {...defaultStyles.partnersContainer},
    partnerContainer: {...defaultStyles.partnerContainer},
    partnerImage: {...defaultStyles.partnerImage},
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText,  color:"#FFF"},

    featuresContainer: {...defaultStyles.featuresContainer},
    featureContainer: {...defaultStyles.featureContainer},
    featureImage: {...defaultStyles.featureImage},

    toolsContainer: {...defaultStyles.toolsContainer},
    toolImageNavContainer: {...defaultStyles.toolImageNavContainer},
    toolImageContainer: {...defaultStyles.toolImageContainer, backgroundColor: "#FFF"},
    toolImage: {...defaultStyles.toolImage, backgroundColor: "#FFF"},
    toolNavigate: {...defaultStyles.toolNavigate},
    toolNavigateText: {...defaultStyles.toolNavigateText},

    partnersContainer: {...defaultStyles.partnersContainer},
    partnerContainer: {...defaultStyles.partnerContainer},
    partnerImage: {...defaultStyles.partnerImage},
});