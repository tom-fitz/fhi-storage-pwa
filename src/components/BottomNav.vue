<template>
  <v-card flat>
    <!-- <div class="headline text-xs-center pa-5">
      Active: {{ bottomNav }}
    </div> -->

    <v-bottom-nav app
      :active.sync="bottomNav"
      :value="true"
      fixed
      color="white"
    >

        

        <v-btn
            color="#71eeb8"
            flat
            value="Houses"
            to="/"
        >
            <span>Houses</span>
            <v-icon>home</v-icon>
        </v-btn>
    

     
        <v-btn
            color="#71eeb8"
            flat
            value="Furniture"
            to="/furniture"
        >
            <span>Furniture</span>
            <v-icon>kitchen</v-icon>
        </v-btn>
     

    </v-bottom-nav>
  </v-card>
</template>

<script>
  export default {
      name: 'bottomNav',
    data () {
      return {
        bottomNav: 'recent'
      }
    }
  }
</script>