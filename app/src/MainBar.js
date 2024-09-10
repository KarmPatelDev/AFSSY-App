import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import ToolsScreen from "./Screens/Tools/ToolsScreen";
import HomeScreen from "./Screens/Home/HomeScreen";
import ProfileScreen from "./Screens/Profile/ProfileScreen";
import LoginScreen from "./Screens/Profile/Auth/LoginScreen";
import { useSelector } from "react-redux";

export default MainBar = () => {

    const Tab = createBottomTabNavigator();
    const user = useSelector(state => state.user).data;
    const theme = useSelector(state => state.theme).data;

    return (<>
        <Tab.Navigator screenOptions={{
            tabBarStyle: theme == "light" ? lightStyles.tabBarStyle : darkStyles.tabBarStyle,
            headerTitleAlign: theme == "light" ? lightStyles.headerTitleAlign : darkStyles.headerTitleAlign,
            tabBarLabelStyle: theme == "light" ? lightStyles.tabBarLabelStyle : darkStyles.tabBarLabelStyle,
        }}>
            
            {/* Home */}
            <Tab.Screen 
                name='Home' 
                component={HomeScreen} 
                options={{tabBarLabel: 'Home', headerShown: false, tabBarIcon: ({focused}) => focused ? (
                        theme == "light" ? <Entypo name="home" size={28} color="#1dbf73" /> : <Entypo name="home" size={28} color="#1dbf73" />
                    ) : (
                        theme == "light" ? <Entypo name="home" size={28} color="black" /> : <Entypo name="home" size={28} color="black" />
                    )
                }}
            />

            {/* Tools */}
            <Tab.Screen 
                name='Tools' 
                component={ToolsScreen} 
                options={{tabBarLabel: 'Tools', headerShown: false, tabBarIcon: ({focused}) => focused ? (
                        theme == "light" ? <Entypo name="tools" size={28} color="#1dbf73" /> : <Entypo name="tools" size={28} color="#1dbf73" />
                    ) : (
                        theme == "light" ? <Entypo name="tools" size={28} color="black" /> : <Entypo name="tools" size={28} color="black" />
                    )
                }}
            />

            {/* Profile */}
            {
                user == "" ? 
                <Tab.Screen 
                    name='LoginMenu' 
                    component={LoginScreen} 
                    options={{tabBarLabel: 'Profile', headerShown: false, tabBarIcon: ({focused}) => focused ? (
                            theme == "light" ? <Ionicons name="person" size={24} color="#1dbf73" /> : <Ionicons name="person" size={24} color="#1dbf73" />
                        ) : (
                            theme == "light" ? <Ionicons name="person" size={24} color="black" /> : <Ionicons name="person" size={24} color="black" />
                        )
                    }}
                />
                :
                <Tab.Screen 
                    name='ProfileMenu' 
                    component={ProfileScreen} 
                    options={{tabBarLabel: 'Profile', headerShown: false, tabBarIcon: ({focused}) => focused ? (
                            theme == "light" ? <Ionicons name="person" size={24} color="#1dbf73" /> : <Ionicons name="person" size={24} color="#1dbf73" />
                        ) : (
                            theme == "light" ? <Ionicons name="person" size={24} color="black" /> : <Ionicons name="person" size={24} color="black" />
                        )
                    }}
                />
                
            }
            
        </Tab.Navigator>
    </>);
};


const defaultStyles = StyleSheet.create({
    tabBarStyle:{ borderTopStartRadius: 50,borderTopEndRadius: 50, borderTopWidth: 2, position: "absolute", zIndex: 1},
    tabBarLabelStyle: { fontWeight:  '900'}
});

const lightStyles = StyleSheet.create({
    tabBarStyle: {...defaultStyles.tabBarStyle, borderColor: "#1dbf73"}, 
    headerTitleAlign: 'center', 
    tabBarLabelStyle: {...defaultStyles.tabBarLabelStyle}
});

const darkStyles = StyleSheet.create({
    tabBarStyle: {...defaultStyles.tabBarStyle, borderColor: "#1dbf73"},
    headerTitleAlign: 'center', 
    tabBarLabelStyle: {...defaultStyles.tabBarLabelStyle}
});

