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
import HouseEdit from './components/HouseEdit'
import BulkFurnitureUpload from './components/BulkFurnitureUpload'
import moment from '../node_modules/moment'
import './registerServiceWorker'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$http = axios

Vue.prototype.moment = moment

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'houses', component: Houses},
  {path: '/houses/:id', name: 'singleHouse', component: SingleHouse},
  {path: '/furniture', name: 'furniture', component: Furniture},
  {path: '/furniture/category/:id/:name', name: 'furnitureCategoryList', component: FurnitureCategoryList},
  {path: '/furniture/:furnitureId', name: 'furnitureEdit', component: FurnitureEdit},
  {path: '/house/edit/:id', name: 'houseEdit', component: HouseEdit},
  {path: '/furniture/bulkUpload/:id', name: 'bulkFurnitureUpload', component: BulkFurnitureUpload}
]

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
