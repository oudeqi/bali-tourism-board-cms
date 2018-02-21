import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BaseWarpper from '@/components/BaseWarpper'
import AdminIndex from '@/components/AdminIndex'
import Launch from '@/components/Launch'
import BannerList from '@/components/BannerList'
import BannerActive from '@/components/BannerActive'
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
      component: BaseWarpper,
      children: [
        // 超管路由
        {
          path: 'admin',
          name: 'AdminIndex',
          component: AdminIndex
        },
        {
          path: 'launch',
          name: 'Launch',
          component: Launch
        },
        {
          path: 'banner/list',
          name: 'BannerList',
          component: BannerList
        },
        {
          path: 'banner/active',
          name: 'BannerActive',
          component: BannerActive
        },
        {
          path: 'news/list',
          name: 'NewsList',
          component: NewsList
        },
        {
          path: 'news/top',
          name: 'TopNews',
          component: TopNews
        },
        {
          path: 'news/deleted',
          name: 'DeletedNews',
          component: DeletedNews
        },
        {
          path: 'news/add',
          name: 'NewsAdd',
          component: NewsAdd
        },
        {
          path: 'news/detail/:id',
          name: 'NewsDetail',
          component: NewsDetail
        },
        {
          path: 'user',
          name: 'User',
          component: User
        },
        {
          path: 'user/detail/:id',
          name: 'UserDetails',
          component: UserDetails
        },
        {
          path: 'reseller',
          name: 'Reseller',
          component: Reseller
        },
        {
          path: 'reseller/detail/:id',
          name: 'ResellerDetails',
          component: ResellerDetails
        },
        {
          path: 'reseller/add',
          name: 'ResellerAdd',
          component: ResellerAdd
        },
        {
          path: 'product/list',
          name: 'ProductList',
          component: ProductList
        },
        {
          path: 'product/recommend',
          name: 'RecommendProduct',
          component: RecommendProduct
        },
        {
          path: 'product/forbidden',
          name: 'ForbiddenProduct',
          component: ForbiddenProduct
        },
        {
          path: 'product/detail/:id',
          name: 'ProductDetails',
          component: ProductDetails
        },
        {
          path: 'about-us',
          name: 'AboutUs',
          component: AboutUs
        },
        {
          path: 'about-bali',
          name: 'AboutBali',
          component: AboutBali
        },
        {
          path: 'tos',
          name: 'TermOfService',
          component: TermOfService
        },
        {
          path: 'privacy-policy',
          name: 'PrivacyPolicy',
          component: PrivacyPolicy
        },
        // 经销商路由
        {
          path: 'busi',
          name: 'UserIndex',
          component: UserIndex
        },
        {
          path: 'reseller-info',
          name: 'ResellerInfo',
          component: ResellerInfo
        },
        {
          path: 'goods/list',
          name: 'Goods',
          component: Goods
        },
        {
          path: 'goods/off-the-shelf',
          name: 'OffTheShelf',
          component: OffTheShelf
        },
        {
          path: 'goods/top',
          name: 'BeTopped',
          component: BeTopped
        },
        {
          path: 'goods/be-banned',
          name: 'BeBanned',
          component: BeBanned
        },
        {
          path: 'goods/add',
          name: 'GoodsAdd',
          component: GoodsAdd
        },
        {
          path: 'goods/details/:id',
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
