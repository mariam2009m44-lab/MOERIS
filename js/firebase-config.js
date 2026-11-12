/* Firebase client config is public by design. Protect data with Firestore/Storage Rules.
   Replace every placeholder using Firebase Console > Project settings > Your apps.
   Never put a service-account private key in this file. */
window.MOERIS_FIREBASE_CONFIG = {
  apiKey: "PASTE_FIREBASE_WEB_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID",
  appId: "PASTE_FIREBASE_APP_ID"
};
/* After creating the owner account, paste its Firebase Authentication UID here.
   The same UID must be used in firestore.rules and storage.rules. */
window.MOERIS_OWNER_UID = "PASTE_OWNER_AUTH_UID";