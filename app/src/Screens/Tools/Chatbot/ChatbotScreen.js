import React, { useRef, useEffect, useState } from "react";
import { View, Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BpWidget from "./BpWidget";
import BpIncommingMessagesListener from "./BpIncommingMessagesListener";
import { useSelector } from "react-redux";
import { CHATBOT_BOT_ID, CHATBOT_CLIENT_ID } from "../../../assets/ENV";
import Toast from "react-native-toast-message";

const testingConfig = {
  composerPlaceholder: "Chat with bot",
  botConversationDescription:
    "This chatbot was built surprisingly fast with Botpress",
  botId: CHATBOT_BOT_ID,
  hostUrl: "https://cdn.botpress.cloud/webchat/v1",
  messagingUrl: "https://messaging.botpress.cloud",
  clientId: CHATBOT_CLIENT_ID,
  lazySocket: true,
  frontendVersion: "v1",
  showPoweredBy: true,
  hideWidget: true,
  disableAnimations: true,
  closeOnEscape: false,
  showConversationsButton: false,
  enableTranscriptDownload: false,
  className: "webchatIframe",
  containerWidth: "100%25",
  layoutWidth: "100%25",
  showCloseButton: false,
};

export default ChatbotScreen = () =>  {

 const botpressWebChatRef = useRef();
 const theme = useSelector(state => state.theme).data;
 const [display, setDisplay] = useState(true);

 useEffect(() => {
  sendExampleEvent();
}, []);

 const sendExampleEvent = () => {
  Toast.show({
    type: 'info',
    text1: 'If internet is off then please on.',
    text2: ""
  });
  botpressWebChatRef.current?.sendEvent({ type: "toggle" });
 }

  return (
    <SafeAreaView style={theme == "light" ? lightStyles.SafeAreaView : darkStyles.SafeAreaView}>

    {/* Header */}
    <Header />

    <View style={{ flex: 1, flexDirection: "column" }}>
        <Pressable style={theme == "light" ? lightStyles.title : darkStyles.title}><Text style={theme == "light" ? lightStyles.titleText : darkStyles.titleText}>Chatbot</Text></Pressable>

        { display ? <ActivityIndicator size="large" style={{alignSelf: "center"}} /> : <></> }

        <BpWidget
        ref={botpressWebChatRef}
        botConfig={testingConfig}
        onMessage={(event) => {
          setDisplay(false);
        }}
      />
      
        {/* In case your webchat is not rendered and you want to catch bot messages */}
        <BpIncommingMessagesListener
          botConfig={testingConfig}
          onBotMessage={(event) => {
            Toast.show({
              type: 'error',
              text1: 'Bot message',
              text2: event,
            });
          }}    
        />

      </View>
</SafeAreaView>
  );
};


const defaultStyles = StyleSheet.create({
  SafeAreaView: {flex: 1},
  title: {margin: 10},
  titleText: {fontSize: 25, fontWeight: 'bold', color:"#0171DF", textAlign: "center"},
});

const lightStyles = StyleSheet.create({
  SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#FFF"},
  title: {...defaultStyles.title},
  titleText: {...defaultStyles.titleText, color:"#0171DF"},
});

const darkStyles = StyleSheet.create({
  SafeAreaView: {...defaultStyles.SafeAreaView, backgroundColor: "#000"},
  title: {...defaultStyles.title},
  titleText: {...defaultStyles.titleText, color:"#FFF"},
});