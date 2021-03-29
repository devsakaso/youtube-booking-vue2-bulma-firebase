<template>
  <div id="app">
    <!-- ナビゲーションバー -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
       <h4> Title</h4>
      </a>
    </div>
      <div class="navbar-menu">
        <!-- 左側のnavbarのitem -->
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">Home</router-link>
          <router-link to="/about" class="navbar-item">About</router-link>
          <router-link to="/dashboard" class="navbar-item">Dashboard</router-link>
            <!-- viewsにコンポーネントを追加したら最後にrouter-linkを設定などする -->
        </div>
        <!-- 右側のnavbarのitem -->
        <div class="navbar-end">
          <div class="navbar-item">
            <!-- ログインしていないときのみ表示 -->
            <div class="field is-grouped" v-if="!isAuthenticated">
              <p class="control">
              <router-link to="/signup" class="button is-primary">アカウントを作成</router-link>
              </p>
              <p class="control">
              <router-link to="/login" class="button is-info">ログイン</router-link>
              </p>
            </div>
            <!-- ログインしているときのみ表示 -->
            <div class="field" v-else>
              <div class="field is-grouped">
                <p class="control">
                  <button class="button is-primary" @click="showCategoryForm = !showCategoryForm">カテゴリーを追加</button>
                </p>
                <p class="control">
                  <button class="button is-primary" @click="showMovieForm = !showMovieForm">映画を追加</button>
                </p>
                <p class="control">
                  <button class="button is-danger" @click="logout">ログアウト</button>
                </p>
              </div>
            </div>
          </div>
      </div>
     </div>
    </nav>

<!-- モーダル カテゴリー(追加) -->
    <div class="modal" :class="{ 'is-active' : showCategoryForm }">
      <div class="modal-background"></div>
      <div class="modal-content">
      <!-- <div class="modal-card"> -->
        <form @submit.prevent="addCategory">
          <div class="field">
            <input type="text" class="input" v-model="title">
          </div>
          <div class="field">
            <button class="button is-primary" @click="showCategoryForm = !showCategoryForm">カテゴリーを追加</button>
          </div>
        </form>
      </div>
    </div>

<!-- モーダル 映画 -->
    <div class="modal" :class="{ 'is-active' : showMovieForm }">
      <div class="modal-background"></div>
      <div class="modal-content">
      <!-- <div class="modal-card"> -->
        <form @submit.prevent="addMovie">
          <div class="field">
            <input type="text" class="input" v-model="title" placeholder="タイトル">
          </div>
          <div class="field">
            <input type="text" class="input" v-model="url" placeholder="URL">
          </div>
          <div class="field">
            <select v-model="category">
              <option value="empty" selected>カテゴリーを選択</option>
              <option v-for="category in categories" :value="category.id">{{ category.title }}</option>
            </select>
          </div>
          <div class="field">
            <button class="button is-primary" @click="showMovieForm = !showMovieForm">カテゴリーを追加</button>
          </div>
        </form>
      </div>
    </div>

  <router-view/>
  </div>
</template>

<script>
import { db, projectAuth } from './firebase/config.js'


export default {
  data () {
    return {
      isAuthenticated: false,
      showCategoryForm: false,
      showMovieForm: false,
      title: '',
      url: '',
      category: 'empty',
      categories: [],
    }
  },
  firestore () {
    return {
      categories: db.collection('categories')
    }
  },
    // authの状態を設定する3/3
  created() {
    projectAuth.onAuthStateChanged(user => {
      if(user) {
        this.isAuthenticated = true
      }
    })
  },
  methods: {
    addCategory () {
      const category = {
        title: this.title
      }

      db.collection('categories').add(category)

      //元に戻しておく 
      this.showCategoryForm = false
      this.title = ''
    },
    addMovie () {
      if (this.title && this.category !== 'empty') {
        // inputに入力されたタイトルを取得
        const movie = {
          title: this.title,
          url: this.url
          }
          // colections「categories」の中の選択されたカテゴリーに追加
          db.collection('categories').doc(this.category).collection('movies').add(movie)

          // 初期状態に戻す
          this.title = ''
          this.url = ''
          this.category = 'empty'
          this.showMovieForm = false
        } else {
          alert('入力されていない項目があります。')
        }
    },
    logout() {
      projectAuth.signOut()
      .then(() => {
        this.isAuthenticated = false
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="scss">
@import "../node_modules/bulma/css/bulma.css";



#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
