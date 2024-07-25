import Vue from 'vue'
import VueRouter from 'vue-router'
import 'nprogress/nprogress.css'

Vue.use(VueRouter)

const routes = [
  {
    path: '/404',
    name: 'notPage',
    component: () => import('../views/404.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginRegister.vue'),
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component:  () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/resetpassword',
    name: 'ResetPassword',
    component:  () => import('../views/ResetPassword.vue')
  },
  {
    path: '/',
    redirect: '/home',
    name: '',
    component: () => import('../views/ViewPage.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: "舆情概览",
          auth: true
        }
      }, 
      {
        path: '/consensus',
        name: 'consensus',
        component: () => import('../views/Consensus.vue'),
        meta: {
          title: "话题列表",
          auth: true
        },
      }, 
      {
        path: '/consensus/detail',
        name: 'consensusDetail',
        component: () => import('../views/ConsensusDetail.vue'),
        meta: {
          title: "话题分析",
          auth: true
        }
      },
      {
        path: '/keyword',
        name: 'keyword',
        component: () => import('../views/KeyWordSearch.vue'),
        meta: {
          title: "搜索分析",
          auth: true
        }
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('../views/Article.vue'),
        meta: {
          title: "博文列表",
          auth: true
        }
      },
      {
        path: '/warning',
        name: 'warning',
        component: () => import('../views/WarningList.vue'),
        meta: {
          title: "预警任务",
          auth: true
        }
      },
      {
        path: '/searchanalysis',
        name: 'searchanalysis',
        component: () => import('../views/SearchAnalysis.vue'),
      },
    ],
  },
  // 所有未定义路由，全部重定向到404页
  {
    path: '*',
    redirect: '/404'
  }]
const router = new VueRouter({
  routes,
  mode: 'history', //default: hash ,history
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})

//路由守卫
router.beforeEach((to, from, next)=>{
  //如果访问的是登录、忘记密码、重置页面，则放行
  if(to.path === '/login' || to.path === '/forgotpassword' || to.path === '/404' || to.path === '/resetpassword')
    return next()
  let token = localStorage.getItem('msToken')
  if(!token) {
    return next("/login")
  }
  next()
})
export default router