<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> Product </h3>

        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field>

                <v-spacer></v-spacer>

                <v-btn color="success" dark @click="dialog = true">Tambah</v-btn>

            </v-card-title>
            <v-data-table :headers="headers" :items="products" :search="search">
                <template v-slot:[`item.actions`] = "{ item }">
                    <v-btn small class="mr-2" @click="editHandler(item)"> Edit </v-btn>
                    <v-btn small @click="deleteHandler(item.id)"> Delete </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Product</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.nama_barang" label="Nama Barang" required></v-text-field>
                        <v-text-field v-model="form.harga_barang" label="Harga Barang" required></v-text-field>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="327px">
            <div class="text-center">
                <v-sheet class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block" color="blue-grey darken-3" dark >
                    <div class="grey--text text--lighten-1 text-body-2 mb-4">
                        Are you sure you want to delete this Data?
                    </div>

                    <v-btn plain color="blue darken-1" @click="dialogConfirm = false">No</v-btn>
                    <v-btn plain color="blue darken-1" @click="deleteData">Yes</v-btn>
                </v-sheet> 
            </div>
        </v-dialog>
        <!-- <v-dialog v-model="dialogConfirm" max-width="500px">
            <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData">OK</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
        <!-- <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>

                <v-card-text>
                    Anda Yakin Ingin menghapus Kelas ini?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
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
                dialog: false,
                dialogConfirm: false,
                headers: [
                    {
                        text: "Nama Barang",
                        align: "start",
                        sortable: true,
                        value: "nama_barang",
                    },
                    { text: "Harga Barang", value: 'harga_barang' },
                    { text: "Actions", value: 'actions' },
                ],
                product: new FormData,
                products: [],
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
                var url = this.$api + '/product';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.products = response.data.data;
                })
            },

            save(){
                this.product.append('nama_barang', this.form.nama_barang);
                this.product.append('harga_barang', this.form.harga_barang);

                var url = this.$api + '/product/'
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

            update() {
                let newData = {
                    nama_barang : this.form.nama_barang,
                    harga_barang : this.form.harga_barang
                };
                var url = this.$api + '/product/' + this.editId;
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
                var url = this.$api + '/product/' + this.deleteId;
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
                this.form.nama_barang = item.nama_barang;
                this.form.harga_barang = item.harga_barang;
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