<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5>Toko mitra kami </h3>

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

                <v-btn color="green darken-4" dark @click="dialog = true">Tambah Toko</v-btn>

            </v-card-title>
            <v-data-table :headers="headers" :items="tokos" :search="search">
                <template v-slot:[`item.actions`] = "{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)"> <v-icon color="green darken-4">mdi-pencil</v-icon> </v-btn>
                    <v-btn small class="mr-2" @click="deleteHandler(item.id)"> <v-icon color="red accent-4">mdi-delete</v-icon> </v-btn>
                    <!-- <v-btn small class="light-blue darken-4" @click="addToCart(item)"><v-icon color="white">mdi-cart</v-icon></v-btn> -->
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="700px" >
            <v-card class="grey lighten-3">
                <v-card-title>
                    <span class="headline">{{ formTitle }} Toko</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_toko" label="Nama Toko" required></v-text-field>
                        <v-text-field v-model="form.alamat_toko" label="Alamat Toko" required></v-text-field>
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
                        Yakin ingin hapus Toko ini?
                    </div>

                    <v-btn plain color="blue darken-1" @click="dialogConfirm = false">No</v-btn>
                    <v-btn plain color="blue darken-1" @click="deleteData">Yes</v-btn>
                </v-sheet> 
            </div>
        </v-dialog>

        <!-- <v-dialog v-model="dialogAddToCart" persistent max-width="500px">
            <v-card>
                <v-card-title class="headline">Tambahkan barang ini ke Wishlist?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogAddToCart = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="addToCart">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog> -->

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
                idUser: 0,
                dialog: false,
                dialogConfirm: false,
                dialogAddToCart: false,
                tempCart: {
                    id_barang: null,
                    id_user: null,
                    namaBarang_wish: null,
                    hargaBarang_wish: null
                },
                headers: [
                    {
                        text: "Nama Toko",
                        align: "start",
                        sortable: true,
                        value: "nama_toko",
                    },
                    { text: "Alamat Toko", value: 'alamat_toko' },
                    { text: "Actions", value: 'actions' },
                ],
                toko: new FormData,
                tokos: [],
                form: { 
                    nama_toko: null,
                    alamat_toko: null,
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
                var url = this.$api + '/toko';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.tokos = response.data.data;
                })
            },

            // addToCart(item){
            //     this.tempCart.id_barang = item.id; 
            //     this.tempCart.id_user = this.idUser;
            //     this.tempCart.namaBarang_wish = item.nama_barang;
            //     this.tempCart.hargaBarang_wish = item.harga_barang;
            //     // console.log(this.id);
            //     console.log(this.tempCart.hargaBarang_wish);
            //     console.log(this.tempCart.namaBarang_wish);

            //     var url = this.$api + '/wishlist/'
            //     this.load = true;
            //     this.$http.post(url, this.tempCart, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token'),
            //         }
            //     }).then(response => {
            //         this.error_message = response.data.message;
            //         this.color = "green";
            //         this.snackbar = true;
            //         this.load = true;
            //         this.dialogAddToCart = false;
            //         this.readData();
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.color = "red";
            //         this.snackbar = true;
            //         this.load = false;
            //     });
            // },

            // CartHandler(item){
            //     // this.tempCart.id_user = this.idUser;
            //     // this.tempCart.id_barang = item.id;
            //     // this.tempCart.namaBarang_wish = item.nama_barang;
            //     // this.tempCart.hargaBarang_wish = item.harga_barang;
            //     // console.log(this.tempCart.id_barang);
            //     // this.dialogAddToCart = true;
            //     this.addToCart(item);
            // },

            save(){
                this.toko.append('nama_toko', this.form.nama_toko);
                this.toko.append('alamat_toko', this.form.alamat_toko);

                var url = this.$api + '/toko'
                this.load = true;
                this.$http.post(url, this.toko, {
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

            update() {
                let newData = {
                    nama_toko : this.form.nama_toko,
                    alamat_toko : this.form.alamat_toko
                };
                var url = this.$api + '/toko/' + this.editId;
                this.load = true;
                this.$http.put(url, newData, {
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
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },

            deleteData(){
                // Menghapus Data
                var url = this.$api + '/toko/' + this.deleteId;
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

            editHandler(item) {
                this.inputType = 'Edit';
                this.editId = item.id;
                this.form.nama_toko = item.nama_toko;
                this.form.alamat_toko = item.alamat_toko;
                this.dialog = true;
            },

            deleteHandler(id) {
                this.deleteId = id;
                this.dialogConfirm = true;
            },

            close(){
                this.dialog = false;
                this.inputType = 'Tambah';
                this.dialogConfirm = false;
                this.dialogAddToCart = false;
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
                    nama_toko: null,
                    alamat_toko: null
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
            this.idUser = localStorage.getItem('id');
        },
    };
</script>