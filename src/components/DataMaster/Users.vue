<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> User Profile </h3>

        <v-card>
            <v-list-item three-line>
                <v-list-item-content>
                    <v-list-item-title class="headline mb-1 text-left">
                        Nama : {{ users.name }}
                    </v-list-item-title>
                    <v-list-item-title class="headline mb-1 text-left">
                        Email : {{ users.email }}
                    </v-list-item-title>
                    <v-list-item-title class="headline mb-1 text-left">
                        Username : {{ users.username }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-card-title>
                <!-- <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details>
                </v-text-field> -->
                <v-spacer></v-spacer>
                <!-- <v-row justify="end"> -->
                    <v-btn color="success" dark @click="dialog = true, editHandler(users)" >Edit</v-btn>
                <!-- </v-row> -->
                
            </v-card-title>
            
            
        </v-card>

        <v-dialog v-model="dialog" persistent width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} User</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.name" label="Nama User" required></v-text-field>
                        <v-text-field v-model="form.email" label="Email User" required></v-text-field>
                        <v-text-field v-model="form.username" label="Email User" required></v-text-field>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- <v-dialog v-model="dialogConfirm" persistent max-width="327px">
            <div class="text-center">
                <v-sheet class="px-7 pt-7 pb-4 mx-auto text-center d-inline-block" color="blue-grey darken-3" dark >
                    <div class="grey--text text--lighten-1 text-body-2 mb-4">
                        Are you sure you want to delete this Data?
                    </div>

                    <v-btn plain color="blue darken-1" @click="dialogConfirm = false">No</v-btn>
                    <v-btn plain color="blue darken-1" @click="deleteData">Yes</v-btn>
                </v-sheet> 
            </div>
        </v-dialog> -->
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
                inputType: 'Edit',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                headers: [
                    {
                        text: "Nama User",
                        align: "start",
                        sortable: true,
                        value: "name",
                    },
                    { text: "Email User", value: 'email' },
                    { text: "Username", value: 'username' },
                    { text: "Actions", value: 'actions' },
                ],
                user: new FormData,
                users: [],
                form: { 
                    name: null,
                    email: null,
                    username: null,
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
                var url = this.$api + '/getuser/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.users = response.data.data;
                })
            },

            // save(){
            //     this.user.append('name', this.form.name);
            //     this.user.append('email', this.form.email);
            //     this.user.append('username', this.form.username);

            //     var url = this.$api + '/updateprofile/{id}'
            //     this.load = true;
            //     this.$http.post(url, this.user, {
            //         headers: {
            //             'Authorization' : 'Bearer ' + localStorage.getItem('token'),
            //         }
            //     }).then(response => {
            //         this.error_message = response.data.message;
            //         this.color = "green";
            //         this.snackbar = true;
            //         this.load = true;
            //         this.close();
            //         this.readData();
            //         this.resetForm();
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.color = "red";
            //         this.snackbar = true;
            //         this.load = false;
            //     });
            // },

            update() {
                let newData = {
                    name : this.form.name,
                    email : this.form.email,
                    username : this.form.username
                };
                var url = this.$api + '/updateprofile/' + localStorage.getItem('id');
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

            // deleteData(){
            //     // Menghapus Data
            //     var url = this.$api + '/product/' + this.deleteId;
            //     this.load = true;
            //     this.$http.delete(url, {
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
            //         this.inputType = "Tambah";
            //     }).catch(error => {
            //         this.error_message = error.response.data.message;
            //         this.color = "red";
            //         this.snackbar = true;
            //         this.load = false;
            //     });
            // },

            editHandler(users) {
                this.inputType = 'Edit';
                this.editId = users.id;
                this.form.name = users.name;
                this.form.email = users.email;
                this.form.username = users.username;
                this.dialog = true;
            },

            // deleteHandler(id) {
            //     this.deleteId = id;
            //     this.dialogConfirm = true;
            // },

            close(){
                this.dialog = false;
                this.dialogConfirm = false;
                this.readData();
            },

            cancel() {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.dialogConfirm = false;
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