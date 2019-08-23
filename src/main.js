import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Houses from './components/Houses'
import Furniture from './components/Furniture'
import SingleHouse from './components/SingleHouse'
import FurnitureCategoryList from './components/FurnitureCategoryList'
import FurnitureEdit from './components/FurnitureEdit'
import moment from '../node_modules/moment'

Vue.config.productionTip = false

Vue.prototype.moment = moment

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'houses', component: Houses},
  {path: '/houses/:id', name: 'singleHouse', component: SingleHouse},
  {path: '/furniture', name: 'furniture', component: Furniture},
  {path: '/furniture/category/:id/:name', name: 'furnitureCategoryList', component: FurnitureCategoryList},
  {path: '/furniture/:furnitureId', name: 'furnitureEdit', component: FurnitureEdit}
]

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
