<template>
  <div class="container">
    <h1>ダッシュボード</h1>

    <div class="tabs">
      <ul>
        <li :class="{ 'is-active' : activeCategory === 'Newest'}">
          <a href="#" @click="setCategory('Newest')">最新記事</a>
        </li>
        <li v-for="category in categories" :class="{ 'is-active' : activeCategory === category.title}">
          <a href="#" @click="setCategory(category.title)">{{ category.title }}</a>
        </li>
      </ul>
    </div>
    <!-- Newest -->
    <!-- "Newest"をstring型で渡すためcategoryはv-bindしない -->
    <!-- categoriesはTabMovie.vueで使うのでv-bindしてpropsで受け取れるようにする -->
    <tab-movie
      category="Newest"
      v-if="activeCategory === 'Newest'"
      :categories="categories"
      >
    </tab-movie>
    <!-- カテゴリ−１ -->
    <!-- categoryをTabMovieで使うのでv-bindで渡す -->
    <!-- categoryのtitleもTabMovie.vueで使うのでv-bindする -->
    <!-- updateCategoryで編集して保存したtitleを受け取ることで即座に動画を表示させるようにすることができる
          なぜならsetCategoryはthis.activeCategory = titleなので、編集したtitleをacriveなカテゴリーに即座に適用することができる
          TabMovie.vueから編集したtitleをemitして受け取るのでupdateCategoryとする -->
    <tab-movie
      v-for="category in categories"
      :key="category.id"
      :categorytitle="category.title"
      :category="category.id"
      @updateCategory="setCategory"
      v-if="activeCategory === category.title"
      >
    </tab-movie>
  </div>
</template>

<script>

// Vuefireでdbを定義
import { db } from '../firebase/config.js'
import TabMovie from '../components/TabMovie.vue'

export default {
  name: 'dashboard',
  components: { TabMovie },
  data() {
    return {
      categories: [],
      activeCategory: 'Newest',
    }
  },
  firestore () {
    return {
      // 初期値が空の配列のcategoriesにfirestoreのcategoriesにする
      categories: db.collection('categories')
    }
  },
  methods: {
    setCategory (title) {
      this.activeCategory = title
    }
  }
}
</script>

<style>

</style>