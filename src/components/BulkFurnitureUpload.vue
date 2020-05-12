<template>
    <!-- Modal for editing a new house -->
    <v-container grid-list-md text-xs-center>
        <v-card>
            <v-card-text>
                <h1>Bulk Furniture Upload</h1>
            </v-card-text>
            <v-card-text>
                <p>Use the 'Choose Files' button below to upload multiple photos.</p>
                <p>For each photo that is uploaded, a furniture object will also be created within this specific 'house'</p>
                <p>Since the furniture data is what is important, place holders will be given to each field.</p>
                <p>These placeholders <strong>NEED</strong> to be edited. You <strong>will not</strong> be able to move furniture back to the warehouse without editing in the proper information.</p>
            </v-card-text>
            <v-card-text>
                <input type="file" multiple accept="image/*" @change="handleSelects" name="images">
            </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        <v-card>
            <v-card-text v-for="(image, i) in images" :key="i">
                <img :src="image" class="preview">
            </v-card-text>
            <v-card-text v-if="images.length > 0">
                <v-btn color="orange" x-large light @click="uploadFiles()">Save</v-btn>
            </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
    </v-container>
    <!-- End edit house modal -->
</template>

<script>
let moment = require('moment')
export default {
    name: 'bulkFurnitureUpload',
    data () {
        return {
            houseId: this.$route.params.id,
            images: [],
            furnitureArray: [],
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
        //this.getHouseByHouseId(this.houseId)
    },
    methods: {
        handleSelects(e) {
            this.images = [];
            let fileList = Array.prototype.slice.call(e.target.files);
            fileList.forEach(f => {

                if(!f.type.match("image.*")) {
                        return;
                    }
                            
                let reader = new FileReader();
                let that = this;
                reader.onload = function (e) {
                that.images.push(e.target.result);

                }
                reader.readAsDataURL(f); 
            });
        },
        uploadFiles(){
            // First, we need to build the furnitureObject with dummy data..
            this.buildfurnitureArray()
            // Next, we need to build out the formData and add in the newly created furnitureId's
            let formData = this.buildFormData()

            let request = new XMLHttpRequest()
            let imgUrl = 'http://localhost:50850/api/image/bulk'
            request.open('POST', imgUrl)
            request.send(formData)

        },
        buildfurnitureArray(){
            // now set the loop to the finish on the length of your images
            // this will be the furniture 'shell' for each image
            for(let i = 0; i < this.images.length; i++){
                this.furnitureArray.push({
                    "name": "**BULK-UPLOAD**",
                    "uid": this.uidGenerator(),
                    "categoryId": 1,
                    "cost": 0,
                    "purchasedFrom": "**BULK-UPLOAD**",
                    "datePurchased": Date.now(),
                    "houseId": this.houseId,
                    "turns": 1,
                    "width": null,
                    "height": null,
                    "isFurnitureSet" : false,
                    "quantity" : 1,
                    "notes" : "**BULK-UPLOAD**",
                    "furnitureImageId":null
                })
            }
        },
        buildFormData(){
            let formData = new FormData()
            this.images.forEach(e => {
                formData.append('image', e)
                formData.append('furnitureId', 11111)
            })

            return formData 
        },
        uidGenerator(){
            let uid = ''
            let charset = 'abcdefghijklmnopqrstuvwxyz0123456789'

            for(var x=0;x<4;x++){
            uid += charset.charAt(Math.floor(Math.random() * charset.length))
            }

            return uid.toUpperCase()
        }
        // getHouseByHouseId(houseId){
        //     // Fetch single house by house id
        //     let houseIdUrl = this.url + this.houseId
        //     fetch(houseIdUrl)
        //     .then(response => {
        //         if(response.ok) {
        //         return response.json()
        //         }
        //     })
        //     .then(house => {
        //         house.forEach(h => {
        //             this.contractDate = moment(h.contractDate).format('MM/DD/YYYY')
        //             if(h.dateSold = '0001-01-01'){
        //                 this.dateSold = ''
        //             }else{
        //                 this.dateSold = moment(h.dateSold).format('MM/DD/YYYY')
        //             }
        //         })
        //         return this.singleHouse = house
        //     })
        // },
        // deleteHouse (houseId) {
        //     (async () => {
        //         const response = await fetch(this.url + this.houseId, {
        //         method: 'DELETE'
        //         })
        //         .then(res => {

        //         })
        //         .catch(err => {
        //             this.snackbar = true
        //             this.snackbarColor = 'danger'
        //             this.snackbarText = 'House Deletion Failed. Retry.'
        //         })
        //         this.snackbar = true
        //         this.snackbarColor = 'success'
        //         this.snackbarText = 'House Successfully Deleted'
        //         this.$router.push('/')
        //     })();
        // },
        // editHouse () {
        //     (async () => {
        //         const response = await fetch(this.url + this.houseId, {
        //             method: 'PUT',
        //             headers: {
        //                 'Accept' : 'application/json',
        //                 'Content-Type' : 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 "houseId" : this.houseId,
        //                 "address" : this.singleHouse[0].address,
        //                 "zipcode" : this.singleHouse[0].zipcode,
        //                 "contractedPrice" : this.singleHouse[0].contractedPrice,
        //                 "contractDate" : this.singleHouse[0].contractDate,
        //                 "dateSold" : this.dateSold,
        //                 "sold" : this.sold,
        //                 "notes" : this.singleHouse[0].notes,
        //                 "pointOfContact" : this.singleHouse[0].pointOfContact,
        //                 "town" : this.singleHouse[0].town
        //             })
        //         });
        //         const data = await response.json()
        //         this.snackbar = true
        //         this.snackbarColor = 'success'
        //         this.snackbarText = 'House Successfully Edited'
        //         this.$router.push('/')
        //     })();
        // },
        // cancelEdit () {
        //     this.$router.push({name: 'singleHouse', params: {houseId: this.houseId }})
        // }
    }
}
</script>
<style>
.marginBottom {
  margin-bottom: 15px
}
img.preview {
  max-width:250px;
  max-height:250px;
}
</style>