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
                  <v-flex xs12 v-if="selectedCategory == '9'">
                    <v-layout>
                      <v-flex xs3>
                        <v-text-field
                          v-model="width"
                          type="number"
                          label="W"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs3>
                        <v-text-field
                          v-model="height"
                          type="number"
                          label="H"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout>
                      <v-flex xs4>
                        Is this a set?
                      </v-flex>
                      <v-flex xs3>
                        <v-checkbox
                          v-model="isFurnitureSet"
                        >
                        </v-checkbox>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex xs8 v-if="isFurnitureSet === true">
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
                  <v-flex>
                    <v-textarea
                      outlined
                      label="Notes"
                      name="input-7-4"
                      v-model="selectedNotes"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-container>
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
      <!-- <v-layout row v-for="(c,i) in categories" :key="i"> -->
      <v-layout row>
        <v-flex xs12>
          <!-- <v-card light @click="getFurnitureByCategoryId(c.id, c.type)">
            <v-card-title primary-title>
              <div>{{ c.type }}</div>
            </v-card-title>
          </v-card> -->
          <v-card>
            <!-- <v-expansion-panels
              v-model="panel"
              multiple
            > -->
              <!-- start category by Room panel -->
              <v-expansion-panel
                v-model="panel"
                expand
              >
                <v-expansion-panel-content >
                  <template v-slot:header>
                    <h4>Categories By Room</h4>
                  </template>
                  <v-card>
                    <div v-if="loader">
                      <v-progress-circular
                        indeterminate
                        color="#71eeb8"
                      ></v-progress-circular>
                    </div>
                    <v-card-text
                        v-for="(c,i) in categoriesByGroupOne"
                        :key="i"
                        class="paddingLeft"
                        @click="getFurnitureByCategoryId(c.id, c.type)"
                    >
                      <h4>{{ c.type }}</h4>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              <!-- End Category By Room panel -->
              <!-- start Misc Category panel -->
                <v-expansion-panel-content>
                  <template v-slot:header>
                    <h4>Misc Categories</h4>
                  </template>
                  <v-card>
                    <v-card-text
                        v-for="(c,i) in categoriesByGroupTwo"
                        :key="i"
                        class="paddingLeft"
                        @click="getFurnitureByCategoryId(c.id, c.type)"
                    >
                      <h4>{{ c.type }}</h4>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- End Misc Categories -->
              
            <!-- </v-expansion-panels> -->
          </v-card>
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
      selectedNotes: '',
      imgPresent: false,
      imageFile: {},
      image: '',
      purchaseDate: new Date().toISOString().substr(0, 10),
      menu1: false,
      canvas: document.getElementById('canvas'),
      formData: new FormData(),
      url: 'https://fhistorage-api.azurewebsites.net/api/',
      // url: 'http://localhost:52237/api/',
      snackbar: false,
      snackbarColor: '',
      timeout: 3000,
      snackbarText: '',
      leftBorder: '',
      width: null,
      height: null,
      isFurnitureSet: false,
      quantity: 2,
      loader: true,
      panel: [1, 2 ]
    }
  },
  computed: {
    computedPurchaseDate () {
      return this.purchaseDate ? moment(this.purchaseDate).format('MM/DD/YYYY') : ''
    },
    categoriesByGroupOne () {
      return this.categories.filter((cat) => {
        return cat.categoryGroupId == '1'
      })
    },
    categoriesByGroupTwo () {
      return this.categories.filter((cat) => {
        return cat.categoryGroupId == '2'
      })
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
        this.loader = false
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
          const response = await fetch(this.url + 'furniture', {
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
                "width": this.width,
                "height": this.height,
                "isFurnitureSet" : this.isFurnitureSet,
                "quantity" : this.quantity,
                "notes" : this.selectedNotes,
                "furnitureImageId":null
            })
          });
          const data = await response.json()

          // if this is a set post it to the furnitureset table to track quantity
          
          // Post the image after retreiving the newly created furniture ID
          this.postImage(data.furnitureId)

          this.snackbar = true
          this.snackbarColor = 'success'
          this.snackbarText = 'Furniture Successfully Posted'
          this.dialog = false
          this.$router.push({name: 'houses'})
          let categoryName = ''
          this.categories.forEach(x => {
            if(x.id == data.categoryId){
              categoryName = x.Type
            }
          })
          this.$router.push({name: 'furnitureCategoryList', params: { id: data.categoryId, name: categoryName }})
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
      postFurnitureSet (furniture) {
        // (async () => {
        //   const response = await fetch(this.url + 'furnitureSets/' + furniture.furnitureId + '/' + this.quantity, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //       	"furnitureId": furniture.furnitureId,
        //         "Quantity": this.quantity
        //     })
        //   });
        //   const data = await response.json()
        // })();
        // fetch(this.url + 'furnitureSets/' + furniture.furnitureId + '/' + this.quantity,{
        //   method: 'post',
        //   body: JSON.stringify(furniture)
        // }).then(function(response){
        //   return response.json()
        // }).then(function(data){
        //   console.log("data", data)
        // })
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
        this.imageFile = '',
        this.image = '',
        this.width = '',
        this.height = '',
        this.purchaseDate = new Date().toISOString().substr(0, 10),
        this.menu1 = false,
        this.canvas = document.createElement('canvas')
      },
      increment () {
        this.quantity = parseInt(this.quantity,10) + 1
      },
      decrement () {
        if(this.quantity  > 1){
          this.quantity = parseInt(this.quantity,10) - 1
        }
        else
        {
          alert("If quantity is less than one, it is not a set.")
        }
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
.paddingLeft { 
  padding-left: 35px;
}
.v-input--selection-controls {
  margin: 0 !important;
  padding: 0 !important;
}
</style>