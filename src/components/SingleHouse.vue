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
                <p><strong>Contract Date: </strong>{{ h.contractDate }}<br />
                <strong>Cost of Home: </strong>${{ h.cost }}<br />
                <strong>Zipcode: </strong>{{ h.zipcode }}</p>
            </v-card-text>
          </v-card>
          <!-- Assoc. Furntiure card -->
          <v-card light>
              <template>
                <v-expansion-panel>
                    <v-expansion-panel-content
                    v-for="(a,i) in assocFurniture"
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
          <!-- -->
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
export default {
  name: 'singleHouse',
  singleHouse: [],
  assocFurniture: [],
  data () {
    return {
      singleHouse: [],
      assocFurniture: []
    }
  },
  created () {
    let houseId = this.$route.params.id
    // Fetch single house by house id
    let houseIdUrl = 'https://fhistorage-api.azurewebsites.net/api/houses/' + houseId
      fetch(houseIdUrl)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
        })
        .then(house => {
          return this.singleHouse = house
        })
    // Fetch Furniture By House Id
    let furnitureByHouseIdUrl = 'https://fhistorage-api.azurewebsites.net/api/houses/' + houseId + '/furniture'
      fetch(furnitureByHouseIdUrl)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
        })
        .then(furniture => {
          furniture.forEach(e => {
            if(e.furnitureImages.length > 0){
                this.getImageByImageId(e.furnitureImageId)
            }
          })
          return this.assocFurniture = furniture
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
              this.assocFurniture.forEach(e => {
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
p {
    text-align: left;
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
