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
      await ref.set({ ...doc, id: ref.id})
      return ref
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
        attendees: [],
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
        events: [],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async AddUserEvent(eventId, UserId) {
    try {
      const ref = await this._firestore.collection('User').doc(UserId);
      return await ref.update({
        events: firebase.firestore.FieldValue.arrayUnion(eventId),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async AddEventAttendee(eventId, UserId) {
    try {
      const ref = await this._firestore.collection('Event').doc(eventId);
      return await ref.update({
        attendees: firebase.firestore.FieldValue.arrayUnion(UserId),
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
      const categoryArray = [];
      return await ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          categoryArray.push({
            id: doc.id,
            imageUrl: doc.data().imageUrl,
            start: doc.data().start,
            end: doc.data().end,
            name: doc.data().name,
            category: doc.data().category,
            description: doc.data().description,
          });
        });
        return categoryArray;
      });
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
          categoryArray.push({
            type: doc.data().Type,
            key: doc.id,
            imageUrl: doc.data().imageUrl,
          });
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

  async AddUserInterest(doc, interests) {
    const ref = await this._firestore.collection('User').doc(doc);
    await ref.set(
      {
        interests: interests,
      },
      { merge: true }
    );
  }

  async GetVenues(collectionPath, doc) {
    try {
      if (doc) {
        const ref = await this._firestore
          .collection(collectionPath)
          .doc(doc.id);
        if (doc.id) {
          return ref.set({
            id: doc.id,
            address: doc.address.address_1,
            city: doc.address.city,
            state: doc.address.region,
            zipcode: doc.address.postal_code,
            latitude: doc.address.latitude,
            longitude: doc.address.longitude,
          });
        } else {
          console.log(doc);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async UserDelEvent (user, eventId) {
    try {
      const ref = await this._firestore.collection("User").doc(user)
      await ref.update({
        events: firebase.firestore.FieldValue.arrayRemove(eventId)
    });
    } catch (error) {
      console.log(error)
    }
  }

  async addInterest (user, categoryCode) {
    try {
      const ref = await this._firestore.collection("User").doc(user)
      await ref.update({
        interests: firebase.firestore.FieldValue.arrayUnion(categoryCode)
    });
    } catch (error) {
      console.log(error)
    }
  }

  async delInterest (user, categoryCode) {
    try {
      const ref = await this._firestore.collection("User").doc(user)
      await ref.update({
        interests: firebase.firestore.FieldValue.arrayRemove(categoryCode)
    });
    } catch (error) {
      console.log(error)
    }
  }
}
