import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable } from 'react-native';
import Header from '../../../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Table, Row } from 'react-native-reanimated-table';
import { useSelector } from 'react-redux';
import { GOV_DATA_KEY } from '../../../assets/ENV';
import Toast from 'react-native-toast-message';

export default RealtimeMarketPriceScreen = () => {

    const theme = useSelector(state => state.theme).data;

    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [commodity, setCommodity] = useState("");
    const [market, setMarket] = useState("");

    const [commoditiesData, setCommoditiesData] = useState([]);
    const [showData, setShowData] = useState(false);
    const [markets, setMarkets] = useState([]);

    const loadCommoditiesData = () => {
        setShowData(false);

        if(!state && !district && !market && !commodity){
            Toast.show({
                type: 'error',
                text1: 'Something Went Wrong',
                text2: "Inputs are empty."
            });
            return;
        }

        var url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${GOV_DATA_KEY}&format=json`;

        if(state)url = `${url}&filters%5Bstate.keyword%5D=${state}`;
        if(district)url = `${url}&filters%5Bdistrict%5D=${district}`;
        if(market)url = `${url}&filters%5Bmarket%5D=${market}`;
        if(commodity)url = `${url}&filters%5Bcommodity%5D=${commodity}`;

        fetch(url)
        .then((response) => response.json())
        .then(data => {
            
            if(data.records.length == 0){
                Toast.show({
                    type: 'error',
                    text1: 'Something Went Wrong',
                    text2: "No records found."
                });
            }
            else{
                setCommoditiesData(data.records);
                var cityData = []
                data.records.map((d) => {
                    if(!cityData.includes(d.market))cityData.push(d.market);
                });
                setMarkets(cityData);
            }
            
            setState("");
            setDistrict("");
            setMarket("");
            setCommodity("");
        })
        .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'Something Went Wrong',
              text2: "Please Try Letter. Check internet connection."
            });
        });
        setShowData(true);
    };

    return(
        <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

        <Header />

        <ScrollView>

            <View style={theme == "light" ? lightStyles.formArea : darkStyles.formArea}>
                <Text style={theme == "light" ? lightStyles.formTitle : darkStyles.formTitle}>Enter Details</Text>
                <TextInput type='text' placeholder='Enter State' placeholderTextColor="#C0C0C0" onChangeText={(text) => setState(text)} value={state} style={theme == "light" ? lightStyles.input : darkStyles.input}/>
                <TextInput type='text' placeholder='Enter District' placeholderTextColor="#C0C0C0" onChangeText={(text) => setDistrict(text)} value={district} style={theme == "light" ? lightStyles.input : darkStyles.input}/>
                <TextInput type='text' placeholder='Enter Market' placeholderTextColor="#C0C0C0" onChangeText={(text) => setMarket(text)} value={market} style={theme == "light" ? lightStyles.input : darkStyles.input}/>
                <TextInput type='text' placeholder='Enter Commodity' placeholderTextColor="#C0C0C0" onChangeText={(text) => setCommodity(text)} value={commodity} style={theme == "light" ? lightStyles.input : darkStyles.input}/>

                <Pressable style={theme == "light" ? lightStyles.submitButton : darkStyles.submitButton} onPress={() => loadCommoditiesData()}><Text style={theme == "light" ? lightStyles.submitButtonText : darkStyles.submitButtonText}>Search</Text></Pressable>
            </View> 

            {
                showData ? <>
                <View style={theme == "light" ? lightStyles.container : darkStyles.container}>
                    {
                        markets && markets.map((mark, index) => {
                            const marketData = commoditiesData.filter((comodityData) => comodityData.market == mark);
                            return(<View key={index}>
                            <Text style={theme == "light" ? lightStyles.marketTitle : darkStyles.marketTitle}>{mark}</Text>
                            <View style={theme == "light" ? lightStyles.table : darkStyles.table}>
                                        <Table borderStyle={theme == "light" ? lightStyles.borderStyle : darkStyles.borderStyle}>
                                            <Row data={['commodity', 'arrival_date', 'min_price', 'max_price', 'modal_price']} style={theme == "light" ? lightStyles.head : darkStyles.head} textStyle={theme == "light" ? lightStyles.text : darkStyles.text}/>
                            {
                                marketData.map((data, index) => {
                                    return (<Row key={index} data={[data.commodity, data.arrival_date, data.min_price, data.max_price, data.modal_price]} textStyle={theme == "light" ? lightStyles.text : darkStyles.text}/>
                                    );
                                })
                            }
                            </Table>
                            </View>
                            </View>);
                        })
                    }
                </View>
                </>
                : <></>
            }

            

        </ScrollView>
        </SafeAreaView>
    );
};

const defaultStyles = StyleSheet.create({
    SafeAreaView: {flex: 1},
    formArea: {alignSelf: 'center',width: '90%', borderRadius: 5},
    formTitle: {top: 0, marginTop: 15, fontWeight: "bold", alignSelf: "center", fontSize: 24},
    input: {padding: 10,marginVertical: 20, width: "90%", alignSelf: 'center', borderRadius: 10},
    submitButton: {backgroundColor: '#e60000',width: "30%",paddingVertical: 5,paddingHorizontal: 3,borderRadius: 5, marginTop: 5,marginBottom:20,alignSelf: "center"},
    submitButtonText: {textAlign: 'center', color: '#000', fontSize: 18, fontWeight: "bold"},
    marketTitle: {fontSize:22, margin:10, fontWeight: "bold", color:"#1dbf73"},
    table: {marginVertical: 10},
    borderStyle: {borderWidth: 1},
    container: {padding: 16, width: "95%", alignSelf: "center", borderRadius: 10,marginVertical: 15},
    head: {height: 40},
    row: {height: 28},
    text: {textAlign: 'center'}
});

const lightStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    formTitle: {...defaultStyles.formTitle, color: "#FFF"},
    input: {...defaultStyles.input, backgroundColor: '#FFF', color: "#000"},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText},
    marketTitle: {...defaultStyles.marketTitle},
    table: {...defaultStyles.table},
    borderStyle: {...defaultStyles.borderStyle, borderColor: "#000"},
    container: {...defaultStyles.container, backgroundColor: '#fff'},
    head: {...defaultStyles.head,  backgroundColor: '#f1f8ff'},
    row: {...defaultStyles.row},
    text: {...defaultStyles.text, color: "#000"}
});

const darkStyles = StyleSheet.create({
    SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#5257f1"},
    formArea: {...defaultStyles.formArea, backgroundColor: "#5257f1"},
    formTitle: {...defaultStyles.formTitle, color: "#FFF"},
    input: {...defaultStyles.input, backgroundColor: '#252E2F', color: "#FFF"},
    submitButton: {...defaultStyles.submitButton},
    submitButtonText: {...defaultStyles.submitButtonText},
    marketTitle: {...defaultStyles.marketTitle},
    table: {...defaultStyles.table},
    borderStyle: {...defaultStyles.borderStyle, borderColor: "#FFF"},
    container: {...defaultStyles.container, backgroundColor: '#252E2F'},
    head: {...defaultStyles.head},
    row: {...defaultStyles.row},
    text: {...defaultStyles.text, color: "#FFF"}
});