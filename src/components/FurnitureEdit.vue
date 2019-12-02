<template>
  <v-container grid-list-md text-xs-center>
    <v-card v-for="(x, i) in furniture" :key="i">
      <v-card-title>
        <span class="headline">Edit Furniture</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- Camera functionality -->
            <v-flex xs12 sm6 md4>
              <v-card flat v-if="newPicture">
                <h2 left>Select an image</h2>
                <input type="file" id="furnImage" accept="image/jpeg" capture v-on:change="onFileChange">                
              </v-card>
              <div v-if="!newPicture">
                <v-card flat v-for="(p, i) in x.furnitureImages" :key="i">
                  <v-img :src="p.pictureInfo" alt="x.name" contain id="camera--output"></v-img>
                  <v-btn
                    flat 
                    v-model="newPicture" 
                    @click="editPicture(p.pictureInfo)">Edit Picture</v-btn>
                </v-card>
              </div>
              <v-card v-if="newPicture" flat>
                <v-img 
                      :src="image" 
                      alt="" 
                      contain 
                      id="camera--output"
                ></v-img>
              </v-card>
              <v-card v-if="furniture.furnitureImages = null">
                <v-img :src="p.pictureInfo" alt="" contain id="camera--output"></v-img>
              </v-card>
            </v-flex>
            <!-- End Camera functionality -->
            <v-flex xs12 sm6 md4>
              <v-text-field 
                v-model="x.name"
                label="Name" 
                hint="ex: brown leather couch"
                persistent-hint
                required 
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Category"
                :items="categories"
                v-model="x.categoryId"
                item-text="type"
                item-value="id"
                item-id="id"
                readonly
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 v-if="x.categoryId == '9'">
              <v-layout>
                <v-flex xs3>
                  <v-text-field
                    v-model="x.width"
                    type="number"
                    label="W"
                  ></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                    v-model="x.height"
                    type="number"
                    label="H"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                label="Assigned House"
                :items="houses"
                v-model="x.house.address"
                item-text="address"
                item-value="address"
                item-id="id"
                readonly
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field 
                v-model="x.cost"
                type="number"
                label="Cost"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field
                v-model="x.purchasedFrom"
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
              <v-text-field v-model="x.turns" label="Turns" type="number" readonly></v-text-field>
            </v-flex>
            <v-flex xs8 v-if="x.isFurnitureSet == true">
              <v-text-field 
                v-model="quantity"
                type="number"
                label="Quantity"
                append-outer-icon="add"
                @click:append-outer="increment" 
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="closeEditFurniture(x.categoryId)">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="editFurniture(x)">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
let moment = require('moment')
let getOrientedImage = require('exif-orientation-image')
export default {
  name: 'furnitureEdit',
  data () {
    return {
      furniture: [],
      houses: [],
      categories: [],
      rotate: 'north',
      url: 'https://fhistorage-api.azurewebsites.net/api/',
      furnId: this.$route.params.furnitureId,
      purchaseDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      newPicture: false,
      canvas: document.createElement('canvas'),
      imageFile: '',
      image: '',
      selectedHouse: '',
      selectedCategory: '',
      quantity: 0
    }
  },
  computed: {
    computedPurchaseDate () {
      return this.purchaseDate ? moment(this.purchaseDate).format('MM/DD/YYYY') : ''
    }
  },
  created () {
    var vm = this
    fetch(vm.url + 'furniture/' + this.furnId)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        data.forEach(e => {
          if(e.furnitureImages.length < 1){
            this.newPicture = true
          }
          e.datePurchased = moment(e.datePurchased).format('YYYY-MM-DD')
          this.purchaseDate = e.datePurchased
          this.quantity = e.quantity
        })
        return vm.furniture = data
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
    fetch(vm.url + 'categories')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        return vm.categories = data
      })
  },
  methods: {
    closeEditFurniture(catId){
      let catType = ''
      this.categories.forEach(e => {
        if(e.id == catId){
          catType = e.type
        }
      })
      this.$router.push({name: 'furnitureCategoryList', params: { id: catId, name: catType }})
    },
    editPicture(picInfo){
      this.newPicture = true
      this.furniture.forEach(e => {
        e.furnitureImages.forEach(x => {
          x.pictureInfo = ''
        })
      })
    },
    onFileChange(e) { 
      var vm = this
      var file = e.target.files[0]
      vm.imageFile = file
      getOrientedImage(file, (error, canvas) => {
        if(!error){
          vm.image = canvas.toDataURL()
        }
      })
      var reader = new FileReader()
    },
    editFurniture(furnObj){
      if(this.newPicture == true){
        this.furniture.forEach(e => {
          console.log("imageFile", this.imageFile)
          if(this.imageFile != ''){
            this.updateImage(e.furnitureId)
          }
        })
      }
      this.editFurnitureAsync(furnObj.furnitureId)
      
    },
    editFurnitureAsync(furnId){
      (async () => {
        const response = await fetch(this.url + 'furniture/' + furnId, {
          method: 'PUT',
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(this.furniture[0])
        })
        const data = await response.json()
        let categoryName = ''
        this.categories.forEach(c => {
          if(c.id == this.furniture[0].categoryId){
            categoryName = c.type
          }
        })
        this.$router.push({name: 'furnitureCategoryList', params: { id: this.furniture[0].categoryId, name: categoryName }})
      })();
    },
    updateImage(furnId){
      console.log("furn id", furnId)
      let formData = new FormData()
      formData.append('image', this.imageFile)
      let request = new XMLHttpRequest()
      var imageUrl = this.url + 'furniture/image/' + furnId
      request.open('POST', imageUrl)
      request.send(formData)
    },
    deleteFurniture(furnId){
      console.log("furn delete id", furnId)
    },
    increment () {
      this.quantity = parseInt(this.quantity,10) + 1
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
</style>