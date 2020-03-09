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
                      v-model="addressInput"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                      label="Zipcode"
                      v-model="zipInput"
                      type="number"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field 
                      label="Cost"
                      v-model="costInput"
                      type="number" 
                      hint="ex: 122.75"
                    ></v-text-field>
                  </v-flex>
                  <!-- contract date picker -->
                  <v-flex xs12 lg6>
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      full-width
                      max-width="290"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="computedContractDate"
                          clearable
                          label="Contracted Date"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="contractedDate"
                        @change="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <!-- end contract date picker -->
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="postNewHouse()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    <!-- End add new house modal -->
    <!-- Start new house snackbar -->
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :timeout="timeout"
      >
        {{ snackbarText }}
        <v-btn
          dark
          flat
          @click="snackbar = false"
        >
          <v-icon>
            close
          </v-icon>
        </v-btn>
      </v-snackbar>
    <!-- End new house snackbar -->
    
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row v-for="h in houses" :key="h.id">
        <v-flex>
          <v-card light @click="getHouseById(h.id)" :class="{ 'displayNone': h.sold == 1 }">
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
var moment = require('moment')
export default {
  name: 'houses',
  houses: [],
  data () {
    return {
      houses: [],
      soldhouses: [],
      url: 'https://fhistorage-api.azurewebsites.net/api/houses',
      dialog: false,
      sold: false,
      addressInput: '',
      zipInput: '',
      costInput: '',
      contractedDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      contractedDays: '',
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: ''
    }
  },
  computed: {
    computedContractDate () {
      return this.contractedDate ? moment(this.contractedDate).format('MM/DD/YYYY') : ''
    }
  },
  created () {
    this.getHouses()

    // this.$watch(this.houses, (n,o) => {
    //   console.log("new", n)
    //   console.log("old", o)
    // })
    //let url = 'https://fhistorage-api.azurewebsites.net/api/houses'
    
  },
  methods: {
    getHouses(){
      fetch(this.url)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        // data.forEach(e => {
        //   this.calculateContractedDays(e.contractDate)
        // });
        // let filtered = data.filter(function(x){
        //   if(x.sold == false){
        //     return vm.houses = x
        //   }else if(x.sold == true){
        //     return vm.soldHouses =  x
        //   }
        // })
        data.forEach((e, i) => {
          if(e.id == 1){
            data.splice(e, 1)
          }
        })
        return this.houses = data
      })
    },
    getHouseById(houseId){
      this.$router.push({name: 'singleHouse', params: { id: houseId }})
    },
    calculateContractedDays(cDate) {
      cDate = moment(cDate).format('MM/DD/YYYY')
      let now = moment().format('MM/DD/YYYY')
      let sixtyDays = moment().subtract(60, 'days').format('MM/DD/YYYY')

      let dateString = now + ' ' + cDate + ' ' + sixtyDays
      console.log("cdate string", dateString)

      if(moment(cDate) < moment(now) && moment(cDate) > moment(sixtyDays)){
        this.contractedDays = 'contractedDaysRed'
      }else if (moment(cDate) < moment(now) && moment(cDate) < moment(sixtyDays)){
        this.contractedDays = 'contractedDaysGreen'
      }

      // if(moment(cDate, 'MM/DD/YYYY').isBetween(moment(now, 'MM/DD/YYYY'), moment(sixtyDays, 'MM/DD/YYYY'))){
      //   // let something = moment(moment(cDate, 'MM/DD/YYYY').isBetween(moment(now, 'MM/DD/YYYY'), moment(sixtyDays, 'MM/DD/YYYY')))
      //   // console.log("wiogbwie", something)
      //   this.contractedDays = 'contractedDaysRed'
      // }else{
      //   this.contractedDays = 'contractedDaysGreen'
      // }

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
    postNewHouse () {
      if(!this.sold){
        this.sDate = '0001-01-01'
      }

      //console.log("contracted date", this.contractedDate)
      // let newHouse = {
      //   "address" : this.addressInput,
      //   "zipcode" : +this.zipInput,
      //   "costInput" : +this.costInput,
      //   "contractDate" : this.cDate,
      //   "dateSold" : this.sDate,
      //   "sold" : this.sold
      // }

      (async () => {
        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "address" : this.addressInput,
            "zipcode" : +this.zipInput,
            "cost" : +this.costInput,
            "contractDate" : this.contractedDate,
            "dateSold" : this.sDate,
            "sold" : this.sold
          })
        });
        const data = await response.json()
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Created Successfully'
        this.dialog = false
        this.getHouses()
      })();
    }
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
.contractedDaysRed {
  border-left: solid 4px red !important;
}
.contractedDaysGreen {
  border-left: solid 4px green !important;
}
.displayNone {
  display: none
}
</style>
