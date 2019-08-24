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
              <v-card flat v-for="(p, i) in x.furnitureImages" :key="i">
                <v-img :src="p.pictureInfo" :class="[rotate]" alt="" contain id="camera--output"></v-img>
                <v-btn 
                  v-if="!newPicture"
                  flat 
                  v-model="newPicture" 
                  @click="editPicture(p.pictureInfo)">Edit Picture</v-btn>
              </v-card>
              <v-card v-if="furniture.furnitureImages = null">
                <v-img :src="p.pictureInfo" :class="[rotate]" alt="" contain id="camera--output"></v-img>
              </v-card>
              <!-- <v-card v-if="imgPresent" flat>
                <v-btn id="imgRotate" v-on:click="rotateImage()">Rotate Image</v-btn>
              </v-card> -->
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
                :items="categories"
                v-model="x.categoryId"
                item-text="type"
                item-value="id"
                item-id="id"
                required
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                :items="houses"
                v-model="x.house.address"
                item-text="address"
                item-value="address"
                item-id="id"
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
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="closeEditFurniture(x.categoryId)">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="editFurniture(x.furnitureId)">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
var moment = require('moment')
export default {
  name: 'furnitureEdit',
  data () {
    return {
      furniture: [],
      houses: [],
      categories: [],
      rotate: 'north',
      // url: 'https://fhistorage-api.azurewebsites.net/api/',
      url: 'http://localhost:52237/api/',
      furnId: this.$route.params.furnitureId,
      purchaseDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      newPicture: false,
      canvas: document.createElement('canvas'),
      imageFile: {},
      image: ''
    }
  },
  computed: {
    computedPurchaseDate () {
      return this.purchaseDate ? moment(this.purchaseDate).format('MM/DD/YYYY') : ''
    }
  },
  created () {
    var vm = this
    // vm.getFurnitureByCategoryId()
    fetch(vm.url + 'furniture/' + this.furnId)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        data.forEach(e => {
          e.datePurchased = moment(e.datePurchased).format('YYYY-MM-DD')
          this.purchaseDate = e.datePurchased
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
      let files = e.target.files || e.dataTransfer.files
      if (!files.length){
        return
      }
      this.createImage(files[0])
      this.imageFile = files[0]
    },
    createImage(file) {
      console.log("2 here?", file)
      let image = new Image()
      let reader = new FileReader()
      let vm = this

      reader.onload = (e) => {
        this.resetOrientation(e.target.result, 5, (resetBase64image) => {
          //vm.image = resetBase64image
          console.log(" maybe here?", this.image)
        })
      }
      console.log("3 here?", file)
      reader.readAsDataURL(file)
      this.imgPresent = true
    },
    resetOrientation(srcBase64, srcOrientation, callback) {
      let newImg = document.createElement('img')
      this.canvas.toBlob(function(blob) {
          let url = URL.createObjectURL(blob)
          newImg.onload = function() {
            // no longer need to read the blob so it's revoked
            URL.revokeObjectURL(url)
          }
          // this is the image to be sent to the API
          // base 64 will be the displayed image for user to see.
          newImg.src = url
        })
      let img = new Image()
      img.onload = function() {
        let width = img.width,
            height = img.height
        this.canvas.width = width
        this.canvas.height = height
      }
      console.log("here?", this.image)
      this.furniture.forEach(e => {
        e.furnitureImages.forEach(x => {
          x.pictureInfo = srcBase64
        })
      })
    },
    editFurniture(furnId){
      this.furniture.forEach(e => {
        e.furnitureImages.forEach(x => {
          if(x.pictureInfo.toLowerCase().indexOf("https://fhistorage-api.azurewebsites.net" === false) && x.pictureInfo != null){
            this.updateImage(x)
          }
        })
      })
      this.furniture.forEach(e => {
        let furnitureObject = {
          "address"       : e.address,
          "zipcode"       : e.zipcode,
          "cost"          : e. cost,
          "purchasedDate" : e.purchaseDate,
          "purchasedFrom" : e.purchasedFrom,
          "categoryId"    : e.categoryId,
          "houseId"       : e.houseId,
          "turns"         : e.turns
        }
      })
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

        console.log("edited a furniture!", data)
        this.snackbar = true
        this.snackbarColor = 'success'
        this.snackbarText = 'House Successfully Updated'
        this.dialog = false
        // this.$router.push({name: 'furnitureCategoryList', params: { id: categoryId, name: categoryName }})
      })();
    },
    updateImage(imgObj){
      //console.log("furn id", imgObj)
      let formData = new FormData()
      formData.append('image', this.imageFile)
      let request = new XMLHttpRequest()
      this.url = this.url + 'furniture/image/' + imgObj.furnitureId
      request.open('POST', this.url)
      request.send(formData)
    },
    deleteFurniture(furnId){
      console.log("furn delete id", furnId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.north {
transform:rotate(0deg);
-ms-transform:rotate(0deg); /* IE 9 */
-webkit-transform:rotate(0deg); /* Safari and Chrome */
}
.west {
transform:rotate(90deg);
-ms-transform:rotate(90deg); /* IE 9 */
-webkit-transform:rotate(90deg); /* Safari and Chrome */
}
.south {
transform:rotate(180deg);
-ms-transform:rotate(180deg); /* IE 9 */
-webkit-transform:rotate(180deg); /* Safari and Chrome */
    
}
.east {
transform:rotate(270deg);
-ms-transform:rotate(270deg); /* IE 9 */
-webkit-transform:rotate(270deg); /* Safari and Chrome */
}
</style>