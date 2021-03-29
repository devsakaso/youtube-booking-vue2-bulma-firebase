import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


// Vuefire
import { firestorePlugin } from 'vuefire'

// scss
// require("./assets/main.scss")


Vue.config.productionTip = false
// Vuefireプラグインを有効化
// Dashboard.vueで使えるようになる
Vue.use(firestorePlugin)




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


