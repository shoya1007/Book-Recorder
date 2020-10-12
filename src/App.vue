<template>
  <div id="app">
    <h2>Book Recorder</h2>
    <!-- <img src="./assets/logo.png">
    <div>
      <p>
        If Element is successfully added to this project, you'll see an
        <code v-text="'<el-button>'"></code>
        below
      </p>
      <el-button>el-button</el-button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- メインメニュー -->
    <el-menu mode="horizontal" background-color="orange" text-color="#fff" active-text-color="#ffd04b">      
      <el-menu-item disabled v-if="$store.state.login_user">
        <span class="name">{{userName}}さん</span>
      </el-menu-item>
      <el-menu-item index="1">
        <router-link to="/">検索</router-link>
      </el-menu-item>
      <el-menu-item index="2"  v-if="$store.state.login_user">
        <router-link to="/home">マイ記録</router-link>        
      </el-menu-item>
      <el-menu-item index="3" v-if="$store.state.login_user">
        <router-link to="/others">みんなの投稿</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="" @click.native="logout" v-if="$store.state.login_user">ログアウト</router-link>
        <router-link to="/login" v-if="!$store.state.login_user">ログイン</router-link>
      </el-menu-item>      
    </el-menu>
    <!-- ルーティングの表示 -->
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import firebase from 'firebase'
import { mapActions,mapGetters } from 'vuex'
export default {
  name: 'app',
  // components: {
  //   HelloWorld
  // }
  beforeCreate() {
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        //storeのstateにユーザー情報をセットし、「ログインしました」と表示
        this.setLoginUser(user)   
        this.fetchBooks()
        this.fetchOthersBooks()
        this.$router.push('/') 
        this.$notify({
          title: 'Book Recorder',
          message: this.$createElement('p', {style: 'color: #009'}, 'ログインしました'),
          duration: 2000
        })
        this.$store.state.isUser = true
      } else if(!user && this.$store.state.isUser){
        //storeのstateからユーザー情報を削除し、「ログアウトしました」と表示
        this.deleteLoginUser()
        this.$store.state.searchResult = []
        this.$store.state.keyword = '池井戸潤'
        this.$store.state.currentPage = null
        this.$store.state.totalItems = []
        this.$router.push('/')
        this.$notify({
          title: 'Book Recorder',
          message: this.$createElement('p', {style: 'color: #009'}, 'ログアウトしました'),
          duration: 2000
        })        
      }
    })
  },
  methods: {
    ...mapActions(['setLoginUser','deleteLoginUser','logout','fetchBooks','fetchOthersBooks'])
  },
  computed: {
    ...mapGetters(['userName', 'photoUrl'])
  }
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
.name {
  color:rgb(0, 0, 0);
}
</style>
