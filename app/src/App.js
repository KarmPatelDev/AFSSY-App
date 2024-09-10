import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./AppNavigation";
import { Provider } from "react-redux";
import store from "./redux/store";
import Toast from 'react-native-toast-message';

export default App = () => {

  return(<>
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigation />
        <Toast />
      </NavigationContainer>
    </Provider>
  </>);
};