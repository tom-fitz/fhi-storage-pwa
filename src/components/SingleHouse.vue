<template>
  <div class="singleHouse">
    
    <v-container grid-list-md text-xs-center fluid>
      <v-layout row v-for="h in singleHouse" :key="h.id">
        <v-flex>
          <v-card light>
            <v-card-title primary-title>
              <h2>{{ h.address }}</h2>
            </v-card-title>
            <v-card-text left>
                <p><strong>Contract Date: </strong>{{ h.contractDate }}<br />
                <strong>Cost of Home: </strong>${{ h.cost }}<br />
                <strong>Zipcode: </strong>{{ h.zipcode }}</p>
            </v-card-text>
          </v-card>
          <!-- Assoc. Furntiure card -->
          <v-card light>
              <template>
                <v-expansion-panel>
                  <v-expansion-panel-content
                  v-for="(a,i) in assocFurniture"
                  :key="i"
                  >
                  <template v-slot:header>
                      <h3>{{ a.name }} | {{ a.uid }}</h3>
                  </template>
                  <v-card>
                      <v-card-text>
                          <v-flex v-for="(x,i) in a.furnitureImages" :key="i">
                            <v-img
                              :src= "x.src"
                              contain
                            ></v-img>
                          </v-flex>
                          <p><strong>Store: </strong>{{ a.purchasedFrom }}<br />
                          <strong>Date Purchased: </strong>{{ a.datePurchased }}<br />
                          <strong>Cost: </strong>${{ a.cost }}<br />
                          <strong>Turns: </strong>{{ a.turns }}<br /></p>
                      </v-card-text>
                  </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
          </v-card>
          <v-card>
            <!-- Modal for editing a new house -->
            <v-layout row justify-center>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn  v-on="on"
                          color="blue darken-1" 
                          flat
                          @click="editHouse(h)">
                      Edit
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
                            v-model="newAddressInput"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field
                            label="Zipcode"
                            v-model="newZipInput"
                            type="number"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-text-field 
                            label="Cost"
                            v-model="newCostInput"
                            type="number" 
                            hint="ex: 122.75"
                          ></v-text-field>
                        </v-flex>
                        <!-- contracted date picker -->
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
                                label="Contract Date"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="newContractDate"
                              @change="menu1 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-flex>
                        <!-- end contracted date picker -->
                        <v-flex xs12>
                          <v-checkbox
                            v-model="sold"
                            label="Sold"
                            input-value="false"
                          ></v-checkbox>
                        </v-flex>
                        <!-- sold date picker -->
                        <v-flex v-if="sold" xs12 lg6>
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            full-width
                            max-width="290"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                :value="computedSoldDate"
                                clearable
                                label="Sold Date"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="newSoldDate"
                              @change="menu2 = false"
                            ></v-date-picker>
                          </v-menu>
                        </v-flex>
                        <!-- <v-flex v-if="sold" xs12>
                          <v-menu
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            lazy
                            transition="scale-transition"
                            offset-y
                            full-width
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="newSoldDate"
                                label="Date Sold"
                                prepend-icon="event"
                                @blur="newSoldDate = parseDate(newsoldDate)"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="newSoldDate" @input="menu2 = false"></v-date-picker>
                          </v-menu>
                        </v-flex> -->
                        <!-- end sold date picker -->
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" flat @click="postNewHouse()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>
          <!-- End edit house modal -->
            <v-btn color="blue darken-1" flat @click="deleteHouse(h.id)">Delete</v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
