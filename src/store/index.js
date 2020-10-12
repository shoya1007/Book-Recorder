import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //レビューと書籍情報
    books: [],
    //他のユーザーの書籍情報
    othersBooks: [],
    //編集/選択中の書籍
    current: null,
    //ログインしているユーザー
    login_user: null,
    //userのログイン状態
    isUser: false,
    //他ユーザーの投稿
    posts: [],

    searchResult: [],

    keyword: '池井戸潤',

    currentPage: null,

    totalItems: []
  },
  getters: {
    //登録済みのレビュー数
    bookCount(state){
      return state.books.length
    },
    //全てのレビュー
    allBooks(state){
      return state.books
    },
    //他ユーザーの記録
    allOthersBooks(state){
      return state.othersBooks
    },
    //指定したページの情報を取得
    getRangeByPage(state){
      return page =>{
        const size = 3
        return state.books.slice((page-1)*size,(page-1)*size+size)
      }
    },
    //idをもとに情報を取得
    getBookById(state){
      return id =>{
        return state.books.find(book=>book.id===id)
      }
    },
    //現在編集中の作業
    current(state){
      return state.current
    },
    uid: (state)=>(state.login_user ? state.login_user.uid : null),
    userName: (state)=>(state.login_user ? state.login_user.displayName : null),
    photoUrl: (state)=>(state.login_user ? state.login_user.photoURL : null)
  },
  mutations: {
    updateCurrent(state,payload){
      state.current = payload
    },
    updateBook(state,payload){
      let book = this.getters.getBookById(payload.id)
      if(book){
        //既存のレビュー情報があれば、更新情報(payload)で上書き
        Object.assign(book,payload)
      }else{
        //なければ新規に追加
        state.books.push(payload)
      }
    },
    // save(state) {
    //   //json文字列に変換し、localstorageへ保存
    //   localStorage.setItem('store', JSON.stringify(state))
    // },
    load(state) {
      if(localStorage.getItem('store')) {
        //localstorageから取得したjson文字列を変換
        const store = JSON.parse(localStorage.getItem('store'))
        //stateを置き換える
        this.replaceState(Object.assign(state,store))
        //stateプロパティは読み取り専用のため、this.state=storeとは書けない
      }
    },
    setLoginUser(state,user) {
      state.login_user = user      
    },
    deleteLoginUser(state) {
      state.login_user = null      
    },
    addBook(state, {id,book}) {
      book.id = id;
      state.books.push(book);      
    },
    updateBooks(state, {id,book}) {
      const index = state.books.findIndex((book)=>book.id === id);
      state.books[index] = book;
    },
    deleteBook(state, id) {
      const index = state.books.findIndex((book)=>book.id === id);
      state.books.splice(index, 1)
    },
    addOthersBook(state, {id,book}) {
      book.id = id;
      state.othersBooks.push(book);
    },
    getOthersPosts(state,{id,book}){
      book.id = id;
      state.posts.push(book)
    },
    addResult(state, {books}) {
      state.searchResult = books
    }
  },
  actions: {
    updateCurrent({commit},payload){
      commit('updateCurrent',payload)
    },
    updateBook({commit},payload){
      commit('updateBook',payload)
    },
    // save({commit}) {
    //   commit('save')
    // },
    load({commit}) {
      commit('load')
    },
    googleLogin() {
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    setLoginUser({commit}, user) {
      commit('setLoginUser', user)      
    },
    logout() {
      firebase.auth().signOut()      
    },
    deleteLoginUser({commit}) {
      commit('deleteLoginUser')
    },
    addBook({getters, commit},book) {
      console.log(book)
      if(getters.uid){
        firebase
          .firestore()
          .collection(`users/${getters.uid}/books`)
          .doc(`${book.id}`)
          .set(book)
          .then(()=>{
            commit("addBook", {id:book.id,book:book});
          })
      }
    },
    fetchBooks({getters, commit}) {
      firebase.firestore().collection(`users/${getters.uid}/books`).get().then(snapshot=>{
        snapshot.forEach(doc=>commit('addBook',{id:doc.id,book:doc.data()}))
      })
    },
    updateBooks({getters, commit},{id,book}) {
      if(getters.uid) {
        firebase
          .firestore()
          .collection(`users/${getters.uid}/books`)
          .doc(id)
          .update(book)
          .then(()=>{
            commit('updateBooks', {id,book})
          })
      }
    },
    deleteBook({getters, commit},id) {
      if(getters.uid) {
        firebase
          .firestore()
          .collection(`users/${getters.uid}/books`)
          .doc(id)
          .delete()
          .then(()=>{
            commit('deleteBook', {id})
          })
      }
    },
    fetchOthersBooks({getters, commit}) {
      firebase.firestore().collectionGroup(`books`).where("uid", "!=", getters.uid).orderBy("uid").orderBy("read","desc").get().then(snapshot=>{
        snapshot.forEach(doc=>commit('addOthersBook',{id:doc.id,book:doc.data()}))
      })
    },
    fetchOthersPosts({commit},id) {
      firebase.firestore().collectionGroup(`books`).where("id", "==", id).get().then(snapshot=>{
        snapshot.forEach(doc=>commit('getOthersPosts',{id:doc.id,book:doc.data()}))
      })
    },
    addResult({commit}, books) {
      commit('addResult', {books})        
    }
  },
  modules: {
  }
})
