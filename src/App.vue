<template>
  <v-app>
    <v-content>
      <nav class="navbar bg-light sticky-top">
        <div
          class="btn btn-outline-success float-right"
          @click="installer()"
          :style="{'display': installBtn}">
        Install App
        </div>
      </nav>
      <!-- <Houses /> -->
      <!-- <div>
        <v-alert
          v-model="alert"
          dismissible
          color="cyan"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-twitter"
        >
          You've got <strong>5</strong> new updates on your timeline!.
        </v-alert>

        <div class="text-center">
          <v-btn
            v-if="!alert"
            dark
            @click="alert = true"
          >
            Reset Alert
          </v-btn>
        </div>
      </div> -->
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
      // alert: false
      installBtn: "none",
      installer: undefined
    }
  },
  created () {
    let installPrompt
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault()
      installPrompt = e
      this.installBtn = "block"
    })

    this.installer = () => {
      this.installBtn = "none"
      installPrompt.prompt()
      installPrompt.userChoice.then(res => {
        if(result.outcome === "accepted"){
          console.log("User Accepted")
        }else{
          console.log("User Denied")
        }
        installPrompt = null
      })
    }
  }
}
</script>
