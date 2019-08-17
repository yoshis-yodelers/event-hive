import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCGCj33IN_bBb4jlPiBfqpum0iFDjq28ZI',
  authDomain: 'event-hive.firebaseapp.com',
  databaseURL: 'https://event-hive.firebaseio.com',
  projectId: 'event-hive',
  storageBucket: 'event-hive.appspot.com',
  messagingSenderId: '1008246741429',
  appId: '1:1008246741429:web:b037d03a79b031d9',
}; // apiKey, authDomain, etc. (see above)

firebase.initializeApp(firebaseConfig);

const dbh = firebase.firestore();

dbh
  .collection('event')
  .doc('bee keeping')
  .set({
    createdBy: 'Anna',
    location: { latitude: 100, longitude: 40 },
    name: 'Monday Bee Keeping',
  });
