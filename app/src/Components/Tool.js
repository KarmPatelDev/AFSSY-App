import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default Tool = (props) => {

    const navigation = useNavigation();
    const theme = useSelector(state => state.theme).data;

    return (
        <Pressable style={theme == "light" ? lightStyles.toolContainer : darkStyles.toolContainer}>
            <View style={theme == "light" ? lightStyles.toolView : darkStyles.toolView}>
                <View style={theme == "light" ? lightStyles.toolTextContainer : darkStyles.toolTextContainer}>
                    <Text style={theme == "light" ? lightStyles.toolTitle : darkStyles.toolTitle}>{props.data.title}</Text>
                    <Text style={theme == "light" ? lightStyles.toolDescription : darkStyles.toolDescription}>{props.data.description}</Text>
                    <View style={theme == "light" ? lightStyles.toolFeatures : darkStyles.toolFeatures}>
                        {
                            props.data.features && props.data.features.map((data, index) => 
                            <View style={theme == "light" ? lightStyles.toolFeature : darkStyles.toolFeature} key={index}>
                            <Text style={theme == "light" ? lightStyles.toolFeatureText : darkStyles.toolFeatureText}>{data}</Text>
                            </View>)
                        }
                    </View>
                </View>
                <View  style={theme == "light" ? lightStyles.toolImageNavContainer : darkStyles.toolImageNavContainer}>
                    <View style={theme == "light" ? lightStyles.toolImage : darkStyles.toolImage}>
                        {props.data.image}
                    </View>
                    <Pressable onPress={() => navigation.navigate(props.data.navigate)} style={theme == "light" ? lightStyles.toolNavigate : darkStyles.toolNavigate}>
                        <Text style={theme == "light" ? lightStyles.toolNavigateText : darkStyles.toolNavigateText}>Find Now </Text>
                        <Entypo name="arrow-with-circle-right" size={20} color="#FFF" />
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
};

const defaultStyles = StyleSheet.create({
    toolContainer: {margin: 10, padding: 10, borderWidth: 1, borderRadius: 10},
    toolView: {marginHorizontal: 12, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
    toolTextContainer: {width: '60%'},
    toolTitle: {fontSize: 25, fontWeight: 'bold'},
    toolDescription: {fontSize: 17, fontWeight: 'bold', color:"#1dbf73"},
    toolFeatures: {flexDirection: 'row', gap: 6, marginTop: 7, flexWrap:"wrap"},
    toolFeature: {backgroundColor: '#FFD140',padding: 5,borderRadius: 5, margin: 2},
    toolFeatureText: {textAlign: 'center', color: '#000', fontSize: 15},
    toolImageNavContainer: {flexDirection: 'column', gap: 6, alignItems: 'center', marginTop: 7, flexWrap:"wrap"},
    toolImage: {backgroundColor: '#99ccff',paddingHorizontal: 6, paddingVertical: 4,borderRadius: 10},
    toolNavigate: {flexDirection: 'row', justifyContent: "space-between",backgroundColor: '#0171DF', padding: 5, borderRadius: 5},
    toolNavigateText: {textAlign: 'left', color: '#FFF', fontSize: 15, fontWeight: "bold"}
});

const lightStyles = StyleSheet.create({
    toolContainer: {...defaultStyles.toolContainer, backgroundColor: '#FFF', borderColor: '#a8a8a8'},
    toolView: {...defaultStyles.toolView},
    toolTextContainer: {...defaultStyles.toolTextContainer},
    toolTitle: {...defaultStyles.toolTitle, color:"#000"},
    toolDescription: {...defaultStyles.toolDescription},
    toolFeatures: {...defaultStyles.toolFeatures},
    toolFeature: {...defaultStyles.toolFeature},
    toolFeatureText: {...defaultStyles.toolFeatureText},
    toolImageNavContainer: {...defaultStyles.toolImageNavContainer},
    toolImage: {...defaultStyles.toolImage},
    toolNavigate: {...defaultStyles.toolNavigate},
    toolNavigateText: {...defaultStyles.toolNavigateText}
});

const darkStyles = StyleSheet.create({
    toolContainer: {...defaultStyles.toolContainer, backgroundColor: '#252E2F', borderColor: '#a8a8a8'},
    toolView: {...defaultStyles.toolView},
    toolTextContainer: {...defaultStyles.toolTextContainer},
    toolTitle: {...defaultStyles.toolTitle, color:"#FFF"},
    toolDescription: {...defaultStyles.toolDescription},
    toolFeatures: {...defaultStyles.toolFeatures},
    toolFeature: {...defaultStyles.toolFeature},
    toolFeatureText: {...defaultStyles.toolFeatureText},
    toolImageNavContainer: {...defaultStyles.toolImageNavContainer},
    toolImage: {...defaultStyles.toolImage},
    toolNavigate: {...defaultStyles.toolNavigate},
    toolNavigateText: {...defaultStyles.toolNavigateText}
});