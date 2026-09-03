/*!
 * persano.github.io — Firebase Web App config (public-by-design).
 *
 * Classic script (no modules, D-26). Assigns the single global the
 * consent gate and the contact form read: window.persanoFirebaseConfig.
 * Config values for Firebase web apps are public by design — security
 * lives in the Firestore rules (create-only) and the consent gate, not
 * in hiding these strings. Authorized domains are restricted console-side.
 *
 * Values below are placeholders; the owner pastes the real Web App config
 * (Firebase Console → Project settings → General → Your apps → Web app)
 * at plan 04-01 Task 3. No other exports.
 */
(function () {
  'use strict';
  window.persanoFirebaseConfig = {
    apiKey: 'AIzaSyC-1Bl4cgYO60wNfik018P0a51GCbjQkTA',
    authDomain: 'geohist-trivia.firebaseapp.com',
    projectId: 'geohist-trivia',
    appId: '1:319868923091:web:5f99d2cba76f6c7a247826',
    measurementId: 'G-KDWVVHRYD5'
  };
})();
