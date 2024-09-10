import React from "react";
import Header from "../../Components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View, Pressable, ScrollView, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { changeUser } from "../../redux/UserSlice";
import Toast from "react-native-toast-message";

export default ProfileScreen = () => {

    const navigation = useNavigation();

    const user = useSelector(state => state.user).data;
    const theme = useSelector(state => state.theme).data;
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        
        try{
            await auth().signOut();
            dispatch(changeUser(""));
            navigation.navigate("MainBar", { screen: 'LoginMenu' });
            Toast.show({
                type: 'success',
                text1: 'Successfully Logout',
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

    return (
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />

            <ScrollView>

            <View style={theme == "light" ? lightStyles.profile : darkStyles.profile}>
                <View>
                {
                    user.profileUrl ? <Image style={theme == "light" ? lightStyles.profileImage : darkStyles.profileImage} source={{uri : user.profileUrl}} /> : <Image style={theme == "light" ? lightStyles.profileImage : darkStyles.profileImage} source={require('../../assets/images/person.jpg')} />
                }
                
                </View>
                <View style={theme == "light" ? lightStyles.profileText : darkStyles.profileText}>
                    <Text style={theme == "light" ? lightStyles.profileName : darkStyles.profileName}>{user.name ? user.name : "User"}</Text>
                    <Text style={theme == "light" ? lightStyles.profileEmail : darkStyles.profileEmail}>{user.email}</Text>
                </View>     
            </View>

            <View style={theme == "light" ? lightStyles.container : darkStyles.container}>

                <Pressable style={theme == "light" ? lightStyles.tool : darkStyles.tool}><Text style={theme == "light" ? lightStyles.toolText : darkStyles.toolText}>Liked Content</Text></Pressable>
                <View style={theme == "light" ? lightStyles.toolManage : darkStyles.toolManage}>
                    <View style={theme == "light" ? lightStyles.toolAdd : darkStyles.toolAdd}>
                        <Text style={theme == "light" ? lightStyles.toolAddText : darkStyles.toolAddText}>Liked Gov. Schemes</Text>
                        <Pressable onPress={() => navigation.navigate("LikedGovSchemes")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                    <View style={theme == "light" ? lightStyles.toolEditRemove : darkStyles.toolEditRemove}>
                        <Text style={theme == "light" ? lightStyles.toolEditRemoveText : darkStyles.toolEditRemoveText}>Liked Agro-Posts</Text>
                        <Pressable onPress={() => navigation.navigate("LikedAgroPosts")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                </View>

            {
                user.role != 1 ? 
                <>
                <Pressable style={theme == "light" ? lightStyles.tool : darkStyles.tool}><Text style={theme == "light" ? lightStyles.toolText : darkStyles.toolText}>Manage Resources</Text></Pressable>
                <View style={theme == "light" ? lightStyles.toolManage : darkStyles.toolManage}>
                    <View style={theme == "light" ? lightStyles.toolAdd : darkStyles.toolAdd}>
                        <Text style={theme == "light" ? lightStyles.toolAddText : darkStyles.toolAddText}>Add Resources</Text>
                        <Pressable onPress={() => navigation.navigate("AddResources")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                    <View style={theme == "light" ? lightStyles.toolEditRemove : darkStyles.toolEditRemove}>
                        <Text style={theme == "light" ? lightStyles.toolEditRemoveText : darkStyles.toolEditRemoveText}>Edit/Remove Resources</Text>
                        <Pressable onPress={() => navigation.navigate("EditRemoveResources")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                </View>

                <Pressable style={theme == "light" ? lightStyles.tool : darkStyles.tool}><Text style={theme == "light" ? lightStyles.toolText : darkStyles.toolText}>Manage Schemes</Text></Pressable>
                <View style={theme == "light" ? lightStyles.toolManage : darkStyles.toolManage}>
                    <View style={theme == "light" ? lightStyles.toolAdd : darkStyles.toolAdd}>
                        <Text style={theme == "light" ? lightStyles.toolAddText : darkStyles.toolAddText}>Add Schemes</Text>
                        <Pressable onPress={() => navigation.navigate("AddSchemes")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                    <View style={theme == "light" ? lightStyles.toolEditRemove : darkStyles.toolEditRemove}>
                        <Text style={theme == "light" ? lightStyles.toolEditRemoveText : darkStyles.toolEditRemoveText}>Edit/Remove Schemes</Text>
                        <Pressable onPress={() => navigation.navigate("EditRemoveSchemes")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                </View>

                <Pressable style={theme == "light" ? lightStyles.tool : darkStyles.tool}><Text style={theme == "light" ? lightStyles.toolText : darkStyles.toolText}>Manage Posts</Text></Pressable>
                <View style={theme == "light" ? lightStyles.toolManage : darkStyles.toolManage}>
                    <View style={theme == "light" ? lightStyles.toolAdd : darkStyles.toolAdd}>
                        <Text style={theme == "light" ? lightStyles.toolAddText : darkStyles.toolAddText}>Add Posts</Text>
                        <Pressable onPress={() => navigation.navigate("AddPosts")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                    <View style={theme == "light" ? lightStyles.toolEditRemove : darkStyles.toolEditRemove}>
                        <Text style={theme == "light" ? lightStyles.toolEditRemoveText : darkStyles.toolEditRemoveText}>Edit/Remove Posts</Text>
                        <Pressable onPress={() => navigation.navigate("EditRemovePosts")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                </View>
                </>
                :
                <>
                </>
            }

                <Pressable style={theme == "light" ? lightStyles.tool : darkStyles.tool}><Text style={theme == "light" ? lightStyles.toolText : darkStyles.toolText}>Manage Profile</Text></Pressable>
                <View style={theme == "light" ? lightStyles.toolManage : darkStyles.toolManage}>
                    <View style={theme == "light" ? lightStyles.toolAdd : darkStyles.toolAdd}>
                        <Text style={theme == "light" ? lightStyles.toolAddText : darkStyles.toolAddText}>Edit Profile</Text>
                        <Pressable onPress={() => navigation.navigate("EditProfile")}>
                            {theme == "light" ? <AntDesign name="rightcircleo" size={22} color="#000"/> : <AntDesign name="rightcircleo" size={22} color="#FFF"/>}
                        </Pressable>
                    </View>
                    <View style={theme == "light" ? lightStyles.toolEditRemove : darkStyles.toolEditRemove}>
                    <Pressable onPress={() => handleSignOut()}><Text style={theme == "light" ? lightStyles.toolEditRemoveText : darkStyles.toolEditRemoveText}>Sign Out</Text></Pressable>
                    </View>
                </View>

            </View>

            </ScrollView>


        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex:1, paddingBottom: 50},
    profile: {flexDirection: "row", justifyContent: "space-between", margin: 25},
    profileImage: {width: 110, height: 110, borderRadius: 55, borderWidth: 5, borderColor: "#1dbf73"},
    profileText: {flexDirection: "column", justifyContent: "center"},
    profileName: {color: "#0171DF", textAlign: "right", fontSize: 25, fontWeight: "bold"},
    profileEmail: {textAlign: "right", fontSize: 15},
    container: {marginHorizontal: 20, marginBottom: 20},
    tool: {marginVertical:15},
    toolText: {fontSize: 25, fontWeight: "500"},
    toolManage: {padding: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 20},
    toolAdd: {flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:10, borderBottomWidth: 0.5},
    toolAddText: {fontSize: 20},
    toolEditRemove: {flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding:10},
    toolEditRemoveText: {fontSize: 20},
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
    profile: {...defaultStyles.profile},
    profileImage: {...defaultStyles.profileImage},
    profileText: {...defaultStyles.profileText},
    profileName: {...defaultStyles.profileName},
    profileEmail: {...defaultStyles.profileEmail, color: "#000"},
    container: {...defaultStyles.container},
    tool: {...defaultStyles.tool},
    toolText: {...defaultStyles.toolText, color:"#000"},
    toolManage: {...defaultStyles.toolManage, backgroundColor: '#FFF'},
    toolAdd: {...defaultStyles.toolAdd, borderColor: "#000"},
    toolAddText: {...defaultStyles.toolAddText, color: "#000"},
    toolEditRemove: {...defaultStyles.toolEditRemove},
    toolEditRemoveText: {...defaultStyles.toolEditRemoveText, color: "#000"},
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    profile: {...defaultStyles.profile},
    profileImage: {...defaultStyles.profileImage},
    profileText: {...defaultStyles.profileText},
    profileName: {...defaultStyles.profileName},
    profileEmail: {...defaultStyles.profileEmail, color: "#FFF"},
    container: {...defaultStyles.container},
    tool: {...defaultStyles.tool},
    toolText: {...defaultStyles.toolText, color:"#FFF"},
    toolManage: {...defaultStyles.toolManage, backgroundColor: '#252E2F'},
    toolAdd: {...defaultStyles.toolAdd, borderColor: "#FFF"},
    toolAddText: {...defaultStyles.toolAddText, color: "#FFF"},
    toolEditRemove: {...defaultStyles.toolEditRemove},
    toolEditRemoveText: {...defaultStyles.toolEditRemoveText, color: "#FFF"},
});