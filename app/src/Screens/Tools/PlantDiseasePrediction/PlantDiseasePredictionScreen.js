import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../Components/Header";
import { ScrollView, Text, Pressable, Button, Platform, Image, StyleSheet, Dimensions, View} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";

export const {height, width} = Dimensions.get('window');

export default PlantDiseasePredictionScreen = () => {

    const theme = useSelector(state => state.theme).data;

    const [result, setResult] = useState('');
    const [label, setLabel] = useState('');
    const [image, setImage] = useState('');

    const handleCameraLaunch = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            width: 256,
            height: 256,
            includeBase64: true,
        };
      
        launchCamera(options, response => {
            if (response.didCancel) {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "User cancelled image picker."
                });
            } else if (response.error) {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: `${response.error}`
                });
            } else {
                const uri = response?.assets[0]?.uri;
                const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
                getResult(path, response);
            }
        });
    };

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            width: 256,
            height: 256,
            includeBase64: true,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: "User cancelled image picker."
                });
            } else if (response.error) {
                Toast.show({
                    type: "error",
                    text1: "Something Went Wrong",
                    text2: `${response.error}`
                });
            } else {
                const uri = response?.assets[0]?.uri;
                const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
                getResult(path, response);
            }
        });
    };

    const getResult = async (path, response) => {
        setImage(path);
        setLabel('Predicting...');
        setResult('');
        const params = {
            uri: path,
            name: response.assets[0].fileName,
            type: response.assets[0].type,
        };

        const formData = new FormData();
        formData.append("file", params);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

        fetch("http://10.0.2.2:8000/predict", {
          method: 'POST',
          body: formData,
          signal: controller.signal 
        })
        .then(response => response.json())
        .then(result => {
            if (result) {
                setLabel(result.class);
                setResult(result.confidence);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Something Went Wrong',
                    text2: "Sorry, Failed to predict."
                });
                setLabel('Failed to predict');
                setResult(0);
            }
        })
        .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Something Went Wrong',
              text2: "Please Try Letter. Check internet connection."
            });
            setLabel('Please Try Again...');
            setResult(0);
        });
    };

    const clearOutput = () => {
        setImage('');
        setLabel('');
        setResult('');
    };

    return(<>
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

            {/* Header */}
            <Header />

            <ScrollView>

            <View>
                <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Disease Prediction</Text></Pressable>
            </View>

            <View>
            {
            image?.length ? (
            <View>
                <Image source={{uri: image}} style={theme == "light" ? lightStyles.imageStyle : darkStyles.imageStyle} />

                {
                    label != "Predicting..." ? (
                        <View>
                        <Pressable style={theme == "light" ? lightStyles.labelContainer : darkStyles.labelContainer}>
                         <Text style={theme == "light" ? lightStyles.labelText : darkStyles.labelText}>Label</Text>
                         <Text style={theme == "light" ? lightStyles.label : darkStyles.label}>{label}</Text>
                        </Pressable>
         
                        <Pressable style={theme == "light" ? lightStyles.resultContainer : darkStyles.resultContainer}>
                         <Text style={theme == "light" ? lightStyles.resultText : darkStyles.resultText}>confidence</Text>
                         <Text style={theme == "light" ? lightStyles.result : darkStyles.result}>{result}</Text>
                        </Pressable>
         
                        <Pressable style={theme == "light" ? lightStyles.imageContainer : darkStyles.imageContainer} onPress={() => clearOutput()}><Text style={theme == "light" ? lightStyles.imageText : darkStyles.imageText}>Take a New Image</Text></Pressable>
                        </View>
                    ) : (
                        <Pressable style={theme == "light" ? lightStyles.predictContainer : darkStyles.predictContainer}>
                         <Text style={theme == "light" ? lightStyles.predictText : darkStyles.predictText}>Predicting...</Text>
                        </Pressable>
                    )
                }
            </View>
            )
            :
            (<View>
                <Image style={theme == "light" ? lightStyles.imageStyle : darkStyles.imageStyle} source={{ uri: 'https://cdn1.iconfinder.com/data/icons/travel-1-4/128/6-1024.png', }} />

                <Pressable style={theme == "light" ? lightStyles.openImage : darkStyles.openImage} onPress={() => handleCameraLaunch()}><Text style={theme == "light" ? lightStyles.openImageText : darkStyles.openImageText}>Open Camera</Text></Pressable>
                <Pressable style={theme == "light" ? lightStyles.chooseDevice : darkStyles.chooseDevice} onPress={() => openImagePicker()}><Text style={theme == "light" ? lightStyles.chooseDeviceText : darkStyles.chooseDeviceText}>Choose From Device</Text></Pressable>
            </View>)
            }
            </View>

            </ScrollView>

        </SafeAreaView>
    </>)
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex: 1},
    title: {margin: 10},
    titleText: {fontSize: 25, fontWeight: 'bold', textAlign: "center"},
    labelContainer: {marginVertical: 15},
    labelText: {fontSize: 25, color:"#FFF", textAlign: "center", padding:10, fontWeight: "bold", backgroundColor: "#E53935", borderRadius: 20, alignSelf: "center"},
    label: {fontSize: 25, textAlign: "center", padding:10, fontWeight: "bold"},
    resultContainer: {marginVertical: 15},
    resultText: {fontSize: 25, color:"#FFF", textAlign: "center", padding:10, fontWeight: "bold", backgroundColor: "#E53935", borderRadius: 20, alignSelf: "center"},
    result: {fontSize: 25, textAlign: "center", padding:10, fontWeight: "bold"},
    imageContainer: {margin: 10, alignSelf:"center"},
    imageText: {fontSize: 22, color:"#FFF", textAlign: "center", backgroundColor: "#575757", padding:10, width: 270, borderRadius: 30},
    predictContainer: {marginVertical: 15},
    predictText: {fontSize: 25, color:"#FFF", textAlign: "center", padding:10, fontWeight: "bold", backgroundColor: "#E53935", borderRadius: 20, alignSelf: "center", padding: 10},
    openImage: {margin: 10, alignSelf:"center"},
    openImageText: {fontSize: 22, color:"#FFF", textAlign: "center", backgroundColor: "#575757", padding:10, width: 170, borderRadius: 30},
    chooseDevice: {margin: 10, alignSelf:"center"},
    chooseDeviceText: {fontSize: 22, color:"#FFF", textAlign: "center", backgroundColor: "#575757", padding:10, width: 270, borderRadius: 30},
    imageStyle: {marginVertical: 50,width: width / 1.7,height: width / 1.7,borderRadius: 20,borderWidth: 0.3,borderColor: '#575757',alignSelf: "center"},
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#0171DF"},
    labelText: {...defaultStyles.labelText},
    label: {...defaultStyles.label, color:"#000"},
    resultText: {...defaultStyles.resultText},
    result: {...defaultStyles.result, color:"#000"},
    imageContainer: {...defaultStyles.imageContainer},
    imageText: {...defaultStyles.imageText},
    predictContainer: {...defaultStyles.predictContainer},
    predictText: {...defaultStyles.predictText},
    openImage: {...defaultStyles.openImage},
    openImageText: {...defaultStyles.openImageText},
    chooseDevice: {...defaultStyles.chooseDevice},
    chooseDeviceText: {...defaultStyles.chooseDeviceText},
    imageStyle: {...defaultStyles.imageStyle, backgroundColor: "#FFF"},
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
    title: {...defaultStyles.title},
    titleText: {...defaultStyles.titleText, color:"#FFF"},
    labelText: {...defaultStyles.labelText},
    label: {...defaultStyles.label, color:"#FFF"},
    resultText: {...defaultStyles.resultText},
    result: {...defaultStyles.result, color:"#FFF"},
    imageContainer: {...defaultStyles.imageContainer},
    imageText: {...defaultStyles.imageText},
    predictContainer: {...defaultStyles.predictContainer},
    predictText: {...defaultStyles.predictText},
    openImage: {...defaultStyles.openImage},
    openImageText: {...defaultStyles.openImageText},
    chooseDevice: {...defaultStyles.chooseDevice},
    chooseDeviceText: {...defaultStyles.chooseDeviceText},
    imageStyle: {...defaultStyles.imageStyle, backgroundColor: "#252E2F"},
});