var moment = require('moment')
export default {
  name: 'singleHouse',
  data () {
    return {
      singleHouse: [],
      assocFurniture: [],
      url: 'https://fhistorage-api.azurewebsites.net/api/houses',
      houseId: this.$route.params.id,
      dialog: false,
      newAddressInput: '',
      newZipInput: '',
      newCostInput: '',
      newSoldFlag: false,
      newContractDate: new Date().toISOString().substr(0, 10),
      newSoldDate: new Date().toISOString().substr(0, 10),
      sold: false,
      menu1: false,
      menu2: false
    }
  },
  computed: {
    computedContractDate () {
      return this.newContractDate ? moment(this.newContractDate).format('MM/DD/YYYY') : ''
    },
    computedSoldDate () {
      return this.newSoldDate ? moment(this.newSoldDate).format('MM/DD/YYYY') : ''
    }
    // computedDateFormattedMomentjs () {
    //   return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
    // },
    // computedDateFormattedDatefns () {
    //   return this.date ? format(this.date, 'dddd, MMMM Do YYYY') : ''
    // }
  },
  created () {
    // Fetch single house by house id
    let houseIdUrl = 'https://fhistorage-api.azurewebsites.net/api/houses/' + this.houseId
      fetch(houseIdUrl)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
        })
        .then(house => {
          house.forEach(h => {
            // let conDate = new Date(h.contractDate)
            // h.contractDate = Date.parse(conDate)
            h.contractDate = moment(h.contractDate).format('MM/DD/YYYY')
            if(h.dateSold = '0001-01-01'){
              //h.soldDate = moment().format('MM/DD/YYYY')
              h.dateSold = moment().format('MM/DD/YYYY')
            }
          })
          return this.singleHouse = house
        })
    // Fetch Furniture By House Id
    let furnitureByHouseIdUrl = 'https://fhistorage-api.azurewebsites.net/api/houses/' + this.houseId + '/furniture'
      fetch(furnitureByHouseIdUrl)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
        })
        .then(furniture => {
          furniture.forEach(e => {
            if(e.furnitureImages.length > 0){
                this.getImageByImageId(e.furnitureImageId)
            }
          })
          return this.assocFurniture = furniture
        })
  },
  methods: {
    getImageByImageId (imageId) {
        let imageUrl = 'https://fhistorage-api.azurewebsites.net/api/image/' + imageId
        fetch(imageUrl)
          .then(response => {
              if(response.ok){
                  return response.json()
              }
          })
          .then(image => {
            this.assocFurniture.forEach(e => {
              if(e.furnitureImages.length > 0){
                e.furnitureImages.push(image)
              }
            })
          })
    },
    deleteHouse (houseId) {
      (async () => {
        const deleteUrl = this.url + '/' + houseId
        console.log("delete url", deleteUrl)
        const response = await fetch(this.url + '/' + houseId, {
          method: 'DELETE'
        })
        .then(res => {
          console.log("response", res)
          if(res.ok){
            return res.json()
          }
        })
        .catch(err => {
          console.log("error in deletion", err)
        })
        //const data = await response.json()
        //console.log("house deleted", data)
        this.$router.push('/')
      })();
    },
    editHouse (house) {
      this.newAddressInput = house.address
      this.newZipInput = house.zipcode
      this.newCostInput = house.cost
      this.newSoldFlag = house.sold
      this.newContractDate = house.contractDate //this.formatDate(house.contractDate)
      this.newSoldDate = house.dateSold //this.formatDate(new Date().toISOString().substr(0, 10))
    },
    postNewHouse(){
      (async () => {
        const response = await fetch('https://fhistorage-api.azurewebsites.net/api/houses/'+ this.houseId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "houseId" : this.houseId,
            "address" : this.newAddressInput,
            "zipcode" : +this.newZipInput,
            "cost" : +this.newCostInput,
            "contractDate" : this.newContractDate,
            "dateSold" : this.newSoldDate,
            "sold" : this.sold
          })
        });
        const data = await response.json()

        console.log("edited a house!", data)
        this.dialog = false
        this.$router.push({name: 'houses'})
      })();
    }
    // regexDate (oldDate) {
    //   let ex = /[^A-Z]*/g
    //   let newDate = oldDate.match(ex)
    //   return this.formatDate(newDate[0])
    // },
    // formatDate (date) {
    //   if (!date) return null

    //   const [year, month, day] = date.split('/')
    //   return `${month}/${day}/${year}`
    // },
    // parseDate (date) {
    //   if (!date) return null
    //   const [month, day, year] = date.split('/')
    //   return this.date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
p {
    text-align: left;
}
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
