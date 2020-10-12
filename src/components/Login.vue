<template>
    <div id="form">
        <el-card class="box-card login">
            <div slot="header" class="header">
                <span class="heading">お持ちのGoogleアカウントでログインすることができます</span>
            </div>

            <el-form class="form">
                <el-button type="success" class="button" @click="googleLogin">Googleアカウントでログイン</el-button><br>                
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    methods: {
        ...mapActions(['googleLogin'])
    }
}
</script>
<style>
    .box-card {
        width: 480px
    }

    .login {
        position: relative;
        top: 100px;
        margin: auto;
    }

    .header {
        text-align: center;
    }

    .form {
        text-align: center;
    }

    .button {
        margin-top: 20px;        
        margin-left: 100px;
    }
</style>