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
                      <input type="file" id="furnImage" accept="image/jpeg" capture v-on:change="onFileChange">
                    </div>
                    <!-- Image output -->
                        <v-card flat>
                          <v-img :src="image" :class="[rotate]" alt="" contain id="camera--output"></v-img>
                        </v-card>
                        
                        <v-card v-if="imgPresent" flat>
                          <v-btn id="imgRotate" v-on:click="rotateImage()">Rotate Image</v-btn>
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
              <v-btn color="blue darken-1" flat @click="furnitureUIDGen()">Close</v-btn>
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
var moment = require('moment')
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
      rotate: 'north',
      canvas: document.createElement('canvas'),
      ctx: this.canvas,
      formData: new FormData(),
      url: 'https://fhistorage-api.azurewebsites.net/api/', //'http://localhost:52237/api/',
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
      onFileChange(e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length){
          return
        }
        this.createImage(files[0])
        this.imageFile = files[0]
      },
      createImage(file) {
        let image = new Image()
        let reader = new FileReader()
        let vm = this

        reader.onload = (e) => {
          this.resetOrientation(e.target.result, 5, (resetBase64image) => {
            vm.image = resetBase64image
          })
        }
        reader.readAsDataURL(file)
        this.imgPresent = true
      },
      removeImage: function (e) {
        this.image = '';
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
        this.image = srcBase64
      },
      rotateImage(){
        if(this.rotate === 'north'){
          this.canvas.height = this.canvas.width
          console.log("img height reset", this.canvas.height)
          this.rotate = 'west'
        }else if(this.rotate === 'west'){
          this.rotate = 'south'
        }else if(this.rotate === 'south'){
          this.rotate = 'east'
        }else if(this.rotate === 'east'){
          this.rotate = 'north'
        }
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

        //console.log("response", request.response())

        // (async () => {
        //   const response = await fetch(this.url + 'api/furniture/image/'+ furnitureId, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Length': this.imageFile.size
        //     },
        //     body: JSON.stringify(this.imageFile)
        //   });
        //   const data = await response //.json()

        //   console.log("posted a picture!", data)
        //   // this.snackbar = true
        //   // this.snackbarColor = 'success'
        //   // this.snackbarText = 'House Successfully Updated'
        //   this.dialog = false
        //   // this.$router.push({name: 'houses'})
        // })();
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