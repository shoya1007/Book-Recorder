<template>
    <div id="search">
        <el-form>
            <el-form-item label="キーワード">
                <el-input type="text" size="large" v-model="keyword"></el-input>
            </el-form-item>            
            <el-form-item  class="button">
                <div>
                    <el-button type="primary" @click="onclick">検索</el-button>
                </div>
            </el-form-item>
        </el-form>
        <hr>
        <BookInfo v-for="(b,i) of $store.state.searchResult" :linkable="true" :book="b" :index="i+1" :key="b.isbn"></BookInfo>
        <div>
            <el-pagination ref="pagination" class="pagination" background layout="prev,pager,next" :total="$store.state.totalItems" :page-size="10" :current-page.sync="currentPage" @current-change="onchange"></el-pagination>
        </div>
    </div>
</template>

<script>
import BookInfo from '../components/Bookinfo.vue'
import { mapActions } from 'vuex'
export default {
    name: 'book-search',
    components: {
        BookInfo
    },    
    data(){
        return {
            keyword: this.$store.state.keyword,
            totalItems: null,
            index: 0,
            books: [],
            posts: [],
            searching: false,
            word: null,
            currentPage: this.$store.state.currentPage,            
        }
    },
    methods: {
        //検索ボタンで書籍を検索
        ...mapActions(['addResult']),
        onclick: function(){
            console.log(this.currentPage)
            if(this.keyword != this.word) {
                console.log('キーワード変更')
                this.word = this.keyword
                this.currentPage = 1
                this.index = 0
            }            
            this.$http('https://www.googleapis.com/books/v1/volumes?q='+this.keyword+'&maxResults=10'+'&startIndex='+this.index)
                //JSONデータとして取得
                .then((response)=>{
                    return response.json()
                })
                //JSONの内容をbooksに詰め替え
                .then((data)=>{
                    this.totalItems = data.totalItems
                    this.$store.state.totalItems = data.totalItems
                    this.books=[]
                    for(let b of data.items){
                        let authors = b.volumeInfo.authors
                        let price = b.saleInfo.listPrice
                        let publisher = b.volumeInfo.publisher
                        let published = b.volumeInfo.publishedDate
                        let img = b.volumeInfo.imageLinks

                        console.log('格納')
                        this.books.push({
                            id: b.id,
                            title: b.volumeInfo.title,
                            author: authors ? authors.join(',') : '',
                            price: price ? price.amount.toLocaleString() : '-',
                            publisher: publisher ? b.volumeInfo.publisher : '',
                            published: published ? b.volumeInfo.publishedDate : '',
                            image: img ? img.smallThumbnail : ''
                        })
                    }
                    console.log(this.books)
                    this.addResult(this.books)
                })
            console.log('詰め替え終了')
            // sessionStorage.setItem('search-params',JSON.stringify(this.params))
            // this.getPosts();
            this.$store.state.keyword = this.keyword
            this.$store.state.currentPage = this.currentPage
        },
        onchange(page){
            console.log(this.word)
            console.log('ページ変更')
            console.log(page)           
            this.index = (page-1)*10 
            console.log('インデックス'+this.index)
            this.word = this.keyword
            this.onclick()   
            // this.$store.state.searchResult = []
        }
        // getPosts: function(){
        //     this.searching = true
        //     this.posts = []

        //     fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
        //         .then(response=>response.json())
        //         .then(data=>{
        //             this.posts=data
        //         })
        //         // .catch(error=>{

        //         // })
        //         .then(()=>{
        //             this.searching = false
        //         })
        // }
    },
    // mounted() {
    //     if(sessionStorage.hasOwnProperty.call(sessionStorage,'search-params')) {
    //         this.params = JSON.parse(
    //             sessionStorage.getItem('search-params')
    //         )
    //     }

    //     this.getPosts();
    // }
}
</script>

<style>
    .button{
        text-align: center;
        display: block;
    }
</style>

