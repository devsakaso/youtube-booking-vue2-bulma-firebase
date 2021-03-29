<template>
  <div>
    <!-- SignUp.vueからコピー -->
    <!-- 変更点: Sign upをlog inに変更する -->
    <!-- login()メソッドをcreateUserWithEmailAndPasswordではなくsignInWithEmailAndPassword -->
    <!-- router/index.jsでpathを設定する -->
    <!-- App.vueでrouter-linkをセットする -->
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <h1 class="title">ログイン</h1>
        <form @submit.prevent="login">
          <!-- メール -->
          <div class="field">
            <div class="control">
              <input type="text" placeholder="Email" v-model="email" class="input">        
            </div>
          </div>
          <!-- パスワード -->
          <div class="field">
            <div class="control">
              <input type="password" placeholder="Password" v-model="password" class="input">
            </div>
          </div>
          <!-- 送信ボタン -->
          <div class="field">
            <div class="control">
              <button class="button is-success">ログイン</button>
            </div>
          </div>
          <!-- エラー -->
          <article class="message is-danger" v-if="error">
            <div class="message-body">
              {{ error }}
            </div>
          </article>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// firebaseを使う　importする④/5
// import firebase from 'firebase'
// import 'firebase/firestore'
// import 'firebase/auth'
import { projectAuth } from '../firebase/config.js'


export default {
  name: 'LogIn',
  data (){
    return {
      email: '',
      password: '',
      // authの状態を設定する1/2
      isAuthenticated: false,
      error: null,
    }
  },
  // authの状態を設定する2/2
  created() {
    projectAuth.onAuthStateChanged(user => {
      if(user) {
        this.isAuthenticated = true

        this.$router.push('/dashboard')
      }
    })
  },
  methods: {
    login () {
      console.log('Log In');

// Log in の場合はcreateUserWithEmailAndPasswordではなくsignInWithEmailAndPasswordを使う
      projectAuth.signInWithEmailAndPassword(this.email, this.password)
      .catch(err => this.error = err.message)
    },
    logout() {
      console.log('Log Out');
      projectAuth.signOut()
      .then(() => {
        this.isAuthenticated = false
      })
    }
  }
}
</script>
