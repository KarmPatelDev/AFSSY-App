import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { Text, ScrollView, Pressable, View, Image, Linking, StyleSheet, LogBox} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import firestore from "@react-native-firebase/firestore";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export default EditRemovePosts = () => {

    const navigation = useNavigation();
    const theme = useSelector(state => state.theme).data;
    const [posts, setPosts] = useState([]);
    LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state', ]);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try{
            const allPosts = await firestore().collection("Posts").get();
            setPosts(allPosts.docs);
        }
        catch(error){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: `${error.message}`
            });
        }
    };

    const deletePost = async (id) => {
        try{
            await firestore().collection("Posts").doc(id).delete();
            Toast.show({
                type: 'success',
                text1: 'Successfully Deleted',
                text2: ''
            });
            getPosts();
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

            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Edit/Remove Posts</Text></Pressable>

            <View>
                {
                    posts && posts.map((post) => {
                        return (
                        <Pressable key={post.id} style={theme == "light" ? lightStyles.postContainer : darkStyles.postContainer}>
                            <View style={theme == "light" ? lightStyles.post : darkStyles.post}>
                                {post._data.thumbnailUrl ? <Image style={theme == "light" ? lightStyles.postImage : darkStyles.postImage} source={{uri:post._data.thumbnailUrl}} /> : <></>}
                                <Text style={theme == "light" ? lightStyles.postTitle : darkStyles.postTitle}>{post._data.title}</Text>
                                <Text style={theme == "light" ? lightStyles.postDescription : darkStyles.postDescription}>{post._data.description.substring(0, 120)}...</Text>
                                <Pressable onPress={() => { Linking.openURL(post._data.postUrl)}} style={theme == "light" ? lightStyles.readMore : darkStyles.readMore}>
                                    <Text style={theme == "light" ? lightStyles.readMoreText : darkStyles.readMoreText}>Read More </Text>
                                    <Entypo name="arrow-with-circle-right" size={22} color="#000" />
                                </Pressable> 
                                <View style={theme == "light" ? lightStyles.postEditRemove : darkStyles.postEditRemove}>
                                    <Pressable style={theme == "light" ? lightStyles.postEdit : darkStyles.postEdit} onPress={() => navigation.navigate("EditPost", {post: post})}>
                                        <Feather name="edit" size={22} color="#FFF" />
                                        <Text style={theme == "light" ? lightStyles.postEditText : darkStyles.postEditText}> Edit</Text>
                                    </Pressable> 

                                    <Pressable style={theme == "light" ? lightStyles.postRemove : darkStyles.postRemove} onPress={() => deletePost(post.id)}>
                                        <AntDesign name="delete" size={22} color="#FFF" />
                                        <Text style={theme == "light" ? lightStyles.postRemoveText : darkStyles.postRemoveText}> Delete</Text>
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
    postContainer: {margin: 10, padding: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 10},
    post: {marginHorizontal: 12, marginTop: 10},
    postImage: {width: "100%", height: 200, borderWidth: 2, borderColor: "#000", borderRadius: 10, marginBottom: 10, objectFit: "fill"},
    postTitle: {fontSize: 25, fontWeight: 'bold', color:"#1dbf73"},
    postDescription: {fontSize: 17, fontWeight: 'bold'},
    readMore: {flexDirection: 'row', gap: 3, backgroundColor: '#FFD140', padding: 5, borderRadius: 5, width: 130, marginTop: 10},
    readMoreText: {textAlign: 'left', color: '#000', fontSize: 17},
    postEditRemove: {flexDirection: "row", justifyContent: "space-between"},
    postEdit: {flexDirection: 'row', gap: 3, backgroundColor: '#0171DF', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, width: 80, marginTop: 10},
    postEditText: {textAlign: 'left', color: '#FFF', fontSize: 17},
    postRemove: {flexDirection: 'row', gap: 3, backgroundColor: '#d9534f', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, width: 100, marginTop: 10},
    postRemoveText: {textAlign: 'left', color: '#FFF', fontSize: 17}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#0171DF"},
    postContainer: {...defaultStyles.postContainer, backgroundColor: '#FFF'},
    post: {...defaultStyles.post},
    postImage: {...defaultStyles.postImage},
    postTitle: {...defaultStyles.postTitle},
    postDescription: {...defaultStyles.postDescription, color:"#000"},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText},
    postEditRemove: {...defaultStyles.postEditRemove},
    postEdit: {...defaultStyles.postEdit},
    postEditText: {...defaultStyles.postEditText},
    postRemove: {...defaultStyles.postRemove},
    postRemoveText: {...defaultStyles.postRemoveText}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    postContainer: {...defaultStyles.postContainer, backgroundColor: '#252E2F'},
    post: {...defaultStyles.post},
    postImage: {...defaultStyles.postImage},
    postTitle: {...defaultStyles.postTitle},
    postDescription: {...defaultStyles.postDescription, color:"#FFF"},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText},
    postEditRemove: {...defaultStyles.postEditRemove},
    postEdit: {...defaultStyles.postEdit},
    postEditText: {...defaultStyles.postEditText},
    postRemove: {...defaultStyles.postRemove},
    postRemoveText: {...defaultStyles.postRemoveText}
});