<template>
  <div class="columns is-multiline">
    <!-- 削除に関するメッセージ -->
    <article class="column is-12 message is-danger" v-if="show">
      <div class="message-body">
        {{ flashMessage }}
      </div>
    </article>

    <!-- カテゴリーの編集ボタン -->
    <div class="column is-12">
      <button class="button is-primary" @click="showCategoryForm = !showCategoryForm">カテゴリーを編集</button>
    </div>
    <!-- カテゴリーの削除ボタン -->
    <div class="column is-12">
      <button class="button is-danger" @click="deleteCategory(category)">カテゴリーを削除</button>
    </div>

    <!-- モーダル カテゴリー(編集) -->
    <div class="modal" :class="{ 'is-active' : showCategoryForm }">
      <div class="modal-background"></div>
      <div class="modal-content">
      <!-- <div class="modal-card"> -->
        <form @submit.prevent="saveCategory">
          <div class="field">
            <input type="text" class="input" v-model="title">
          </div>
          <div class="field">
            <button class="button is-primary" @click="showCategoryForm = !showCategoryForm">カテゴリーを保存</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Movieのカード -->
    <div class="column is-4" v-for="movie in movies" :key="movie.id">
      <div class="card">
        <div class="card-image">
            <iframe :src="embedable(movie.url)" width="100%" height="300"></iframe>
        </div>
        <div class="content">
          {{ movie.title }}
        </div>
        <div class="card-footer">
          <a @click="deleteMovie(movie)" class="card-footer-item button is-danger">削除</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { db } from '../firebase/config.js'

export default {
  name: 'TabMovie',
  props: {
    category: String,
    categories: Array,
    categorytitle: String,
  },
  data () {
    return {
      movies: [],
      title: '',
      showCategoryForm: false,
      flashMessage: '',
      show: false,
    }
  },
  mounted() {
    if (this.$props.category === 'Newest') {
        for (let i = 0; i < this.$props.categories.length; i++) {
          const categoryID = this.$props.categories[i].id
          db.collection('categories').doc(categoryID).collection('movies').get()
          .then(querySnapshot => {
            querySnapshot.forEach(collection => {
              // moviesが6個以下の場合に行う
              if (this.movies.length < 7) {
                  // 空のmoviesにmoviesにデータベースにあるtitleとurlをオブジェクトでpushする
                this.movies.push({
                  title: collection.data().title,
                  url: collection.data().url,
                  id: collection.id,
                  category: categoryID
                })
              }
            })
          })
        }
    } else {
      // Newestでない場合、Dashboard.vueから受け取ったtitleを代入
      this.title = this.$props.categorytitle
    }
  },
  firestore () {
    if(this.$props.category !== 'Newest') {
          return {
            // db.collection('categories')でfirestoreのcategoriesを取得
            // doc(this.$props.category)でDashboard.vueのcategoryを取得
            // collection('movies')でそのカテゴリーのmoviesを取得
            // それを初期値が空のmoviesに格納する
            movies: db.collection('categories').doc(this.$props.category).collection('movies')
        }
    }
  },
  methods: {
    embedable (url) {
      // =以降がyoutubeの動画ID
      return `https://www.youtube.com/embed/${url.split('=')[1]}`
    },
    saveCategory () {
      // category.titleで使えるようにオブジェクトで新しくcategoryを宣言する
      // mounted()のelseでカテゴリーを編集したときのtitleを代入しているので、そのthis.titleをtitleとしたオブジェクトのcategoryを作る
      const category = {
        title: this.title
      }
      // dbに接続して、update()でcategoryをアップデートする
      db.collection('categories').doc(this.$props.category).update(category)
      // 追加と違って編集はtitleなどはモーダルが開いたときに表示されておいてほしいので元に戻さない

      // saveCategoryをDashboard.vueにわたす
      this.$emit('updateCategory', this.title)
    },
    deleteCategory (category) {
      if (category !== 'Newest') {
        console.log(category);
        if(confirm('カテゴリーを削除してよいですか？')) {
          // subcategoryであるmoviesのdocumentたちを削除する
          // アクセスするには、get()でsnapshotを取得して、その中のdocsがdocumentたちなので、forEachでdocとするとひとつひとつのdocにアクセスすることができる
          // deleteするのはdoc.ref
          // snapshot.sizeはdocumentの数を表す。movieが3つならsizeは3になる。
          // db.collection('categories').doc(category).collection('movies').get().then(snapshot => snapshot.docs.forEach(doc => doc.delete(doc.ref)))は動かないので、
          const clickedCategory = db.collection('categories').doc(category)
          clickedCategory.collection('movies').get().then(snapshot => {
            // size === 0、movieが一つもないならカテゴリー削除
            if (snapshot.size === 0) {
              db.collection('categories').doc(category).delete()

            // sizeが0以上、つまりmovieがあるなら削除せず、flashMessageを表示 
            } else if (snapshot.size > 0) {
                this.flashMessage = `snapshot.size: ${snapshot.size} - 登録している動画を削除してからカテゴリーの削除をしてください。`
                this.show = true
                // setTimeoutで3000ms後にshowをfalseにする
                setTimeout(() => this.show = false, 3000)
            } else {
                throw new Error
            }
          })
          .catch (err => console.log(err.message))
          
        }
      } else {
        console.log('最新記事カテゴリーは削除できません。');
      }
    },
    // deleteはfirebaseのデータベースから削除するのとmoviesの配列から削除する2つの処理が必要
    deleteMovie (movie) {
      if (this.$props.category === 'Newest') {
        // movie.categoryはつまりクリックされたmovieのcategoryのこと
        db.collection('categories').doc(movie.category).collection('movies').doc(movie.id).delete()
        let index

        for (let i = 0; i < this.movie.length; i++) {
          if (movie.id === this.movies[i].id) {
            index = i
            break
          }
        }
        this.movies.splice(index, 1)
      } else {
        db.collection('categories').doc(this.$props.category).collection('movies').doc(movie.id).delete()
      }
    }
  }
}
</script>

<style>

</style>