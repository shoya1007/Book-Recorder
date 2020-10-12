<template>
  <div class="list">
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <p>{{bookCount}}件の読書情報が記録されています</p>
    <!-- 書籍情報を表示 -->
    <BookInfo v-for="(b,i) of books" :linkable="true" :book="b" :index="i+1" :key="b.id"></BookInfo>
    <!-- ページャーの生成 -->
    <div>
      <el-pagination class="pagination" background layout="prev,pager,next" :total="bookCount" :page-size="3" @current-change="onchange"></el-pagination>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import {mapGetters} from 'vuex';
import BookInfo from '../components/Bookinfo.vue'

export default {
  name: 'Home',
  data(){
    return {
      books: []
    }
  },
  components: {
    BookInfo
  },
  computed: mapGetters(['bookCount','getRangeByPage']),
  //ページ変更時にレビュー情報を新たにセット
  methods: {
    onchange(page){
      this.books = this.getRangeByPage(page)
    },    
  },
  //初期化時に1ページ目の情報を取得
  mounted(){
    this.books = this.getRangeByPage(1)    
  }
}
</script>

<style>
  .pagination {
    text-align: center;
  }
</style>