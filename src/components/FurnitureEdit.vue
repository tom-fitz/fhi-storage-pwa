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
                <v-img :src="p.pictureInfo" alt="x.name" contain id="camera--output"></v-img>
                <v-btn 
                  v-if="!newPicture"
                  flat 
                  v-model="newPicture" 
                  @click="editPicture(p.pictureInfo)">Edit Picture</v-btn>
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
      // url: 'http://localhost:52237/api/',
      furnId: this.$route.params.furnitureId,
      purchaseDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      newPicture: false,
      canvas: document.createElement('canvas'),
      imageFile: {},
      image: '',
      selectedHouse: '',
      selectedCategory: ''
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
    getOrientation(file, callback) {
      var reader = new FileReader()

      reader.onload = function(event) {
        var view = new DataView(event.target.result)

        if (view.getUint16(0, false) != 0xFFD8) return callback(-2)

        var length = view.byteLength,
          offset = 2

        while (offset < length) {
          var marker = view.getUint16(offset, false)
          offset += 2

          if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) {
              return callback(-1)
            }
            var little = view.getUint16(offset += 6, false) == 0x4949
            offset += view.getUint32(offset + 4, little)
            var tags = view.getUint16(offset, little)
            offset += 2

            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + (i * 12), little) == 0x0112)
                return callback(view.getUint16(offset + (i * 12) + 8, little))
          } else if ((marker & 0xFF00) != 0xFF00) break
          else offset += view.getUint16(offset, false)
        }
        return callback(-1)
      };

      reader.readAsArrayBuffer(file.slice(0, 64 * 1024))
    },
    resetOrientation(srcBase64, srcOrientation, callback) {
      var img = new Image()

      img.onload = function() {
        var width = img.width,
          height = img.height,
          canvas = document.createElement('canvas'),
          ctx = canvas.getContext("2d")

        // set proper canvas dimensions before transform & export
        if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
          canvas.width = height
          canvas.height = width
        } else {
          canvas.width = width
          canvas.height = height
        }

        // transform context before drawing image
        switch (srcOrientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0)
            break
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height)
            break
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height)
            break
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0)
            break
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0)
            break
          case 7:
            ctx.transform(0, -1, -1, 0, height, width)
            break
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width)
            break
          default:
            ctx.transform(1, 0, 0, 1, 0, 0)
        }

        // draw image
        ctx.drawImage(img, 0, 0)

        // export base64
        callback(canvas.toDataURL())
      }

      img.src = srcBase64
    },
    onFileChange(e) {
      var vm = this
      var file = e.target.files[0]
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function() {
        // vm.getOrientation(file, (orientation) => {
        //   vm.resetOrientation(reader.result, orientation, function(resetBase64Image) {
        //     //vm.image = resetBase64Image
        //     vm.furniture.forEach(e => {
        //       e.furnitureImages.forEach(x => {
        //         x.pictureInfo = resetBase64Image
        //       })
        //     })
        //   })
        // })
      } 
    },
    editFurniture(furnObj){
      let categoryName = ''
      if(this.newPicture == true){
        this.furniture.forEach(e => {
          console.log("imageFile", this.imageFile)
          if(this.imageFile != {}){
            this.updateImage(e.furnitureId)
          }
          e.furnitureImages.forEach(x => {
            if(x.pictureInfo.toLowerCase().indexOf("https://fhistorage-api.azurewebsites.net" === false)){
              this.updateImage(x.furnitureId)
            }
          })
        })
      }
      this.categories.forEach(c => {
        if(c.id == this.furniture[0].categoryId){
          categoryName = c.type
        }
      })
      this.editFurnitureAsync(furnObj.furnitureId)
      this.$router.push({name: 'furnitureCategoryList', params: { id: this.furniture[0].categoryId, name: categoryName }})
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
        console.log("returned data", data)
      })();
    },
    updateImage(furnId){
      console.log("furn id", furnId)
      let formData = new FormData()
      formData.append('image', this.image)
      let request = new XMLHttpRequest()
      var imageUrl = this.url + 'furniture/image/' + furnId
      request.open('POST', imageUrl)
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
</style>