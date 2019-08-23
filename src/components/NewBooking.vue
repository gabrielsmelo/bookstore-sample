<template>
    <v-container style="background-color: white;">
        <h1>Nova Reserva de livro</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-select
            :items="bookList"
            item-text="name"
            item-value="_id"
            label="Livro" required
            v-model="selectedBook"
            ></v-select>

            <v-select
            :items="personList"
            label="Cliente"
            item-text="name"
            item-value="_id" required
            v-model="selectedClient"
            ></v-select>

            <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                full-width
                width="290px"
            >
                <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="date" placeholder="06/12/2019"
                    label="Data de Reserva*"
                    readonly required
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable min="2019-08-24" max="2030-12-31">
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                </v-date-picker>
            </v-dialog>

            <v-select
            :items="[7, 14, 21, 30]"
            label="Duração (dias)" required
            v-model="duration"
            ></v-select>

        </v-form>
        <v-row row justify="end">
            <v-btn color="secondary" @click="onSaveTap()">Salvar</v-btn>
            <v-btn color="primary" class="ml-2" @click="onCloseTap()">Cancelar</v-btn>
        </v-row>
    </v-container>
</template>

<script>

import moment from 'moment';

export default {
    data(){
        return{
            bookList: [],
            personList: this.$store.state.users,
            modal: false,
            valid: true,
            selectedBook: '',
            selectedClient: '',
            duration: '',
            date: '',
            notEmpty: [
                v => !!v || 'Este campo é obrigatório.'
            ],
            onlyNumberNotEmpty: [
                v => !!v || 'Este campo é obrigatório.',
                v => !isNaN(v) || 'Este valor precisa ser um número.',
            ],
        };
    },

    mounted(){
        this.bookList = this.$store.state.books.filter( (el) => {
            return el.available === true;
        });
    },

    methods: {  

        onCloseTap(){
            this.$emit('closeModal');
        },

        formatDate(date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },

        onSaveTap(){
            let person = this.$store.state.users.find( (el) => {
                return el._id === this.selectedClient;
            });

            let book = this.$store.state.books.find( (el) => {
                return el._id === this.selectedBook;
            });

            let newDate = this.date;
            newDate = new Date(this.date);
            newDate.setDate(newDate.getDate() + this.duration+1);
            
            moment.locale('pt-BR');
            newDate = moment(newDate).format('L');

            if(this.selectedBook && this.selectedClient && this.duration && this.date){
                this.$api.post('/api/booking', {
                    bookId: this.selectedBook,
                    personId: this.selectedClient,
                    personName: person.name,
                    bookName: book.name,
                    retrieveDate: moment(this.date).format('L'),
                    delivery: newDate,
                })
                .then( (res) => {
                    this.$store.dispatch('registerBooking', res.data);
                })
                .catch( () => {});

                // After all the post...
                this.$emit('closeModal');
            }
        },

    }
}
</script>

<style>

</style>