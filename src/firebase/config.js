import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { config } from '../apiConfig'


// firebaseの構成をコピペ②/5
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};
// firebaseを初期化する ③/5→SignUp.vueに移動して使う
firebase.initializeApp(firebaseConfig)

// init servises
const projectAuth = firebase.auth()

// Vuefireプラグインを使っているのでこれでfirestoreのデータベースを呼び出せる
const db = firebase.firestore()

export { db, projectAuth }
