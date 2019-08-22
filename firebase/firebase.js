import * as firebase from "firebase";
import "firebase/firestore";
import { user } from "firebase-functions/lib/providers/auth";

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
      console.log("just initialized");
    } else {
      console.log("already initialized");
    }
  }

  async createUser(collectionPath, doc) {
    try {
      const ref = this._firestore.collection(collectionPath).doc();
      return await ref.set({
        ...doc,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl
      });
    } catch (error) {
      console.log(error);
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
      return await ref.set({ ...doc, createdBy: "Santa Claus", id: ref.id });
    } catch (error) {
      console.log(error);
    }
  }

  async GetEvents(collectionPath, doc) {
    try {
      const ref = this._firestore.collection(collectionPath).doc(doc);
      return ref.get();
    } catch (error) {
      console.log(error);
    }
  }
}
