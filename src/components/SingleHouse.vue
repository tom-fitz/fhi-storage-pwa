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
                              :src= "x.pictureInfo"
                              contain
                            ></v-img>
                          </v-flex>
                          <p><strong>Store: </strong>{{ a.purchasedFrom }}<br />
                          <strong>Date Purchased: </strong>{{ a.datePurchased }}<br />
                          <strong>Cost: </strong>${{ a.cost }}<br />
                          <strong>Turns: </strong>{{ a.turns }}<br /></p>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn flat color="orange" @click="updateFurniture(a)">Send Back to Warehouse</v-btn>
                      </v-card-actions>
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
            <!-- Start snackbar -->
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
            <!-- End snackbar -->
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
      menu2: false,
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: ''
    }
  },
  computed: {
    computedContractDate () {
      return this.newContractDate ? moment(this.newContractDate).format('MM/DD/YYYY') : ''
    },
    computedSoldDate () {
      return this.newSoldDate ? moment(this.newSoldDate).format('MM/DD/YYYY') : ''
    }
  },
  created(){
    let vm = this
    vm.getHouseByHouseId(this.houseId)
  },
  methods: {
    getHouseByHouseId(houseId){
        //   // Fetch single house by house id
      let houseIdUrl = 'https://fhistorage-api.azurewebsites.net/api/houses/' + this.houseId
      fetch(houseIdUrl)
      .then(response => {
        if(response.ok) {
          return response.json()
        }
      })
      .then(house => {
        house.forEach(h => {
          h.contractDate = moment(h.contractDate).format('MM/DD/YYYY')
          if(h.dateSold = '0001-01-01'){
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
          e.datePurchased = moment(e.datePurchased).format('MM/DD/YYYY')
        })
        return this.assocFurniture = furniture
      })
    },
    deleteHouse (houseId) {
      (async () => {
        const deleteUrl = this.url + '/' + houseId
        const response = await fetch(this.url + '/' + houseId, {
          method: 'DELETE'
        })
        .then(res => {

        })
        .catch(err => {
          this.snackbar = true
          this.snackbarColor = 'danger'
          this.snackbarText = 'House Deletion Failed'
          console.log("error in deletion", err)
        })
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Deleted'
        this.$router.push('/')
      })();
    },
    editHouse (house) {
      this.newAddressInput = house.address
      this.newZipInput = house.zipcode
      this.newCostInput = house.cost
      this.newSoldFlag = house.sold
      this.newContractDate = house.contractDate
      this.newSoldDate = house.dateSold
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
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Updated'
        this.dialog = false
        this.getHouseByHouseId(this.houseId)
      })();
    },
    updateFurniture(furn){
      (async () => {
        const response = await fetch('https://fhistorage-api.azurewebsites.net/api/furniture/'+ furn.furnitureId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "furnitureId": furn.furnitureId,
            "name": furn.name,
            "uid": furn.uid,
            "categoryId": furn.categoryId,
            "cost": furn.cost,
            "purchasedFrom": furn.purchasedFrom,
            "datePurchased": furn.datePurchased,
            "houseId": 1,
            "turns": furn.turns + 1,
            "furnitureImages": furn.furnitureImages,
            "furnitureImageId": furn.furnitureImageId,
            "house": {
                "houseId": 1,
                "address": "TEST House",
                "zipcode": 10101,
                "cost": 15000.00,
                "contractDate": "2019-07-01T00:00:00",
                "dateSold": "2019-07-16T00:00:00",
                "sold": false
            }
          })
        });
        const data = await response
        //await this.$nextTick()
        console.log("sent back to warehouse!", data)
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Updated'
        this.dialog = false
        this.$router.push(`/houses/${furn.houseId}`)
      })();
    }
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
