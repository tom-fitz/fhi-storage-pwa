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
                      <input type="file" accept="image/jpeg" capture v-on:change="onFileChange">
                    </div>
                    <!-- Image output -->
                        <v-card flat>
                          <v-img v-bind:src="image" :class="[rotate]" alt="" contain id="camera--output"></v-img>
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
                      ref="menu1"
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="dateFormatted"
                          label="Date Purchased"
                          hint="MM/DD/YYYY format"
                          persistent-hint
                          @blur="date = parseDate(dateFormatted)"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Turns" type="number" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="furnitureUIDGen()">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    <!-- End add new furniture modal -->
      <v-layout row v-for="(c,i) in categories" :key="i">
        <v-flex xs12>
          <v-card light @click="getFurnitureByCategoryId(c.id)">
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
      imgPresent: false,
      imageFile: {},
      image: '',
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      rotate: 'north'
    }
  },
  computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
    }
  },
  created () {
    var vm = this
    let url = 'https://fhistorage-api.azurewebsites.net/api/'
    fetch(url + 'categories')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        return vm.categories = data
      })
    fetch(url + 'houses')
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
    getFurnitureByCategoryId (categoryId) {
      this.$router.push({name: 'furnitureCategoryList', params: { id: categoryId }})
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
          let imageUrl = 'https://fhistorage-api.azurewebsites.net/api/image/' + imageId
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
        var files = e.target.files || e.dataTransfer.files
        if (!files.length){
          return
        }
        this.createImage(files[0])
        this.imageFile = files[0]
      },
      createImage(file) {
        var image = new Image()
        var reader = new FileReader()
        var vm = this

        reader.onload = (e) => {
          //console.log("base64?", e.target.result)
          this.resetOrientation(e.target.result, 5, (resetBase64image) => {
            //vm.image = e.target.result
            vm.image = resetBase64image
          })
          this.imageFile = e.target.result
        }
        reader.readAsDataURL(file)
        this.imgPresent = true
      },
      removeImage: function (e) {
        this.image = '';
      },
      resetOrientation(srcBase64, srcOrientation, callback) {
        var img = new Image();	

        img.onload = function() {
          var width = img.width,
              height = img.height,
              canvas = document.createElement('canvas'),
              ctx = canvas.getContext("2d");
          
          // set proper canvas dimensions before transform & export
          if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }
        
          // transform context before drawing image
          switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height , width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
          }

          // draw image
          ctx.drawImage(img, 0, 0)

          // export base64
          callback(canvas.toDataURL("image/jpg"))
        }
        //img.src = srcBase64;
        
        this.image = srcBase64
      },
      rotateImage(){
        if(this.rotate === 'north'){
          this.rotate = 'west'
        }else if(this.rotate === 'west'){
          this.rotate = 'south'
        }else if(this.rotate === 'south'){
          this.rotate = 'east'
        }else if(this.rotate === 'east'){
          this.rotate = 'north'
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
