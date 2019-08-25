import * as firebase from 'firebase';
import 'firebase/firestore';
import { user } from 'firebase-functions/lib/providers/auth';

// creates private variables by making a class
export class FirebaseWrapper {
  constructor() {
    this.initialized = false;
    this._firebaseInstance = null;
    this._firebaseWrapperInstance = null;
    this._firestore = null;
  }

  Initialize(config) {
    if (!this.initialized) {
      this._firebaseInstance = firebase.initializeApp(config);
      this._firestore = firebase.firestore();
      this.initialized = true;
      console.log('just initialized');
    } else {
      console.log('already initialized');
    }
  }

  static GetInstance() {
    // eslint-disable-next-line no-eq-null
    if (null == this._firebaseWrapperInstance) {
      this._firebaseWrapperInstance = new FirebaseWrapper();
    }
    // no else since it's already initialized
    return this._firebaseWrapperInstance;
  }

  async CreateNewDocument(collectionPath, doc) {
    try {
      const ref = this._firestore.collection(collectionPath).doc();
      return await ref.set({ ...doc });
    } catch (error) {
      console.log(error);
    }
  }

  async CreateNewEventBriteDocument(collectionPath, doc) {
    try {
      const ref = this._firestore.collection(collectionPath).doc(doc.id);
      return await ref.set({
        name: doc.name.text,
        description: doc.description.text,
        start: doc.start.local,
        end: doc.end.local,
        category: doc.category_id,
        createdBy: 'EventBrite',
        id: doc.id,
        venue: doc.venue_id,
        imageUrl: doc.logo.url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createUser(collectionPath, doc) {
    try {
      const ref = this._firestore.collection(collectionPath).doc(doc.user.uid);
      return await ref.set({
        email: doc.user.email,
        profile_picture: doc.additionalUserInfo.profile.picture,
        first_name: doc.additionalUserInfo.profile.given_name,
        last_name: doc.additionalUserInfo.profile.family_name,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetEvents(collectionPath, doc) {
    try {
      const ref = await this._firestore.collection(collectionPath).doc(doc);
      return await ref.get();
    } catch (error) {
      console.log(error);
    }
  }

  async GetInterestEvents(code) {
    try {
      const ref = await this._firestore
        .collection('Event')
        .where('category', '==', code);
      return await ref.get();
    } catch (error) {
      console.log(error);
    }
  }

  async GetAllCategories() {
    try {
      const ref = await this._firestore.collection('Categories');
      const categoryArray = [];
      return await ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          categoryArray.push({ type: doc.data().Type, key: doc.id });
        });
        return categoryArray;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetVenueFromFirestore() {
    try {
      const ref = await this._firestore.collection('Event');
      const venueArray = [];
      return await ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          venueArray.push(doc.data().venue);
        });
        return venueArray;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetVenues(collectionPath, doc) {
    try {
      const ref = await this._firestore.collection(collectionPath).doc(doc.id);
      return ref.set({
        id: doc.id,
        address: doc.address.address_1,
        city: doc.address.city,
        state: doc.address.region,
        zipcode: doc.address.postal_code,
        latitude: doc.address.latitude,
        longitude: doc.address.longitude,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
