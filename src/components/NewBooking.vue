<template>
    <v-container style="background-color: white;">
        <h1>Nova Reserva de Livro</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-autocomplete
            :items="bookList"
            item-text="name" no-data-text="Não tem nenhum livro disponível no momento."
            item-value="_id" :rules="notEmpty"
            label="Livro" required 
            v-model="selectedBook"
            ></v-autocomplete>

            <v-autocomplete
            :items="personList"
            label="Cliente" no-data-text="Não tem nenhum cliente cadastrado."
            item-text="name" :rules="notEmpty"
            item-value="_id" required
            v-model="selectedClient"
            ></v-autocomplete>

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
                    v-model="computedDateFormatted" placeholder="06/12/2019"
                    label="Data de Reserva*"
                    readonly required :rules="notEmpty"
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable :min="minDate" max="2030-12-31"
                locale="pt-br">
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                </v-date-picker>
            </v-dialog>

            <v-text-field v-model="duration" label="Duração (dias)*" :rules="durationRules"
            placeholder="1" required />

        </v-form>
        <div v-show="bookValue && duration" class="valuesDiv">
            <p id="to-be-paid">Valor: </p>
            <p id="subtotal">{{ bookValue }} x {{ duration + ' dia(s)' }}</p>
            <p class="ml-2"> = </p>
            <p id="total">{{ 'R$ ' + (bookValue * duration).toFixed(2)}}</p>
        </div>
        <v-alert
        ref="alert"
        v-model="alert"
        border="left"
        close-text="Close Alert"
        dark
        color="red accent-4"
        dismissible>
            {{ alertMessage }}
        </v-alert>
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
            alert: false,
            alertMessage: '',
            personList: this.$store.state.users,
            computedDateFormatted: '',
            modal: false,
            valid: true,
            selectedBook: '',
            selectedClient: '',
            bookValue: null,
            duration: '',
            date: '',
            minDate: '',
            notEmpty: [
                v => !!v || 'Este campo é obrigatório.'
            ],
            durationRules: [
                v => !!v || 'Este campo é obrigatório.',
                v => !isNaN(v) || 'Este valor precisa ser um número.',
                v => v > 0 || 'Este valor precisa ser um número positivo'
            ],
        };
    },

    mounted(){
        this.bookList = this.$store.state.books;

        this.minDate = new Date();
        this.minDate = moment(this.minDate).add(1, 'd').format('YYYY-MM-DD');
    },

    computed: {
        dateFormatted(){
            return this.formatDate(this.date);
        }
    },

    watch: {
        date(val){
            this.computedDateFormatted = this.formatDate(this.date);
        },

        selectedBook(val){
            if(val.length > 0){
                let book = this.$store.state.books.find( function(el){
                    return el._id === val;
                });

                this.bookValue = book.value.toFixed(2);
            }
        }
    },

    methods: {  

        onCloseTap(){
            this.$emit('closeModal');
        },

        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },

        onSaveTap(){
            if(this.$refs.form.validate()){
            
                let person = this.$store.state.users.find( (el) => {
                    return el._id === this.selectedClient;
                });

                let book = this.$store.state.books.find( (el) => {
                    return el._id === this.selectedBook;
                });

                let retrieveDate = moment(this.date);
                let deliveryDate = moment(retrieveDate).add(parseInt(this.duration)+1, 'd');

                let bookingValidation = this.$util.validateBooking(book, this.duration, 'booking', retrieveDate);
                if(bookingValidation){
                    this.alert = true;
                    this.alertMessage = bookingValidation;
                    return;
                }

                if(this.selectedBook && this.selectedClient && this.duration && this.date){
                    this.$api.post('/api/booking', {
                        bookId: this.selectedBook,
                        personId: this.selectedClient,
                        personName: person.name,
                        bookName: book.name,
                        retrieveDate: retrieveDate.format('DD/MM/YYYY'),
                        duration: this.duration,
                        delivery: deliveryDate.format('DD/MM/YYYY')
                    })
                    .then( (res) => {
                        this.$store.dispatch('registerBooking', res.data);
                        this.$util.updateStore();
                    })
                    .catch( () => {});

                    // After all the post...
                    this.$emit('closeModal');
                }
            }
        },

    }
}
</script>

<style>

    .valuesDiv{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
    }

    #to-be-paid{
        color: black;
        font-weight: bold;
    }

    #subtotal{
        font-size: 12px;
        margin-top: 5px;
        margin-left: 10px;
        padding-bottom: 5px;
    }

    #total{
        margin-top: 2px;
        margin-left: 10px;
        font-size: 18px;
        font-weight: 600;
    }

</style>