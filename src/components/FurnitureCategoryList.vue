<template>
  <div class="furniture">
    <div class="headline text-xs-center pa-3">
        Furniture
      </div>
    <v-container grid-list-md text-xs-center>
          <v-card light>
              <template>
                <v-expansion-panel>
                    <v-expansion-panel-content
                    v-for="(a,i) in furniture"
                    :key="i"
                    >
                    <template v-slot:header>
                        <h3>{{ a.name }} | {{ a.uid }}</h3>
                    </template>
                    <v-card>
                        <v-card-text>
                            <v-flex v-for="(x,i) in a.furnitureImages" :key="i">
                              <v-img
                                :src= "x.src"
                                contain
                              ></v-img>
                            </v-flex>
                            <p><strong>Store: </strong>{{ a.purchasedFrom }}<br />
                            <strong>Date Purchased: </strong>{{ a.datePurchased }}<br />
                            <strong>Cost: </strong>${{ a.cost }}<br />
                            <strong>Turns: </strong>{{ a.turns }}<br /></p>
                        </v-card-text>
                    </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
          </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'furnitureCategoryList',
  furniture: [],
  data () {
    return {
      furniture: []
    }
  },
  created () {
    let catId = this.$route.params.id
    let url = 'https://fhistorage-api.azurewebsites.net/api/categories/' + catId + '/furniture' 
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(data => {
        data.forEach(e => {
            if(e.furnitureImages.length > 0){
                this.getImageByImageId(e.furnitureImageId)
            }
          })
        //console.log("furn", this.furniture);
        return this.furniture = data
      })
  },
  methods: {
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
#camera--trigger {
  z-index: 999;
  display:none;
}
#camera--sensor {
  object-fit: cover
}
</style>
