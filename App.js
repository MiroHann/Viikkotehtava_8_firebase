import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { firestore,collection,addDoc,MESSAGES,query, onSnapshot } from './firebase/Config';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { QuerySnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { convertFirebaseTimeStampToJs } from './helper/Function'
export default function App() {
  const [newMessage, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
  const q = query(collection(firestore,MESSAGES),orderBy('created', 'desc'))
  
  const unsubscribe = onSnapshot(q,(QuerySnapshot) => {
    const tempMessages = []

    QuerySnapshot.forEach((docs) => {
     const messageObject = {
      id: docs.id,
      text: docs.data().text,
      created: convertFirebaseTimeStampToJs(docs.data().created)
     }
     tempMessages.push(messageObject)
    })
    setMessages(tempMessages)
    console.log(messages)
  })
    return () => {
      unsubscribe()
    }
  }, [])

  const save = async() => {
    const docRef = await addDoc(collection(firestore, MESSAGES),{
      text: newMessage,
      created: serverTimestamp()
    }).catch(error => console.log(error))
    setMessage('')
    console.log('Message saved')

  }

  return (
    <>
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {
          messages.map((message) => (
            <View style={styles.message} key={message.id}>
              <Text style={styles.messageInfo}>{message.created}</Text>
              <Text style={styles.messagetext}>{message.text}</Text>
            </View>
          ))
        }
      </ScrollView>
      </SafeAreaView>
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Send message....' value={newMessage} onChangeText={text => setMessage(text)}/>
      <Button style={styles.button} title='Send' type='button' onPress={save}></Button>
      <StatusBar style="auto" />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
  alignContent: 'center',
  textAlign: 'center',
  marginBottom: 20,
  fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight
  },
  messagetext: {
  fontSize: 18,
  },
  message: {
    padding: 10, 
    marginTop: 10, 
    marginBottom: 10, 
    backgroundColor: '#f5f5f5',
    borderColor:'#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  },
  messageInfo: {
    fontSize: 12,
    color: 'gray',
  }
});
