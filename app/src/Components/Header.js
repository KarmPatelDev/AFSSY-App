import React from "react";
import { StyleSheet, View, Text} from "react-native";
import { useSelector } from "react-redux";

export default Header = () => {

    const theme = useSelector(state => state.theme).data;

    return (
        // Header Menu
        <View style={theme=="light" ? lightStyles.headerStyle : darkStyles.headerStyle}>
            <Text style={theme=="light" ? lightStyles.title : darkStyles.title}>AFSSY</Text>
        </View>
    );
};

const defaultStyles = StyleSheet.create({
    headerStyle: {borderBottomLeftRadius: 20,borderBottomRightRadius: 20,height: 50,flexDirection: 'row',alignItems: 'flex-end',justifyContent: 'center',},
    title: {fontFamily: 'Roboto-Bold',fontSize: 25,marginBottom: 10,}
});

const lightStyles = StyleSheet.create({
    headerStyle: {...defaultStyles.headerStyle, backgroundColor: "#121660"},
    title: {...defaultStyles.title, color: "#FFF"}
});

const darkStyles = StyleSheet.create({
    headerStyle: {...defaultStyles.headerStyle, backgroundColor: "#252E2F"},
    title: {...defaultStyles.title, color: "#FFF"}
});