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
    apiKey: 'PASTE_FROM_FIREBASE_CONSOLE',
    authDomain: 'PASTE_FROM_FIREBASE_CONSOLE',
    projectId: 'PASTE_FROM_FIREBASE_CONSOLE',
    appId: 'PASTE_FROM_FIREBASE_CONSOLE',
    measurementId: 'PASTE_FROM_FIREBASE_CONSOLE'
  };
})();