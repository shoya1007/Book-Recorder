<template>
    <div class="" :class="{linkable}" @click="onclick">
        <span class="image">
            <img :src="book.image">
        </span>
        <span class="detail" style="display: inline-block;_display: inline;">
            <ul>
                <!-- <li v-if="index">{{index}}</li> -->
                <li v-if="book.uid&&book.uid!=$store.state.login_user.uid" class="userName">{{book.name}}さんの投稿</li>
                <hr v-if="book.uid&&book.uid!=$store.state.login_user.uid">
                <input type="hidden" :value="book.id">
                <li>{{book.title}}({{book.price}}円)</li>
                <li>{{book.author}} 著</li>
                <li>{{book.publisher}} 刊</li>
                <li>{{book.published}} 発売</li>
            </ul>
        </span>        
        <ul class="post" v-if="book.uid&&book.uid!=$store.state.login_user.uid">                
            <li class="memo">{{book.memo}}</li>
        </ul>        
        <hr class="hr">
    </div>    
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'book-info',
    props: {
        index: {type: Number},
        linkable: {type: Boolean, default:false},
        book: {type: Object}
    },
    methods: {
        ...mapActions(['updateCurrent','fetchOthersPosts']),
        //クリック後、情報をstateに保存し、フォーム画面に遷移
        onclick(){
            if(this.linkable){
                this.$store.dispatch('updateCurrent',this.book)
                this.$router.push('/form')
            }
            if(this.$store.state.posts) {
                this.$store.state.posts = []
            }
            this.fetchOthersPosts(this.book.id)
        }
    }
}
</script>

<style scoped>
    .linkable:hover{
        cursor:pointer;
        background-color: #ff9;
    }
    ul {
        list-style: none;
    }
    /* .image {
        float: left;
    }
    .detail {
        float: right;
    } */
    .others {
        margin-right: 50px;
    }
    .post {
        display: block;
        padding-right: 50px;
    }
    .userName {
        /* background-color: #ffd04b; */
        font-size: 25px;
        color: orange;
    }
    .memo {
        /* border: 2px solid green;
        border-radius: 10px;
        width: 500px;
        height: 100px;*/
        padding: 0.2em 0.5em;
        margin: 2em 0;
        background: #fff9d6;
        box-shadow: 0px 0px 0px 10px #fff9d6;
        border: dashed 2px white;
    }
    .hr {
        position: relative;
        height: 1px;
        border-width: 0;
        background-color: #00bcd4;
        background-image: -webkit-linear-gradient(left,
        #00bcd4 0%,#283593 50%,#00bcd4 100%);
        background-image:         linear-gradient(90deg,
        #00bcd4 0%,#283593 50%,#00bcd4 100%);
    }
</style>