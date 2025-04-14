const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://legal-guide-2f523.firebasestorage.app",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
