<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> Wishlist </h3>

        <v-card class="grey lighten-3">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>

                <v-spacer></v-spacer>

                <!-- <v-btn color="green darken-4" dark @click="dialog = true">Jual</v-btn> -->

            </v-card-title>
            <v-data-table :headers="headers" :items="wishlists" :search="search">
                <template v-slot:[`item.actions`] = "{ item }">
                    <!-- <v-btn small class="mr-2" @click="editHandler(item)"> <v-icon color="green darken-4">mdi-pencil</v-icon> </v-btn> -->
                    <v-btn small class="mr-2" @click="deleteHandler(item.id)"> <v-icon color="red accent-4">mdi-delete</v-icon> </v-btn>
                    <!-- <v-btn small class="light-blue darken-4" @click="dialogAddToCart = true"><v-icon color="white">mdi-cart</v-icon></v-btn> -->
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="700px" >
            <v-card class="grey lighten-3">
                <v-card-title>
                    <span class="headline">{{ formTitle }} Jualan</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_barang" label="Nama Barang" required></v-text-field>
                        <v-text-field v-model="form.harga_barang" label="Harga Barang" required></v-text-field>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="green darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="327px">
            <div class="text-center">
                <v-sheet class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block" color="blue-grey darken-3" dark >
                    <div class="grey--text text--lighten-1 text-body-2 mb-4">
                        Yakin ingin hapus barang dari wishlist?
                    </div>

                    <v-btn plain color="blue darken-1" @click="dialogConfirm = false">No</v-btn>
                    <v-btn plain color="blue darken-1" @click="deleteData">Yes</v-btn>
                </v-sheet> 
            </div>
        </v-dialog>

        <v-dialog v-model="dialogAddToCart" persistent max-width="500px">
            <v-card>
                <v-card-title class="headline">Tambahkan barang ini ke Wishlist?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogAddToCart = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="addToCart">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog> 

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>

    </v-main>
</template>

<script>
    export default {
        name: "List",
        data(){
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                dialogAddToCart: false,
                headers: [
                    {
                        text: "Nama Barang",
                        align: "start",
                        sortable: true,
                        value: "namaBarang_wish",
                    },
                    { text: "Harga Barang", value: 'hargaBarang_wish' },
                    { text: "Actions", value: 'actions' },
                ],
                wishlist: new FormData,
                wishlists: [],
                form: { 
                    nama_barang: null,
                    harga_barang: null,
                },
                deleteId: '',
                editId: ''
            };
        },
        methods: {
            setForm() {
                if(this.inputType !== 'Tambah'){
                    this.update();
                }
                else{
                    this.save();
                }
            },
            // Read Data Product
            readData() {
                var url = this.$api + '/wishlist/'+ localStorage.getItem('id');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.wishlists = response.data.data;
                })
            },

            save(){
                this.wishlist.append('nama_barang', this.form.nama_barang);
                this.wishlist.append('harga_barang', this.form.harga_barang);

                var url = this.$api + '/wishlist/'
                this.load = true;
                this.$http.post(url, this.product, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = true;
                    this.close();
                    this.readData();
                    this.resetForm();
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            // update() {
            //     let newData = {
            //         nama_barang : this.form.nama_barang,
            //         harga_barang : this.form.harga_barang
            //     };
            //     var url = this.$api + '/product/' + this.editId;
            //     this.load = true;
            //     this.$http.put(url, newData, {
            //         headers: {
            //             'Authorization' : 'Bearer ' +localStorage.getItem('token')
            //         }
            //     }).then(response => {
            //         this.error_message = response.data.message;
            //         this.color = "green";
            //         this.snackbar = true;
            //         this.load = false;
            //         this.close();
            //         this.readData();
            //         this.resetForm();
            //         this.inputType = 'Tambah';
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.color = "red";
            //         this.snackbar = true;
            //         this.load = false;
            //     });
            // },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/wishlist/' + this.deleteId;
                this.load = true;
                this.$http.delete(url, {
                    headers: {
                        'Authorization' : 'Bearer ' +localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = "green";
                    this.snackbar = true;
                    this.load = false;
                    this.close();
                    this.readData();
                    this.resetForm();
                    this.inputType = "Tambah";
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            // editHandler(item) {
            //     this.inputType = 'Edit';
            //     this.editId = item.id;
            //     this.form.nama_barang = item.nama_barang;
            //     this.form.harga_barang = item.harga_barang;
            //     this.dialog = true;
            // },

            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.readData();
            },

            cancel() {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
                this.inputType = 'Tambah';
            },

            resetForm(){
                this.form = {
                    nama_barang: null,
                    harga_barang: null
                };
            },

            // addToCart(item){
            //     this.dialog = true;
            // },
        },

        computed: {
            formTitle() {
                return this.inputType;
            },
        },

        mounted() {
            this.readData();
        },
    };
</script>