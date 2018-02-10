import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BaseWarpper from '@/components/BaseWarpper'
import AdminIndex from '@/components/AdminIndex'
import Launch from '@/components/Launch'
import Banner from '@/components/Banner'
import News from '@/components/News'
import TopNews from '@/components/TopNews'
import DeletedNews from '@/components/DeletedNews'
import NewsAdd from '@/components/NewsAdd'
import NewsDetail from '@/components/NewsDetail'
import User from '@/components/User'
import Reseller from '@/components/Reseller'
import Product from '@/components/Product'
import AboutUs from '@/components/AboutUs'
import AboutBali from '@/components/AboutBali'
import TermOfService from '@/components/TermOfService'
import PrivacyPolicy from '@/components/PrivacyPolicy'

import UserIndex from '@/components/UserIndex'
import Goods from '@/components/Goods'
import OffTheShelf from '@/components/OffTheShelf'
import BeBanned from '@/components/BeBanned'
import GoodsDetails from '@/components/GoodsDetails'

import ResourceNotFound from '@/components/ResourceNotFound'
import UserDetails from '@/components/UserDetails'
import ResellerDetails from '@/components/ResellerDetails'
import ProductDetails from '@/components/ProductDetails'
import ResellerAdd from '@/components/ResellerAdd'
import Recommend from '@/components/Recommend'
import RecommendDetails from '@/components/RecommendDetails'
import Forbidden from '@/components/Forbidden'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      redirect: '/a'
    },
    {
      path: '/a',
      component: BaseWarpper,
      // name: 'BaseWarpper',
      children: [
        // 超管路由
        {
          path: '',
          name: 'AdminIndex',
          component: AdminIndex
        },
        {
          path: '/launch',
          name: 'Launch',
          component: Launch
        },
        {
          path: '/banner',
          name: 'Banner',
          component: Banner
        },
        {
          path: '/news',
          name: 'News',
          component: News
        },
        {
          path: '/top-news',
          name: 'TopNews',
          component: TopNews
        },
        {
          path: '/deleted-news',
          name: 'DeletedNews',
          component: DeletedNews
        },
        {
          path: '/news/add',
          name: 'NewsAdd',
          component: NewsAdd
        },
        {
          path: '/news/detail/:id',
          name: 'NewsDetail',
          component: NewsDetail
        },
        {
          path: '/user',
          name: 'User',
          component: User
        },
        {
          path: '/user/detail/:id',
          name: 'UserDetails',
          component: UserDetails
        },
        {
          path: '/reseller',
          name: 'Reseller',
          component: Reseller
        },
        {
          path: '/reseller/detail/:id',
          name: 'ResellerDetails',
          component: ResellerDetails
        },
        {
          path: '/reseller/add',
          name: 'ResellerAdd',
          component: ResellerAdd
        },
        {
          path: '/product',
          name: 'Product',
          component: Product
        },
        {
          path: '/recommend',
          name: 'Recommend',
          component: Recommend
        },
        {
          path: '/forbidden',
          name: 'Forbidden',
          component: Forbidden
        },
        {
          path: '/recommend/detail/:id',
          name: 'RecommendDetails',
          component: RecommendDetails
        },
        {
          path: '/product/detail/:id',
          name: 'ProductDetails',
          component: ProductDetails
        },
        {
          path: '/about-us',
          name: 'AboutUs',
          component: AboutUs
        },
        {
          path: '/about-bali',
          name: 'AboutBali',
          component: AboutBali
        },
        {
          path: '/tos',
          name: 'TermOfService',
          component: TermOfService
        },
        {
          path: '/privacy-policy',
          name: 'PrivacyPolicy',
          component: PrivacyPolicy
        },
        // 经销商路由
        {
          path: '/b',
          name: 'UserIndex',
          component: UserIndex
        },
        {
          path: '/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/off-the-shelf',
          name: 'OffTheShelf',
          component: OffTheShelf
        },
        {
          path: '/be-banned',
          name: 'BeBanned',
          component: BeBanned
        },
        {
          path: '/goods/details/:id',
          name: 'GoodsDetails',
          component: GoodsDetails
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
