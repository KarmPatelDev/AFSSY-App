import React, { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainBar from "./MainBar";
import { useDispatch } from "react-redux";
import { Appearance } from "react-native";
import { changeTheme } from "./redux/ThemeSlice";
import { changeUser } from "./redux/UserSlice";
import FindResourcesScreen from "./Screens/Tools/FindResources/FindResourcesScreen";
import MapScreen from "./Screens/Tools/FindResources/MapScreen";
import SchemesScreen from "./Screens/Tools/GovSchemes/SchemesScreen";
import PostsScreen from "./Screens/Tools/AgroPosts/PostsScreen";
import PlantDiseasePredictionScreen from "./Screens/Tools/PlantDiseasePrediction/PlantDiseasePredictionScreen";
import AddResources from "./Screens/Profile/ManageResources/AddResources";
import EditRemoveResources from "./Screens/Profile/ManageResources/EditRemoveResources";
import AddSchemes from "./Screens/Profile/ManageSchemes/AddSchemes";
import EditRemoveSchemes from "./Screens/Profile/ManageSchemes/EditRemoveSchemes";
import EditScheme from "./Screens/Profile/ManageSchemes/EditScheme";
import AddPosts from "./Screens/Profile/ManagePosts/AddPosts";
import EditRemovePosts from "./Screens/Profile/ManagePosts/EditRemovePosts";
import EditPost from "./Screens/Profile/ManagePosts/EditPost";
import EditProfile from "./Screens/Profile/ManageProfile/EditProfile";
import LoginScreen from "./Screens/Profile/Auth/LoginScreen";
import RegisterScreen from "./Screens/Profile/Auth/RegisterScreen";
import ProfileScreen from "./Screens/Profile/ProfileScreen";
import LikedGovSchemes from "./Screens/Profile/LikedContent/LikedGovSchemes";
import LikedAgroPosts from "./Screens/Profile/LikedContent/LikedAgroPosts";
import ChatbotScreen from "./Screens/Tools/Chatbot/ChatbotScreen";
import WeatherPredictionScreen from "./Screens/Tools/WeatherPrediction/WeatherPredictionScreen";
import RealtimeMarketPriceScreen from "./Screens/Tools/RealtimeMarketPrice/RealtimeMarketPriceScreen";
import Toast from "react-native-toast-message";

const AppNavigation = () => {

    const dispatch = useDispatch();
    Appearance.addChangeListener((scheme) => {
        dispatch(changeTheme(scheme.colorScheme));
    });

    useEffect(() => {
        checkLogin();
        setTheme();
    }, []);

    const checkLogin = () => {
        try{
            auth().onAuthStateChanged(async (user) => {
                if(user){
                        const userDetail = await firestore().collection("Users").doc(user.uid).get();
                        if(userDetail._data){
                            dispatch(changeUser({
                                uid: userDetail.id,
                                name: userDetail._data.name,
                                email: userDetail._data.email,
                                phoneNumber: userDetail._data.phoneNumber,
                                address: userDetail._data.address,
                                profileUrl: userDetail._data.profileUrl,
                                agroPosts: userDetail._data.agroPosts,
                                govSchemes: userDetail._data.govSchemes,
                                role: userDetail._data.role
                            }));
                        }
                } 
                else dispatch(changeUser(""));
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

    const setTheme = () => {
        dispatch(changeTheme(Appearance.getColorScheme()));
    };

    const Stack = createNativeStackNavigator();

    return (<>
        <Stack.Navigator>
            <Stack.Screen name="MainBar" component={MainBar} options={{headerShown: false}} />
            <Stack.Screen name="FindResources" component={FindResourcesScreen} options={{headerShown: false}} />
            <Stack.Screen name="ShowMap" component={MapScreen} options={{headerShown: false}} />
            <Stack.Screen name="GovSchemes" component={SchemesScreen} options={{headerShown: false}} />
            <Stack.Screen name="AgroPosts" component={PostsScreen} options={{headerShown: false}} />
            <Stack.Screen name="PlantDiseasePrediction" component={PlantDiseasePredictionScreen} options={{headerShown: false}} />
            <Stack.Screen name="Chatbot" component={ChatbotScreen} options={{headerShown: false}} />
            <Stack.Screen name="WeatherPrediction" component={WeatherPredictionScreen} options={{headerShown: false}} />
            <Stack.Screen name="RealtimeMarketPrice" component={RealtimeMarketPriceScreen} options={{headerShown: false}} />
            <Stack.Screen name="AddResources" component={AddResources} options={{headerShown: false}} />
            <Stack.Screen name="EditRemoveResources" component={EditRemoveResources} options={{headerShown: false}} />
            <Stack.Screen name="AddSchemes" component={AddSchemes} options={{headerShown: false}} />
            <Stack.Screen name="EditRemoveSchemes" component={EditRemoveSchemes} options={{headerShown: false}} />
            <Stack.Screen name="EditScheme" component={EditScheme} options={{headerShown: false}} />
            <Stack.Screen name="AddPosts" component={AddPosts} options={{headerShown: false}} />
            <Stack.Screen name="EditRemovePosts" component={EditRemovePosts} options={{headerShown: false}} />
            <Stack.Screen name="EditPost" component={EditPost} options={{headerShown: false}} />
            <Stack.Screen name="LikedGovSchemes" component={LikedGovSchemes} options={{headerShown: false}} />
            <Stack.Screen name="LikedAgroPosts" component={LikedAgroPosts} options={{headerShown: false}} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    </>);
};

export default AppNavigation;