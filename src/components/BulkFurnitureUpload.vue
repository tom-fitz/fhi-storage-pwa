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
                <input type="file" ref="file" multiple accept="image/*" @change="handleSelects" name="images">
            </v-card-text>
        </v-card>
        <v-spacer></v-spacer>
        <v-card>
            <div v-if="loader" style="text-align:center">
                <v-progress-circular
                indeterminate
                color="#71eeb8"
                ></v-progress-circular>
            </div>
            <div v-if="!loader" style="text-align:center">
                <v-card-text v-for="(image, i) in images" :key="i">
                    <img :src="image" class="preview">
                </v-card-text>
                <v-card-text v-if="images.length > 0">
                    <v-btn 
                        color="orange" 
                        x-large 
                        light
                        @click="uploadFiles()"
                        :loading="loader"
                    >
                        Save
                    </v-btn>
                </v-card-text>
            </div>
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
            furnitureIds: [],
            imagesLength: 0,
            loader: false,
            url: 'https://fhistorage-api.azurewebsites.net/api/furniture/bulk',
            imageUrl: 'https://fhistorage-api.azurewebsites.net/api/image/bulk'
        }
    },
    computed: {
        computedContractDate () {
            return this.contractDate ? moment(this.contractDate).format('MM/DD/YYYY') : ''
        },
        computedSoldDate () {
            return this.dateSold ? moment(this.dateSold).format('MM/DD/YYYY') : ''
        },
    },
    methods: {
        handleSelects(e) {
            this.images = []
            let fileList = Array.prototype.slice.call(e.target.files);

            fileList.forEach(f => {

                if(!f.type.match("image.*")) {
                        return;
                    }
                            
                let reader = new FileReader();
                let vm = this;
                reader.onload = function (e) {
                vm.images.push(e.target.result);

                }
                reader.readAsDataURL(f); 
            });
            this.imagesLength = this.$refs.file.files.length
        },
        uploadFiles(){
            (async () => {
                this.loader = true
                const response = await fetch(this.url + '/' + this.imagesLength + '/' + this.houseId, {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                const data = await response.json()
                
                data.forEach((e) => {
                    this.furnitureIds.push(e.furnitureId)
                })

                this.uploadBulkImages()

                this.loader = false

                this.$router.push({name: 'singleHouse', params: { id: this.houseId }})

            })();
        },
        uploadBulkImages(){
            let formData = new FormData()

            for(var i=0;i<this.imagesLength;i++){
                let file = this.$refs.file.files[i]
                formData.append('Image', file)
                formData.append('FurnitureId', this.furnitureIds[i])
            }

            let request = new XMLHttpRequest()
            request.open('POST', this.imageUrl)
            request.send(formData)
        },
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