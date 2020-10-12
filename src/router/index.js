import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import BookSearch from '../components/BookSearch.vue'
import Bookform from '../components/Bookform.vue'
import Login from '../components/Login.vue'
import Others from '../components/Others.vue'
// import firebase from 'firebase'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    name: 'search',
    component: BookSearch
  },
  {
    path: '/form',
    name: 'form',
    component: Bookform,
    meta: { requiresAuth: true }
  },
  {
    path: '/others',
    name: 'others',
    component: Others
  },
  //未登録のパスへのアクセスがあった場合は、トップページへリダイレクト
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach(async(to, from, next) => {
//   const requiresAuth = to.matched.some(recode => recode.meta.requiresAuth);
//   if (requiresAuth && !(await firebase.getCurrentUser())) {
//     next({ path: "/login", query: { redirect: to.fullPath } });
//   } else {
//     next();
//   }
// });

export default router
