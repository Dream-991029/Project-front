import Vue from 'vue'
import VueRouter from 'vue-router'
import Company from 'views/home/home-child/system-child/Company'
import User from 'views/home/home-child/system-child/User'
import Dept from 'views/home/home-child/system-child/Dept'
import Menu from 'views/home/home-child/system-child/Menu'

// 懒加载方式导入组件
const Login = () => import('views/user/Login')
const Register = () => import('views/user/Register')
const Home = () => import('views/home/Home')
const System = () => import('views/home/home-child/System')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/home/system'
      },
      {
        path: 'system',
        component: System
      },
      {
        path: 'company',
        component: Company
      },
      {
        path: 'user',
        component: User
      },
      {
        path: 'dept',
        component: Dept
      },
      {
        path: 'menu',
        component: Menu
      }
    ]
  }
]

// 实例化vueRouter对象
const router = new VueRouter({
  routes,
  mode: 'history'
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (token === null || token === '') {
      next('/login')
    } else {
      next()
    }
  }
})

// 导出router对象
export default router
