<template>
    <!-- Modal for editing a new house -->
    <v-container grid-list-md text-xs-center>
        <v-card v-for="(x, i) in singleHouse" :key="i">
            <v-card-title>
            <span class="headline">Edit House</span>
            </v-card-title>
            <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                <v-flex xs12>
                    <v-text-field 
                    label="Address" 
                    v-model="x.address"
                    required
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field
                    label="Zipcode"
                    v-model="x.zipcode"
                    type="number"
                    required
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                    label="Cost"
                    v-model="x.cost"
                    type="number" 
                    hint="ex: 122.75"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12>
                    <v-text-field 
                    label="contractDate"
                    v-model="contractDate"
                    type="text"
                    readonly
                    ></v-text-field>
                </v-flex>

                <v-flex xs12>
                    <v-checkbox
                    v-model="sold"
                    label="Sold"
                    input-value="false"
                    ></v-checkbox>
                </v-flex>

                <!-- sold date picker -->
                <v-flex v-if="sold" xs12 lg6>
                    <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    full-width
                    max-width="290"
                    >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                        :value="computedSoldDate"
                        clearable
                        label="Sold Date"
                        readonly
                        v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="dateSold"
                        @change="menu2 = false"
                    ></v-date-picker>
                    </v-menu>
                </v-flex>
                <!-- end sold date picker -->


                </v-layout>
            </v-container>
            <v-card-actions class="marginBottom">
                <v-btn 
                @click="editHouse()"
                color="yellow"
                light
                >Save</v-btn>
                <v-btn 
                @click="cancelEdit()"
                color="orange"
                dark
                >Cancel</v-btn>
                <v-btn @click="deleteHouse()"
                        color="red"
                        dark
                >Delete<v-icon>close</v-icon>
                </v-btn>
            </v-card-actions>
            </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        </v-dialog>
    </v-container>
    <!-- End edit house modal -->
</template>

<script>
let moment = require('moment')
export default {
    name: 'editHouse',
    data () {
        return {
            singleHouse: [],
            houseId: this.$route.params.id,
            menu1: false,
            menu2: false,
            addressInput: '',
            zipInput: '',
            costInput: '',
            soldFlag: false,
            contractDate: '',
            dateSold: '',
            sold: false,
            url: 'https://fhistorage-api.azurewebsites.net/api/houses/'
        }
    },
    computed: {
        computedContractDate () {
            return this.contractDate ? moment(this.contractDate).format('MM/DD/YYYY') : ''
        },
        computedSoldDate () {
            return this.dateSold ? moment(this.dateSold).format('MM/DD/YYYY') : ''
        }
    },
    created () {
        this.getHouseByHouseId(this.houseId)
    },
    methods: {
        getHouseByHouseId(houseId){
            // Fetch single house by house id
            let houseIdUrl = this.url + this.houseId
            fetch(houseIdUrl)
            .then(response => {
                if(response.ok) {
                return response.json()
                }
            })
            .then(house => {
                house.forEach(h => {
                    this.contractDate = moment(h.contractDate).format('MM/DD/YYYY')
                    if(h.dateSold = '0001-01-01'){
                        this.dateSold = ''
                    }else{
                        this.dateSold = moment(h.dateSold).format('MM/DD/YYYY')
                    }
                })
                return this.singleHouse = house
            })
        },
        deleteHouse (houseId) {
            (async () => {
                const response = await fetch(this.url + this.houseId, {
                method: 'DELETE'
                })
                .then(res => {

                })
                .catch(err => {
                    this.snackbar = true
                    this.snackbarColor = 'danger'
                    this.snackbarText = 'House Deletion Failed. Retry.'
                })
                this.snackbar = true
                this.snackbarColor = 'success'
                this.snackbarText = 'House Successfully Deleted'
                this.$router.push('/')
            })();
        },
        editHouse () {
            (async () => {
                const response = await fetch(this.url + this.houseId, {
                    method: 'PUT',
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        "houseId" : this.houseId,
                        "address" : this.singleHouse[0].address,
                        "zipcode" : this.singleHouse[0].zipcode,
                        "cost" : this.singleHouse[0].cost,
                        "contractDate" : this.singleHouse[0].contractDate,
                        "dateSold" : this.dateSold,
                        "sold" : this.sold
                    })
                });
                const data = await response.json()
                this.snackbar = true
                this.snackbarColor = 'success'
                this.snackbarText = 'House Successfully Edited'
                this.$router.push('/')
            })();
        },
        cancelEdit () {
            this.$router.push({name: 'singleHouse', params: {houseId: this.houseId }})
        }
    }
}
</script>
<style>
.marginBottom {
  margin-bottom: 15px
}
</style>