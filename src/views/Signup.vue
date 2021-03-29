<template>
  <div>
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <h1 class="title">アカウント作成</h1>
        <form @submit.prevent="signup">
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
              <button class="button is-success">登録</button>
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
import { projectAuth } from '../firebase/config.js'

export default {
  name: 'Signup',
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
    signup () {
      console.log('Sign up');

// firebaseを使う　authを設定する⑤/5
      projectAuth.createUserWithEmailAndPassword(this.email, this.password)
      .catch(err => this.error = err.message)
    }
  }
}
</script>

<style>

/* form {
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
form * {
  padding: 10px;
  margin-bottom: 5px;
} */
</style>