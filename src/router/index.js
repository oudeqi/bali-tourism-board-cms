import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BaseWarpper from '@/components/BaseWarpper'
import AdminIndex from '@/components/AdminIndex'
import Launch from '@/components/Launch'
import LaunchAdd from '@/components/LaunchAdd'
import BannerList from '@/components/BannerList'
import BannerAdd from '@/components/BannerAdd'
import BannerActive from '@/components/BannerActive'
import BannerDetails from '@/components/BannerDetails.vue'

import NewsList from '@/components/NewsList'
import TopNews from '@/components/TopNews'
import DeletedNews from '@/components/DeletedNews'
import NewsAdd from '@/components/NewsAdd'
import NewsDetail from '@/components/NewsDetail'
import User from '@/components/User'
import Reseller from '@/components/Reseller'
import ProductList from '@/components/ProductList'
import AboutUs from '@/components/AboutUs'
import AboutBali from '@/components/AboutBali'
import AboutBaliAdd from '@/components/AboutBaliAdd'
import AboutBaliDetails from '@/components/AboutBaliDetails'
import TermOfService from '@/components/TermOfService'
import PrivacyPolicy from '@/components/PrivacyPolicy'

import ResellerInfo from '@/components/ResellerInfo'

import UserIndex from '@/components/UserIndex'
import Goods from '@/components/Goods'
import OffTheShelf from '@/components/OffTheShelf'
import BeTopped from '@/components/BeTopped'
import BeBanned from '@/components/BeBanned'
import GoodsDetails from '@/components/GoodsDetails'
import GoodsAdd from '@/components/GoodsAdd'

import ResourceNotFound from '@/components/ResourceNotFound'
import UserDetails from '@/components/UserDetails'
import ResellerDetails from '@/components/ResellerDetails'
import ProductDetails from '@/components/ProductDetails'
import ResellerAdd from '@/components/ResellerAdd'
import RecommendProduct from '@/components/RecommendProduct'
import ForbiddenProduct from '@/components/ForbiddenProduct'
import Qs from 'qs'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      component: BaseWarpper,
      children: [
        // 超管路由
        {
          path: 'admin',
          name: 'AdminIndex',
          component: AdminIndex,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'launch',
          name: 'Launch',
          component: Launch,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'launch/add',
          name: 'LaunchAdd',
          component: LaunchAdd,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'banner/add',
          name: 'BannerAdd',
          component: BannerAdd,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'banner/list',
          name: 'BannerList',
          component: BannerList,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'banner/active',
          name: 'BannerActive',
          component: BannerActive,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'banner/details/:id',
          name: 'BannerDetails',
          component: BannerDetails,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'news/list',
          name: 'NewsList',
          component: NewsList,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'news/top',
          name: 'TopNews',
          component: TopNews,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'news/deleted',
          name: 'DeletedNews',
          component: DeletedNews,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'news/add',
          name: 'NewsAdd',
          component: NewsAdd,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'news/detail/:id',
          name: 'NewsDetail',
          component: NewsDetail,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'user',
          name: 'User',
          component: User,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'user/detail/:id',
          name: 'UserDetails',
          component: UserDetails,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'reseller',
          name: 'Reseller',
          component: Reseller,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'reseller/detail/:id',
          name: 'ResellerDetails',
          component: ResellerDetails,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'reseller/add',
          name: 'ResellerAdd',
          component: ResellerAdd,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'product/list',
          name: 'ProductList',
          component: ProductList,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'product/recommend',
          name: 'RecommendProduct',
          component: RecommendProduct,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'product/forbidden',
          name: 'ForbiddenProduct',
          component: ForbiddenProduct,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'product/detail/:id',
          name: 'ProductDetails',
          component: ProductDetails,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'about-us',
          name: 'AboutUs',
          component: AboutUs,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'about-bali',
          name: 'AboutBali',
          component: AboutBali,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'about-bali/add',
          name: 'AboutBaliAdd',
          component: AboutBaliAdd,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'about-bali/details/:id',
          name: 'AboutBaliDetails',
          component: AboutBaliDetails,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'tos',
          name: 'TermOfService',
          component: TermOfService,
          meta: {
            role: 'admin'
          }
        },
        {
          path: 'privacy-policy',
          name: 'PrivacyPolicy',
          component: PrivacyPolicy,
          meta: {
            role: 'admin'
          }
        },
        // 经销商路由
        {
          path: 'busi',
          name: 'UserIndex',
          component: UserIndex,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'reseller-info',
          name: 'ResellerInfo',
          component: ResellerInfo,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'goods/list',
          name: 'Goods',
          component: Goods,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'goods/off-the-shelf',
          name: 'OffTheShelf',
          component: OffTheShelf,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'goods/top',
          name: 'BeTopped',
          component: BeTopped,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'goods/be-banned',
          name: 'BeBanned',
          component: BeBanned,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'goods/add',
          name: 'GoodsAdd',
          component: GoodsAdd,
          meta: {
            role: 'user'
          }
        },
        {
          path: 'goods/details/:id',
          name: 'GoodsDetails',
          component: GoodsDetails,
          meta: {
            role: 'user'
          }
        },
        {
          path: '*',
          name: 'ResourceNotFound',
          component: ResourceNotFound
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next()
  } else {
    const userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
    if (userInfo) {
      if (to.meta && to.meta.role === userInfo.type) {
        next()
      } else {
        router.push({name: 'Login'})
      }
    } else {
      next()
    }
  }
})
export default router
