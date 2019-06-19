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
                    <div id="camera" v-if="getMobileOperatingSystem()">
                      <div>
                        <v-btn id="snap" v-on:click="capture()">Snap Photo</v-btn>
                        <h2>Select an image</h2>
                        <input type="file" v-on:change="onFileChange">
                      </div>
                        <canvas id="camera--sensor" refs="cameraSensor" width="375" height="667" style="display:none"></canvas>
                        <video id="v" autoplay></video>
                        <!-- Camera trigger -->
                        <v-btn id="camera--trigger" v-on:click="takePicture()">Take a picture</v-btn>
                    </div>
                    <div id="uploadImage" v-else>
                      <h2>Select an image</h2>
                      <input type="file" accept="image/jpeg" capture v-on:change="onFileChange">
                    </div>
                    <!-- Image output -->
                        <v-card flat>
                          <v-img v-bind:src="image" alt="" contain id="camera--output"></v-img>
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
  <v-text-field v-model="dateFormatted" label="Date Purchased" hint="MM/DD/YYYY format" persistent-hint @blur="date = parseDate(dateFormatted)" v-on="on">
  
  </v-text-field>
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
  
    furniture: [],
  
    categories: [],
  
    data() {
  
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
  
        imageFile: {},
  
        image: '',
  
        date: new Date().toISOString().substr(0, 10),
  
        dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
  
        menu1: false
  
      }
  
    },
  
    computed: {
  
      computedDateFormatted() {
  
        return this.formatDate(this.date)
  
      }
  
    },
  
    watch: {
  
      date(val) {
  
        this.dateFormatted = this.formatDate(this.date)
  
      }
  
    },
  
    created() {
  
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
  
          if (response.ok) {
  
            return response.json()
  
          }
  
        })
  
        .then(data => {
  
          return vm.houses = data
  
        })
  
    },
  
    methods: {
  
      getFurnitureByCategoryId(categoryId) {
  
        this.$router.push({
  
          name: 'furnitureCategoryList',
  
          params: {
  
            id: categoryId
  
          }
  
        })
  
      },
  
      furnitureUIDGen() {
  
        let text = ''
  
        let charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
  
  
  
        for (var x = 0; x < 4; x++) {
  
          text += charset.charAt(Math.floor(Math.random() * charset.length))
  
        }
  
  
  
        console.log("uid", text.toUpperCase())
  
        return text.toUpperCase()
  
      },
  
      getImageByImageId(imageId) {
  
        let imageUrl = 'https://fhistorage-api.azurewebsites.net/api/image/' + imageId
  
        fetch(imageUrl)
  
          .then(response => {
  
            if (response.ok) {
  
              return response.json()
  
            }
  
          })
  
          .then(image => {
  
            this.furniture.forEach(e => {
  
              if (e.furnitureImages.length > 0) {
  
                e.furnitureImages.push(image)
  
              }
  
            })
  
          })
  
      },
  
      formatDate(date) {
  
        if (!date) return null
  
  
  
        const [year, month, day] = date.split('-')
  
        return `${month}/${day}/${year}`
  
      },
  
      parseDate(date) {
  
        if (!date) return null
  
  
  
        const [month, day, year] = date.split('/')
  
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  
      },
  
      capture() {
  
        v.style.display = "block"
  
        this.camImg = ''
  
        const cameraTrigger = document.querySelector("#camera--trigger")
  
        cameraTrigger.style.display = "block"
  
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  
          let constraints = {
  
            "audio": false,
  
            "video": {
  
              facingMode: "environment",
  
              width: {
  
                min: 375,
  
                ideal: 375,
  
                max: 768
  
              },
  
              height: {
  
                min: 667,
  
                ideal: 667,
  
                max: 1024
  
              }
  
            }
  
          }
  
          navigator.mediaDevices.getUserMedia(constraints)
  
            .then(stream => {
  
              v.srcObject = stream
  
            })
  
            .catch(error => {
  
              console.log(error)
  
            })
  
        }
  
      },
  
      takePicture() {
  
        const cameraOutput = document.querySelector("#camera--output")
  
        const cameraSensor = document.querySelector("#camera--sensor")
  
        const cameraTrigger = document.querySelector("#camera--trigger")
  
  
  
        let imageCtx = cameraSensor.getContext("2d")
  
  
  
        let imageData = imageCtx.getImageData(0, 0, v.videoWidth, v.videoHeight)
  
        let imageDraw = imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, imageData.width, imageData.height)
  
  
  
        cameraSensor.toBlob(blob => {
  
          let url = URL.createObjectURL(blob)
  
          this.camImg = url
  
          URL.revokeObjectURL(blob)
  
        }, "image/jpeg", 0.95)
  
  
  
        v.srcObject.getTracks()[0].stop()
  
  
  
        cameraOutput.classList.add("taken")
  
        v.style.display = "none"
  
        cameraSensor.style.display = "none"
  
        cameraTrigger.style.display = "none"
  
      },
  
      getMobileOperatingSystem() {
  
        let userAgent = navigator.userAgent || navigator.vendor || window.opera
  
        if (/windows phone/i.test(userAgent)) {
  
          // handle showing or hiding snap photo button functionality
  
          //alert("windows phone")
  
          return true
  
        } else if (/android/i.test(userAgent)) {
  
          //alert("andriod")
  
          return true
  
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
  
          //alert("iOS")
  
          return false
  
        }
  
      },
  
      onFileChange(e) {
  
        var files = e.target.files || e.dataTransfer.files
  
  
  
        // this.getOrientation(files[0], function(orientation){
  
        //   //console.log("orientation", + orientation)
  
        //   alert("orientation: " + orientation)
  
        // })
  
        // EXIF.getData(img, () => {
  
        //   let orientation = img.exifdata.Orientation
  
  
  
        //   exifOrient(img, orientation, (err, canvas) => {
  
        //     console.log(canvas)
  
        //   })
  
  
  
        // })
  
        var files = e.target.files || e.dataTransfer.files
  
        if (!files.length) {
  
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
  
            console.log(resetBase64image)
  
            vm.image = resetBase64image
  
          })
  
          this.imageFile = e.target.result
  
        }
  
        reader.readAsDataURL(file)
  
      },
  
      removeImage: function(e) {
  
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
  
            case 2:
  
              ctx.transform(-1, 0, 0, 1, width, 0);
  
              break;
  
            case 3:
  
              ctx.transform(-1, 0, 0, -1, width, height);
  
              break;
  
            case 4:
  
              ctx.transform(1, 0, 0, -1, 0, height);
  
              break;
  
            case 5:
  
              ctx.transform(0, 1, 1, 0, 0, 0);
  
              break;
  
            case 6:
  
              ctx.transform(0, 1, -1, 0, height, 0);
  
              break;
  
            case 7:
  
              ctx.transform(0, -1, -1, 0, height, width);
  
              break;
  
            case 8:
  
              ctx.transform(0, -1, 1, 0, 0, width);
  
              break;
  
            default:
  
              break;
  
          }
  
  
  
          // draw image
  
          ctx.drawImage(img, 0, 0)
  
  
  
          // export base64
  
          callback(canvas.toDataURL())
  
        };
  
        console.log(srcBase64)
  
        //img.src = srcBase64;
  
        this.image = srcBase64
  
      }
  
    }
  
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  h1,
  
  h2 {
  
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
  
    text-decoration: none;
  
  }
  
  
  
  .touch {
  
    -webkit-overflow-scrolling: touch;
  
  }
</style>
