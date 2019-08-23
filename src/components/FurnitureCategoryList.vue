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
                      <v-card-text class="leftRightPadding">
                        <v-select
                          :class="{ 'displayHouse': a.houseId != 1 }"
                          :items="houses"
                          v-model="selectedHouse"
                          item-text="address"
                          item-value="id"
                          item-id="id"
                          label="Select House"
                          required
                        ></v-select>
                        <v-card-actions>
                          <v-btn 
                            :class="{ 'displayHouse': a.houseId != 1 }"
                            @click="assignHouse(a)"
                            >Assign to House</v-btn>
                          <v-btn @click="editFurniture(a.furnitureId)">Edit Furniture</v-btn>
                        </v-card-actions>
                        <v-card-actions>
                          <v-btn @click="deleteFurniture(a)"
                                 color="red"
                                 dark
                          >Delete Furniture<v-icon>close</v-icon></v-btn>
                        </v-card-actions>
                      </v-card-text>
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
      selectedHouse: '',
      // selectedName: '',
      // selectedCategory: '',
      // selectedHouse: '',
      // selectedCost: '',
      // selectedPurchaser: '',
      // selectedTurns: '',
      // purchaseDate: new Date().toISOString().substr(0, 10),
      // menu1: false,
      type: this.$route.params.name,
      catId: this.$route.params.id,
      url: 'https://fhistorage-api.azurewebsites.net/api/',
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: ''
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
    assignHouse(furniture){
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
            "uid" : furniture.uid
          })
        });
        const data = await response.json()

        console.log("assinged a house!", data)
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'Furniture Successfully Assigned'
        this.dialog = false
        this.getFurnitureByCategoryId(furniture.categoryId)
      })();
    },
    editFurniture(furnId){
      console.log("furn id", furnId)
      this.$router.push({name: 'furnitureEdit', params: { furnitureId: furnId }})
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
  display: none
}
#camera--trigger {
  z-index: 999;
  display:none;
}
#camera--sensor {
  object-fit: cover
}
.leftRightPadding{
  padding: 0px 16px !important
}
.noPadding { 
  padding: 0 !important
}
.subHeader {
  font-size: 18px;
}
</style>
