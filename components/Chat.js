import React, { Component } from "react";
//import relevant components from react native
import { StyleSheet, Text, View, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
// create Screen2 (Chat) class
//import firebase
const firebase = require("firebase");
require("firebase/firestore");

// create Screen2 (Chat) class
export default class Chat extends Component {
  constructor() {
    super();

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCVSLGXX7Te3NAPhG-jYbUe-8UPxNUeexM",
        authDomain: "chatapp-b6157.firebaseapp.com",
        databaseURL: "https://chatapp-b6157.firebaseio.com",
        projectId: "chatapp-b6157",
        storageBucket: "chatapp-b6157.appspot.com",
        messagingSenderId: "828054549169",
        appId: "1:828054549169:web:85233346327d0c638aa890",
        measurementId: "G-2Q62Y91C7E",
      });
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");

    this.state = {
      messages: [],
      uid: 0,
    };
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
      });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });

    this.setState({
      messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  //appending new message to messages object
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  //render components
  render() {
    return (
      //fullscreen component
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.navigation.state.params.backgroundColor,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
