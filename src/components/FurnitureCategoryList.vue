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
              <div v-if="furniture.length">
                <v-expansion-panel>
                  <v-expansion-panel-content
                  ripple                    
                  v-for="(a,i) in furniture"
                  :key="i"
                  :class="{ 'left-border-yellow': a.houseId != 1 }"
                  >
                  <template v-slot:header>
                    <h3>{{ a.name }} | {{ a.uid }}</h3>
                    <small left :class="{ 'displayNone': a.houseId == 1 }">{{ a.house.address }}</small>
                  </template>
                  <template>
                    <v-card>
                      <v-card-text>
                          <v-flex v-for="(x,i) in a.furnitureImages" :key="i">
                            <v-img
                              :src= "x.pictureInfo"
                              contain
                            ></v-img>
                          </v-flex>
                          <p>
                            <strong>Store: </strong>{{ a.purchasedFrom }}<br />
                            <strong>Date Purchased: </strong>{{ a.datePurchased }}<br />
                            <strong>Cost: </strong>${{ a.cost }}<br />
                            <strong>Turns: </strong>{{ a.turns }}<br />
                            <span :class="{ 'displayNone' :a.width == null || a.height == null }"><strong>Dimensions: </strong>{{ a.width }} X {{ a.height }}<br /></span>
                            <span v-if="a.isFurnitureSet"><strong>Quantity: </strong>{{ a.quantity }}</span>
                          </p>
                      </v-card-text>
                      <v-card-text class="leftRightPadding">
                        <v-select
                          :class="{ 'displayNone': a.houseId != 1 }"
                          :items="houses"
                          v-model="selectedHouse"
                          item-text="address"
                          item-value="id"
                          item-id="id"
                          label="Select House"
                          required
                        ></v-select>
                        <v-flex xs8 v-if="selectedHouse != '' && a.isFurnitureSet == true">
                          <v-text-field 
                            v-model="quantity"
                            type="number"
                            label="Quantity"
                            append-outer-icon="add"
                            prepend-icon="remove"
                            @click:append-outer="increment"
                            @click:prepend="decrement" 
                          ></v-text-field>
                        </v-flex>
                        <v-card-actions class="marginBottom">
                          <v-btn 
                            :class="{ 'displayNone': a.houseId != 1 }"
                            @click="assignHouse(a)"
                            color="yellow"
                            light
                            >Assign</v-btn>
                          <v-btn 
                            @click="editFurniture(a.furnitureId)"
                            color="orange"
                            dark
                          >Edit</v-btn>
                          <v-btn @click="deleteFurniture(a.furnitureId)"
                                 color="red"
                                 dark
                                 :class="{'displayNone' : a.isFurnitureSet == true}"
                          >Delete<v-icon>close</v-icon>
                          </v-btn>
                        </v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-text>
                    </v-card>
                  </template>
                  </v-expansion-panel-content>
              </v-expansion-panel>
              </div>
              <div v-else class="noFurniture">
                Looks like there is no furniture in the {{ type }} yet...
              </div>
            </template>
          </v-card>
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
    </v-container>
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
      selectedHouse: '',
      type: this.$route.params.name,
      catId: this.$route.params.id,
      url: 'https://fhistorage-api.azurewebsites.net/api/',
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: '',
      width: '',
      height: '',
      quantity: 0,
      totalStockQnty: 0
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
    fetch(vm.url + 'houses')
      .then(response => {
        if(response.ok){
          return response.json()
        }
      })
      .then(data => {
        return vm.houses = data.splice(1)
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
            else
            {
              this.totalStockQnty = e.quantity
            }
          })
        return this.furniture = data
      })
    },
    assignHouse(furniture){
      if(furniture.isFurnitureSet){
        // call furniture set assign endpoint here
        this.assignFurnitureSetToHouse(furniture)
      }
      else
      {
        this.assignSingleFurnitureToHouse(furniture)
      }
    },
    assignSingleFurnitureToHouse(furniture){
      (async () => {
        const response = await fetch(this.url + '/furniture/'+ furniture.furnitureId, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "categoryId" : furniture.categoryId,
            "cost" : furniture.cost,
            "datePurchased" : furniture.datePurchased,
            "furnitureId" : furniture.furnitureId,
            "furnitureImageId" : furniture.furnitureImageId,
            "houseId" : this.selectedHouse,
            "name" : furniture.name,
            "purchasedFrom" : furniture.purchasedFrom,
            "turns" : furniture.turns,
            "uid" : furniture.uid,
            "width" : this.width,
            "height" : this.height,
            "quantity" : this.quantity
          })
        });
        const data = await response.json()

        this.selectedHouse = ''
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'Furniture Successfully Assigned'
        this.dialog = false
        this.getFurnitureByCategoryId(this.catId)
      })();
    },
    assignFurnitureSetToHouse(furniture){
      (async () => {
        const response = await fetch(this.url + 'furnitureSets/Assignment/'+ this.selectedHouse + '/' + this.quantity, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "furnitureId" : furniture.furnitureId,
            "quantity" : this.quantity
          })
        });
        const data = await response.json()

        this.selectedHouse = ''
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'Furniture Set Successfully Assigned'
        this.dialog = false
        this.getFurnitureByCategoryId(this.catId)
      })();
      // (async () => {
      //   const response = await fetch(this.url + 'furnitureSets/Assignment/'+ this.selectedHouse + '/' + this.quantity , {
      //     method: 'PUT',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       "furnitureId" : furniture.furnitureId,
      //       "quantity" : this.quantity
      //     })
      //   });
      //   const data = await response.json()

      //   this.selectedHouse = ''
      //   this.snackbar = true
      //   this.snackbarColor = 'success'
      //   this.snackbarText = 'Furniture Set Successfully Assigned'
      //   this.dialog = false
      //   this.getFurnitureByCategoryId(this.catId)
      // })();
    },
    editFurniture(furnId){
      this.$router.push({name: 'furnitureEdit', params: { furnitureId: furnId }})
    },
    deleteFurniture(furnId){
      (async () => {
        const deleteUrl = this.url + 'furniture/' + furnId
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(res => {})
        .catch(err => {
          console.log("delete error: ", err)
        })
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'Furniture Successfully Deleted'
        this.getFurnitureByCategoryId(this.catId)
      })();
      
    },
    clearModalFields(){
      //this.
    },
    increment () {
      if(this.quantity < this.totalStockQnty){
        this.quantity = parseInt(this.quantity,10) + 1
      }
      else
      {
        alert("Cannot add more than what is in the warehouse")
      }
    },
    decrement () {
      if(this.quantity > 0){
        this.quantity = parseInt(this.quantity,10) - 1
      }
      else
      {
        alert("cannot add less than zero")
      }
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
.displayNone {
  display: none
}
.leftRightPadding{
  padding: 0px 16px !important
}
.marginBottom {
  margin-bottom: 15px
}
.noPadding { 
  padding: 0 !important
}
.subHeader {
  font-size: 18px
}
.noFurniture {
  padding: 25px 50px !important
}
</style>
