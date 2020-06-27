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
                <p>
                  <strong>Contract Date: </strong>{{ h.contractDate }}<br />
                  <strong>Contracted Price: </strong>{{ h.contractedPrice }}<br />
                  <strong>Point of Contact: </strong>{{ h.pointOfContact }}<br />
                  <strong>Town: </strong>{{ h.town }}<br />
                  <strong>Notes: </strong>{{ h.notes }}
                </p>
            </v-card-text>
          </v-card>
          <!-- Assoc. Furntiure card -->
          <v-card light>
              <template>
                <div v-if="loader">
                  <v-progress-circular
                    indeterminate
                    color="#71eeb8"
                  ></v-progress-circular>
                </div>
                <v-expansion-panel>
                  <v-expansion-panel-content
                  v-for="(a,i) in assocFurniture"
                  :key="i"
                  multiple
                  :class="{ 'border-red': a.bulk != 0 }"
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
                          <p>
                            <strong>Store: </strong>{{ a.purchasedFrom }}<br />
                            <strong>Date Purchased: </strong>{{ a.datePurchased }}<br />
                            <strong>Cost: </strong>{{ a.cost }}<br />
                            <strong>Turns: </strong>{{ a.turns }}<br />
                            <strong>Dimensions: </strong>{{ a.width }} X {{ a.height }}<br />
                            <strong>Quantity: </strong>{{ a.quantity }}<br />
                            <strong>Notes: </strong>{{ a.notes }}<br />
                          </p>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn 
                          v-if="!a.bulk"
                          light
                          color="yellow" 
                          @click="updateFurniture(a)"
                        >Return to Warehouse</v-btn>
                        <v-btn
                          color="orange"
                          dark
                          @click="routeToFurnitureEdit(a.furnitureId)"
                        >Edit Furniture</v-btn>
                      </v-card-actions>
                  </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
          </v-card>
          <v-card>
          <!-- Upload and edit buttons -->
            <v-card-text>
              <v-card-actions>
                <v-btn 
                @click="bulkUploadFurniture(h.id)"
                color="yellow"
                light
                >Bulk Upload Furniture</v-btn>
                <v-btn 
                @click="editHouse(h.id)"
                color="orange"
                dark
                >Edit</v-btn>
              </v-card-actions>
            </v-card-text>
          <!-- End edit and upload house modal -->
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
let moment = require('moment')
let orient = require('jpeg-autorotate')
const FURNITURE_NAME_BULK_UPLOAD = "***Bulk-Upload***"
export default {
  name: 'singleHouse',
  data () {
    return {
      singleHouse: [],
      assocFurniture: [],
      url: 'https://fhistorage-api.azurewebsites.net/api/',
      houseId: this.$route.params.id,
      dialog: false,
      newSoldDate: new Date().toISOString().substr(0, 10),
      sold: false,
      menu1: false,
      menu2: false,
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: '',
      loader: true,
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
      // Fetch single house by house id
      let houseIdUrl = this.url + 'houses/' + this.houseId
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
            h.dateSold = ''
          }
        })
        return this.singleHouse = house
      })
      // Fetch Furniture By House Id
      let furnitureByHouseIdUrl = this.url + 'houses/' + this.houseId + '/furniture'
      fetch(furnitureByHouseIdUrl)
      .then(response => {
        if(response.ok) {
          return response.json()
        }
      })
      .then(furniture => {
        this.loader = false
        furniture.forEach(e => {
          e.datePurchased = moment(e.datePurchased).format('MM/DD/YYYY')
          if(e.name == FURNITURE_NAME_BULK_UPLOAD){
            Object.assign(e, {bulk: 1})
          }else{
            Object.assign(e, {bulk: 0})
          }
        })
        return this.assocFurniture = furniture
      })
    },
    deleteHouse (houseId) {
      (async () => {
        const response = await fetch(this.url + houseId, {
          method: 'DELETE'
        })
        .then(res => {

        })
        .catch(err => {
          this.snackbar = true
          this.snackbarColor = 'danger'
          this.snackbarText = 'House Deletion Failed'
        })
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Deleted'
        this.$router.push('/')
      })();
    },
    editHouse (houseId) {
      let soldFlag = true
      this.assocFurniture.forEach(x => {
        if(x.bulk){
          soldFlag = false
        }
      })
      this.$router.push({name: 'houseEdit', params: { houseId: houseId, soldFlag: soldFlag }})
    },
    bulkUploadFurniture(houseId) {
      this.$router.push({name: 'bulkFurnitureUpload', pararms: { houseId: houseId }})
    },
    updateFurniture(f){
      if(f.isFurnitureSet)
      {
        this.updateFurnitureSetByFurnitureId(f)
      }
      else
      {
        this.updateFurnitureByFurnitureId(f)
      }
    },
    updateFurnitureSetByFurnitureId(furn){
      (async () => {
        const response = await fetch(this.url + 'furnitureSet/Warehouse', {
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
            "turns": furn.turns,
            "width" : furn.width,
            "height" : furn.height,
            "quantity" : furn.quantity
          })
        });
        const data = await response
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Updated'
        this.dialog = false
        this.getHouseByHouseId(furn.houseId)
      })();
    },
    updateFurnitureByFurnitureId(furn){
      (async () => {
        const response = await fetch(this.url + 'furniture/'+ furn.furnitureId, {
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
            "width" : furn.width,
            "height" : furn.height,
            "quantity" : furn.quantity
          })
        });
        const data = await response
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Updated'
        this.dialog = false
        this.getHouseByHouseId(furn.houseId)
      })();
    },
    routeToFurnitureEdit(furnId){
      this.$router.push({name: 'furnitureEdit', params: { furnitureId: furnId }})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
p {
    text-align: left
}
.displayNone {
  display: none
}
.btn-style {
  width:80%;
  margin: 15px 0px;
}
.border-red {
  border-left: solid 4px red !important
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
