<template>
    <div id="form">
        <BookInfo :book="book"></BookInfo>
        <hr>
        <span v-if="!$store.state.login_user">ログインすると読書記録を入力できます</span>
        <el-form ref="form" :model="form" :rules="rules" v-if="$store.state.login_user">
            <el-form-item label="読了日">
                <el-date-picker type="date" v-model="form.read"></el-date-picker>
            </el-form-item>
            <el-form-item label="感想" prop="memo">
                <el-input type="textarea" v-model="form.memo"></el-input>
            </el-form-item>            
            <el-form-item>
                <div class="button">
                    <el-button @click="back">戻る</el-button>
                    <el-button type="primary" @click="submit">登録</el-button>
                    <el-button type="danger" @click="deleteBooks" v-if="book.memo">削除</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div v-for="post in $store.state.posts" :key="post.id">
            <ul v-if="$store.state.posts && post.uid != $store.state.login_user.uid">
                <li class="postName">{{post.name}}さんの投稿</li>
                <li class="memo">{{post.memo}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import BookInfo from '../components/Bookinfo.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'book-form',
    components: {
        BookInfo
    },
    data(){
        return {
            //選択中の書籍
            book:{},
            //フォームの内容
            form:{
                read: new Date(),
                memo: ''
            },
            //バリデーションチェック
            rules:{
                memo: [
                    {required: true, message: 'メモが未入力です', trigger: 'change'}
                ]
            }, 
            user:{
                name: '',
                uid: ''
            }
        }
    },
    computed: mapGetters(['current', 'getBookById', 'userName', 'uid']),

    created(){
        if(!this.current){
            this.$router.push('/')
        }
        this.book=Object.assign({},this.current)
    },

    //レビュー情報がある場合はフォームに表示
    mounted(){
        let b = this.getBookById(this.book.id)

        if(b){
            this.form.read = b.read
            this.form.memo = b.memo
            this.book.read = b.read
            this.book.memo = b.memo
        }

        if(this.$store.state.posts.uid == this.$store.state.login_user.uid) {
            this.form.read = this.$store.state.posts.read
            this.form.memo = this.$store.state.posts.memo
        }
    },

    methods:{
        ...mapActions(['updateBook','updateCurrent','addBook','updateBooks','deleteBook']),

        submit(){            
            // let id = this.book.id
            // let current = this.$store.state.books.filter(function(value){
            //     return value == id
            // })                        
            
            if(this.book.memo){
                let id = this.book.id                
                this.$refs['form'].validate((valid)=>{
                    if(valid){
                        //更新
                        console.log('更新')
                        this.updateBooks({
                            id:id,
                            book:Object.assign({},this.book,this.form)
                        })

                        this.$notify({
                            title: 'Book Recorder',
                            message: this.$createElement('p', {style:'color: #009'},'読書情報の登録/更新に成功しました。'),
                            duration: 2000
                        })

                        this.form.read = new Date()
                        this.form.memo = ''

                        this.$router.push('/')
                    }else {
                        this.$notify({
                            title: 'BookRecorder',
                            message: this.$createElement('p', {style:'color: #009'}, '読書情報の登録/更新に失敗しました。'),
                            duration: 2000
                        })
                    }
                
                })
            }else {
                //入力値の検証
                this.$refs['form'].validate((valid)=>{
                    if(valid){
                    // this.updateBook(
                    //     Object.assign({},this.book,this.form)
                    // )
                    //登録
                    console.log('登録')
                    this.user.name = this.userName
                    this.user.uid = this.uid
                    this.addBook(Object.assign({},this.book,this.form,this.user))
                    this.updateCurrent(null)        
                
                    this.$notify({
                        title: 'Book Recorder',
                        message: this.$createElement('p', {style:'color: #009'},'読書情報の登録/更新に成功しました。'),
                        duration: 2000
                    })

                    this.form.read = new Date()
                    this.form.memo = ''

                    this.$router.push('/')                  
                }else {
                    this.$notify({
                        title: 'BookRecorder',
                        message: this.$createElement('p', {style:'color: #009'}, '読書情報の登録/更新に失敗しました。'),
                        duration: 2000
                    })
                }

                
            })
            }
        },

        deleteBooks() {  
            if(window.confirm("削除してよろしいですか？")){
                let id = this.book.id          
                this.deleteBook(id)
                this.$notify({
                        title: 'BookRecorder',
                        message: this.$createElement('p', {style:'color: #009'}, '読書情報の削除に成功しました。'),
                        duration: 2000
                })
                this.$router.push('/')
            }
        },
        
        back() {
            this.$router.back()
        }
    },
}
</script>

<style>
    .button {
        text-align: center;
    }
    .memo {
        /* border: 2px solid green;
        border-radius: 10px;
        width: 500px;
        height: 100px; */
        padding: 0.2em 0.5em;
        margin: 2em 0;
        background: #fff9d6;
        box-shadow: 0px 0px 0px 10px #fff9d6;
        border: dashed 2px white;
        width: 700px;
    }
    .postName {
        font-weight: bold;
        background: linear-gradient(transparent 75%, #ffb5ad 75%);
        display: inline-block;
    }
    ul {
        list-style: none;
    }
</style>