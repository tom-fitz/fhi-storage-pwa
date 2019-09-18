<template>
  <div class="furniture">
    <div class="headline text-xs-center pa-3">
      Furniture
    </div>
    <v-container grid-list-md text-xs-center>
      <!-- Modal for adding a new furniture -->
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
          <v-card class="touch">
            <v-card-title>
              <span class="headline">Add New Furniture</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <!-- Camera functionality -->
                  <v-flex xs12 sm6 md4>
                    <div id="uploadImage">
                      <h2>Select an image</h2>
                      <input type="file" id="furnImage" accept="image/jpeg" multiple v-on:change="onFileChange">
                    </div>
                    <!-- Image output -->
                        <v-card flat>
                          <v-img 
                                :src="image" 
                                alt="" 
                                contain 
                                id="camera--output"
                          ></v-img>
                        </v-card>
                  </v-flex>
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
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="clearFurnitureModal()">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="postFurniture()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    <!-- End add new furniture modal -->
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
      <v-layout row v-for="(c,i) in categories" :key="i">
        <v-flex xs12>
          <v-card light @click="getFurnitureByCategoryId(c.id, c.type)">
            <v-card-title primary-title>
              <div>{{ c.type }}</div>
            </v-card-title>
          </v-card>
          <v-spacer></v-spacer>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
let moment = require('moment')
let getOrientedImage = require('exif-orientation-image')
export default {
  name: 'furniture',
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
      imgPresent: false,
      imageFile: {},
      image: '',
      purchaseDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      canvas: document.getElementById('canvas'),
      // ctx: this.canvas,
      formData: new FormData(),
      url: 'https://fhistorage-api.azurewebsites.net/api/',
      // url: 'http://localhost:52237/api/', 
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: '',
      leftBorder: ''
    }
  },
  computed: {
    computedPurchaseDate () {
      return this.purchaseDate ? moment(this.purchaseDate).format('MM/DD/YYYY') : ''
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  created () {
    var vm = this
    fetch(this.url + 'categories')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        return vm.categories = data
      })
    fetch(this.url + 'houses')
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
    getFurnitureByCategoryId (categoryId, categoryName) {
      this.$router.push({name: 'furnitureCategoryList', params: { id: categoryId, name: categoryName }})
    },
    furnitureUIDGen () {
      let text = ''
      let charset = 'abcdefghijklmnopqrstuvwxyz0123456789'

      for(var x=0;x<4;x++){
        text += charset.charAt(Math.floor(Math.random() * charset.length))
      }

      console.log("uid", text.toUpperCase())
      return text.toUpperCase()
    },
    getImageByImageId (imageId) {
        let imageUrl = this.url + 'image/' + imageId
        fetch(imageUrl)
          .then(response => {
              if(response.ok){
                  return response.json()
              }
          })
          .then(image => {
            this.furniture.forEach(e => {
              if(e.furnitureImages.length > 0){
                e.furnitureImages.push(image)
              }
            })
          })
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
      getOrientation(file, callback) {
        var reader = new FileReader()

        reader.onload = function(event) {
          var view = new DataView(event.target.result)

          if (view.getUint16(0, false) != 0xFFD8) return callback(-2)
          console.log("view: ", view.byteLength)
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
                  //console.log("callback: ", callback(view.getUint16(offset + (i * 12) + 8, little)))
                  return callback(view.getUint16(offset + (i * 12) + 8, little))
            } else if ((marker & 0xFF00) != 0xFF00) break
            else offset += view.getUint16(offset, false)
          }
          console.log("callback: ", callback)
          return callback(-1)
        }
        this.imageFile = file
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
        vm.imageFile = file
        getOrientedImage(file, (error, canvas) => {
          if(!error){
            // vm.furniture.forEach(e => {
            //   e.furnitureImages.forEach(x => {
            //     // x.pictureInfo = canvas.toDataURL()
            //   })
            // })
            vm.image = canvas.toDataURL()
          }
        })
        var reader = new FileReader()
        // reader.readAsDataURL(file)
        // reader.onload = function() {
        //   //originalImage.src = reader.result
        //   // console.log("file", this.furnitureUIDGen())
        //   vm.getOrientation(file, (orientation) => {
        //   //document.getElementById("orientation").innerText = orientation
        //     vm.resetOrientation(reader.result, orientation, function(resetBase64Image) {
        //       vm.image = resetBase64Image
        //     })
        //   })
        // } 
      },
      postFurniture () {
        if(this.image == null || ''){
          return alert('picture required!')
        }

        let uid = ''
        let charset = 'abcdefghijklmnopqrstuvwxyz0123456789'

        for(var x=0;x<4;x++){
          uid += charset.charAt(Math.floor(Math.random() * charset.length))
        }

        // Post Furniture first and pass newly created ID to the image POST.
        (async () => {
          const response = await fetch(this.url + '/furniture', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              	"name": this.selectedName,
                "uid": uid.toUpperCase(),
                "categoryId": this.selectedCategory,
                "cost": this.selectedCost,
                "purchasedFrom": this.selectedPurchaser,
                "datePurchased": this.purchaseDate,
                "houseId": this.selectedHouse,
                "turns": this.selectedTurns,
                "furnitureImageId":null
            })
          });
          const data = await response.json()

          this.postImage(data.furnitureId)
          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarText = 'Furniture Successfully Posted'
          this.dialog = false
          // this.$router.push({name: 'houses'})
        })();
      },
      postImage (furnitureId) {
        let formData = new FormData()
        formData.append('image', this.imageFile)
        let request = new XMLHttpRequest()
        this.url = this.url + 'furniture/image/' + furnitureId
        request.open('POST', this.url)
        request.send(formData)
      },
      clearFurnitureModal(){
        this.dialog = false,
        this.selectedName = '',
        this.selectedCategory = '',
        this.selectedHouse = '',
        this.selectedCost = '',
        this.selectedPurchaser = '',
        this.selectedTurns = '',
        this.imgPresent = false,
        this.imageFile = {},
        this.image = '',
        this.purchaseDate = new Date().toISOString().substr(0, 10),
        this.menu1 = false,
        this.canvas = document.createElement('canvas')
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
  text-decoration:none;
}
.touch {
  -webkit-overflow-scrolling: touch;
}
</style>