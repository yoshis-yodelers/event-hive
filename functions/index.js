const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
admin.initializeApp();
const env = functions.config();

// initialize algolia
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('event-hive');

exports.indexEvent = functions.firestore
  .document('Event/{eventId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const objectId = snap.id;

    // add data to algolia index
    return index.addObject({
      objectId,
      ...data,
    });
  });

exports.unindexEvent = functions.firestore
  .document('Event/{eventId}')
  .onCreate((snap, context) => {
    const objectId = snap.id;

    // add data to algolia index
    return index.deleteObject({
      objectId,
    });
  });
