<template>
  <div class="furniture">
    <div class="headline text-xs-center pa-3">
        Furniture
        <v-card-text v-model="type" class="noPadding">
          <span class="subHeader">{{ type }}</span>
        </v-card-text>
    </div>
    <v-container grid-list-md text-xs-center>
          <v-card light>
            <template>
              <v-expansion-panel>
                  <v-expansion-panel-content
                  ripple                    
                  v-for="(a,i) in furniture"
                  :key="i"
                  :class="{ 'left-border-yellow': a.houseId != 1 }"
                  >
                  <template v-slot:header>
                    <h3>{{ a.name }} | {{ a.uid }}</h3>
                      
                        <small left :class="{ 'displayHouse': a.houseId == 1 }">{{ a.house.address }}</small>
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
                        <v-layout row justify-center>
                          <v-dialog v-model="dialog" persistent max-width="600px">
                            <template v-slot:activator="{ on }">
                              <v-btn  v-on="on"
                                      color="blue darken-1" 
                                      flat
                                      @click="editFurniture(a)">
                                  Edit
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">Edit Furniture</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container grid-list-md>
                                  <v-layout wrap>
                                    <!-- Camera functionality -->
                                    <!-- <v-flex xs12 sm6 md4>
                                      <div id="uploadImage">
                                        <h2>Select an image</h2>
                                        <input type="file" id="furnImage" accept="image/jpeg" capture v-on:change="onFileChange">
                                      </div>
                                          <v-card flat>
                                            <v-img :src="image" :class="[rotate]" alt="" contain id="camera--output"></v-img>
                                          </v-card>
                                          
                                          <v-card v-if="imgPresent" flat>
                                            <v-btn id="imgRotate" v-on:click="rotateImage()">Rotate Image</v-btn>
                                          </v-card>
                                    </v-flex> -->
                                    <!-- End Camera functionality -->
                                    <v-flex xs12 sm6 md4>
                                      <v-text-field 
                                        v-model="selectedName"
                                        label="Name" 
                                        hint="ex: brown leather couch"
                                        persistent-hint
                                        required 
                                      ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                      <v-select
                                        :items="categories"
                                        v-model="selectedCategory"
                                        item-text="type"
                                        item-value="id"
                                        item-id="id"
                                        label="Select Category"
                                        required
                                      ></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                      <v-select
                                        :items="houses"
                                        v-model="selectedHouse"
                                        item-text="address"
                                        item-value="id"
                                        item-id="id"
                                        label="Select House"
                                        required
                                      ></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                      <v-text-field 
                                        v-model="selectedCost"
                                        type="number"
                                        label="Cost"
                                      ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md4>
                                      <v-text-field
                                        v-model="selectedPurchaser"
                                        label="Purchased From"
                                        hint="ex: Bob's furniture"
                                        persistent-hint
                                      ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 lg6>
                                      <v-menu
                                        v-model="menu1"
                                        :close-on-content-click="false"
                                        full-width
                                        max-width="290"
                                      >
                                        <template v-slot:activator="{ on }">
                                          <v-text-field
                                            :value="computedPurchaseDate"
                                            clearable
                                            label="Purchased Date"
                                            readonly
                                            v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-date-picker
                                          v-model="purchaseDate"
                                          @change="menu1 = false"
                                        ></v-date-picker>
                                      </v-menu>
                                    </v-flex>
                                    <v-flex xs12>
                                      <v-text-field v-model="selectedTurns" label="Turns" type="number" required></v-text-field>
                                    </v-flex>
                                  </v-layout>
                                </v-container>
                              </v-card-text>
                              <v-card-actions>
                                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                                <v-btn color="blue darken-1" flat @click="editFurniture()">Save</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </v-layout>
                        <v-btn color="blue darken-1" flat @click="deleteFurniture(a.furnitureId)">Delete</v-btn>
                      </v-card-actions>
                  </v-card>
                  </v-expansion-panel-content>
              </v-expansion-panel>
            </template>
          </v-card>
    </v-container>
    <!-- <v-container>
      <v-card-actions>
        <v-btn flat color="orange" @click="getCategoryListView()">Back to categories</v-btn>
      </v-card-actions>
    </v-container> -->
  </div>
</template>

<script>
var moment = require('moment')
export default {
  name: 'furnitureCategoryList',
  data () {
    return {
      furniture: [],
      categories: [],
      houses: [],
      dialog: false,
      selectedName: '',
      selectedCategory: '',
      selectedHouse: '',
      selectedCost: '',
      selectedPurchaser: '',
      selectedTurns: '',
      purchaseDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      type: this.$route.params.name,
      catId: this.$route.params.id,
      url: 'https://fhistorage-api.azurewebsites.net/api/'
    }
  },
  computed: {
    computedPurchaseDate () {
      return this.purchaseDate ? moment(this.purchaseDate).format('MM/DD/YYYY') : ''
    }
  },
  created () {
    var vm = this
    vm.getFurnitureByCategoryId()
    fetch(vm.url + 'categories')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        return vm.categories = data
      })
    fetch(vm.url + 'houses')
      .then(response => {
        if(response.ok){
          return response.json()
        }
      })
      .then(data => {
        return vm.houses = data
      })
  },
  methods: {
    getFurnitureByCategoryId(){
      fetch(this.url + 'categories/' + this.catId + '/furniture' )
    .then(response => {
      if (response.ok) {
        return response.json()
      }
    })
    .then(data => {
      data.forEach(e => {
          e.datePurchased = moment(e.datePurchased).format('MM/DD/YYYY')
          if(e.houseId != 1){
            this.leftBorder = 'left-border-yellow'
          }
        })
      return this.furniture = data
    })
    },
    editFurniture(furnId){
      //console.log("furn edit id", furnId)
      // (async () => {
      //   const response = await fetch('https://fhistorage-api.azurewebsites.net/api/houses/'+ this.houseId, {
      //     method: 'PUT',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       "houseId" : this.houseId,
      //       "address" : this.newAddressInput,
      //       "zipcode" : +this.newZipInput,
      //       "cost" : +this.newCostInput,
      //       "contractDate" : this.newContractDate,
      //       "dateSold" : this.newSoldDate,
      //       "sold" : this.sold
      //     })
      //   });
      //   const data = await response.json()

      //   console.log("edited a house!", data)
      //   this.snackbar = true
      //   this.snackbarColor = 'success'
      //   this.snackbarText = 'House Successfully Updated'
      //   this.dialog = false
      //   this.getHouseByHouseId(this.houseId)
      // })();
    },
    deleteFurniture(furnId){
      console.log("furn delete id", furnId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
a {
    text-decoration:none;
}
h1, h2 {
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
}
.left-border-yellow {
  border-left: solid 4px #faca18 !important;
}
.displayHouse {
  display: none;
}
#camera--trigger {
  z-index: 999;
  display:none;
}
#camera--sensor {
  object-fit: cover
}
.noPadding { 
  padding: 0 !important
}
.subHeader {
  font-size: 18px;
}
</style>
