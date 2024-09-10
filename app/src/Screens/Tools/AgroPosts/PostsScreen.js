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

export default PostsScreen = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user).data;
    const theme = useSelector(state => state.theme).data;

    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState(user.agroPosts);

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

    const addLikedPosts = async (id) => {
        if(user == ""){
            Toast.show({
                type: 'info',
                text1: 'Something Went Wrong',
                text2: "Please Login."
            });
            return;
        }
        
        try{
            const userDocRef = firestore().collection("Users").doc(user.uid);
            userDocRef.update({
                agroPosts: [...user.agroPosts, id]
            });
            dispatch(changeUser({
                uid: user.uid,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                profileUrl: user.downloadURL,
                agroPosts: [...likedPosts, id],
                govSchemes: user.govSchemes,
                role: user.role
            }));
            setLikedPosts([...likedPosts, id]);
            Toast.show({
                type: 'success',
                text1: 'Post Saved.',
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

    const removeLikedPosts = async (id) => {
        if(user == ""){
            Toast.show({
                type: 'info',
                text1: 'Something Went Wrong',
                text2: "Please Login."
            });
            return;
        }

        try{
            const tempPosts = user.agroPosts.filter((postId) => postId != id);
            const userDocRef = firestore().collection("Users").doc(user.uid);
            userDocRef.update({
                agroPosts: tempPosts
            });
            dispatch(changeUser({
                uid: user.uid,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                profileUrl: user.downloadURL,
                agroPosts: tempPosts,
                govSchemes: user.govSchemes,
                role: user.role
            }));
            setLikedPosts(tempPosts);
            Toast.show({
                type: 'success',
                text1: 'Post removed from saved posts.',
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

            <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Agro Posts</Text></Pressable>

                <View>

                    {
                        posts && posts.map((post) => {
                            return (
                            <Pressable key={post.id} style={theme == "light" ? lightStyles.postContainer : darkStyles.postContainer}>
                                <View style={theme == "light" ? lightStyles.post : darkStyles.post}>
                                    {
                                        post._data.thumbnailUrl ? <Image style={theme == "light" ? lightStyles.postImage : darkStyles.postImage} source={{uri:post._data.thumbnailUrl}} /> : <></>
                                    }
                                    <Text style={theme == "light" ? lightStyles.postTitle : darkStyles.postTitle}>{post._data.title}</Text>
                                    <Text style={theme == "light" ? lightStyles.postDescription : darkStyles.postDescription}>{post._data.description.substring(0, 120)}...</Text>

                                    <View style={theme == "light" ? lightStyles.navigate : darkStyles.navigate}>
                                    <Pressable onPress={() => { Linking.openURL(post._data.postUrl)}} style={theme == "light" ? lightStyles.readMore : darkStyles.readMore}>
                                        <Text style={theme == "light" ? lightStyles.readMoreText : darkStyles.readMoreText}>Read More </Text>
                                        <Entypo name="arrow-with-circle-right" size={22} color="#000" />
                                    </Pressable> 
                                    <View>
                                        {
                                            user && likedPosts.includes(post.id) ?
                                            <AntDesign name="heart" size={25} color="#e60000" onPress={() => removeLikedPosts(post.id)} />
                                            :
                                            theme == "light" ? <AntDesign name="hearto" size={25} color="#000" onPress={() => addLikedPosts(post.id)} /> : <AntDesign name="hearto" size={25} color="#FFF" onPress={() => addLikedPosts(post.id)} />
                                        } 
                                    </View>
                                    </View>

                                </View>
                            </Pressable>
                            )
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
    postContainer: {margin: 10, padding: 10, borderWidth: 1, borderColor: '#a8a8a8', borderRadius: 10},
    post: {marginHorizontal: 12, marginTop: 10,},
    postImage: {width: "100%", height: 200, borderWidth: 2, borderColor: "#000", borderRadius: 10, marginBottom: 10, objectFit: "fill"},
    postTitle: {fontSize: 25, fontWeight: 'bold', color:"#1dbf73"},
    postDescription: {fontSize: 17, fontWeight: 'bold'},
    navigate: {flexDirection: "row", justifyContent: "space-between", marginTop: 10},
    readMore: {flexDirection: 'row', gap: 3, backgroundColor: '#FFD140', padding: 5, borderRadius: 5},
    readMoreText: {textAlign: 'left', color: '#000', fontSize: 17}
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
    navigate: {...defaultStyles.navigate},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText}
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
    navigate: {...defaultStyles.navigate},
    readMore: {...defaultStyles.readMore},
    readMoreText: {...defaultStyles.readMoreText}
});