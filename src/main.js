import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import firebase from 'firebase'
Vue.config.productionTip = false

// Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      apiKey: "AIzaSyCcYMhvHABmThXhkOO9p9GFTK8unnWY7no",
      authDomain: "book-recorder.firebaseapp.com",
      databaseURL: "https://book-recorder.firebaseio.com",
      projectId: "book-recorder",
      storageBucket: "book-recorder.appspot.com",
      messagingSenderId: "923368970136",
      appId: "1:923368970136:web:2556b74bc54bc0388cbded",
      measurementId: "G-QCD5WWWNSS"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
Vue.prototype.$http = (url,opts) => fetch(url, opts)

new Vue({
  router,
  store,
  render: h => h(App),
  //インスタンス生成時、localstorageからデータ読み込み
  // beforeCreate(){
  //   this.$store.dispatch('load')
  // }
}).$mount('#app')
