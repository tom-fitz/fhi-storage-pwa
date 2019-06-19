<template>
  <div class="houses">
      <div class="headline text-xs-center pa-3">
        Houses
      </div>

    <!-- Modal for adding a new house -->
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn  v-on="on"
                    color="#71eeb8"
                    light
                    small
                    fixed
                    top
                    right
                    fab>
              <v-icon light>add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field 
                      label="Address" 
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Zipcode"
                      type="number"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field 
                      label="Cost"
                      type="number" 
                      hint="ex: 122.75"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-menu
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="cDate"
                          label="Contract Start Date"
                          @blur="cDate = parseDate(cDate)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="cDate" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                    <!-- <v-text-field label="Email*" required></v-text-field> -->
                    <v-checkbox
                      v-model="sold"
                      label="Sold"
                      input-value="false"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex v-if="sold" xs12>
                    <v-menu
                      ref="menu2"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="sDate"
                          label="Sold Date"
                          @blur="sDate = parseDate(sDate)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="sDate" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    <!-- End add new house modal -->
    
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row v-for="h in houses" :key="h.id">
        <v-flex>
          <v-card light @click="getHouseById(h.id)">
            <v-card-title primary-title>
              <div>{{ h.address }}</div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
export default {
  name: 'houses',
  houses: [],
  data () {
    return {
      houses: [],
      dialog: false,
      sold: false,
      cDate: new Date().toISOString().substr(0, 10),
      sDate: new Date().toISOString().substr(0, 10),
      contractedDate: this.formatDate(new Date().toISOString().substr(0, 10)),
      soldDate: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false
    }
  },
  created () {
    var vm = this
    let url = 'https://fhistorage-api.azurewebsites.net/api/houses'
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        return vm.houses = data
      })
  },
  methods: {
    getHouseById(houseId){
      this.$router.push({name: 'singleHouse', params: { id: houseId }})
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
} */
</style>
