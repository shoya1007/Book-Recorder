<template>
    <div class="list">
        <p>みんなの投稿を閲覧できます</p>
        <BookInfo v-for="(b,i) of books" :linable="true" :book="b" :index="i+1" :key="b.id"></BookInfo>
    </div>
</template>

<script>
import BookInfo from '../components/Bookinfo.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'Others',
    data() {
        return {
            books: []
        }
    },
    components: {
        BookInfo
    },
    computed: {
        ...mapGetters(['allOthersBooks'])
    },
    mounted() {
        this.books = this.allOthersBooks
    }
}
</script>