<template>
  <v-app>
    <v-content>
      <!-- <Houses /> -->
      <router-view></router-view>
    </v-content>
    <v-content>
      <bottomNav></bottomNav>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Houses from './components/Houses'
import Furniture from './components/Furniture'
import BottomNav from './components/BottomNav'
import SingleHouse from './components/SingleHouse'
import FurnitureCategoryList from './components/FurnitureCategoryList'
import HouseEdit from './components/HouseEdit'
import FurnitureEdit from './components/FurnitureEdit'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Houses,
    Furniture,
    BottomNav,
    SingleHouse,
    FurnitureCategoryList,
    HouseEdit,
    FurnitureEdit
  },
  data () {
    return {
      //
    }
  }
}
</script>
