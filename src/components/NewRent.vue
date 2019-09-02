<template>
    <v-container style="background-color: white;">
        <h1>Novo Aluguel de Livro</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-autocomplete
            v-model="selectedBook"
            :items="bookList" no-data-text="Não tem nenhum livro disponível no momento."
            item-text="name" :rules="notEmpty"
            item-value="_id" required
            label="Livro*" validate-on-blur
            ></v-autocomplete>

            <v-autocomplete
            :items="personList"
            label="Cliente*" no-data-text="Não tem nenhum cliente cadastrado."
            item-text="name" :rules="notEmpty"
            item-value="_id" required
            v-model="selectedClient"
            ></v-autocomplete>

            <v-text-field v-model="duration" label="Duração (dias)*" :rules="onlyNumberNotEmpty"
             placeholder="1" required/>

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
            personList: this.$store.state.users,
            alert: false,
            alertMessage: '',
            modal: false,
            valid: true,
            selectedBook: '',
            selectedClient: '',
            bookValue: null,
            duration: '',
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
        this.bookList = this.$store.state.books;
    },

    watch: {
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

        formatDate(date) {
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

                let bookingValidation = this.$util.validateBooking(book, this.duration, 'rent');
                if(bookingValidation){
                    this.alert = true;
                    this.alertMessage = bookingValidation;
                    return;
                }

                let newDate = new Date();
                newDate.setHours(0,0,0,0);
                newDate = moment(newDate).add(parseInt(this.duration) + 1, 'd');

                if(this.selectedBook && this.selectedClient && this.duration){
                    this.$api.post('/api/booking', {
                        bookId: this.selectedBook,
                        personId: this.selectedClient,
                        personName: person.name,
                        bookName: book.name,
                        delivery: newDate.format('DD/MM/YYYY'),
                        duration: this.duration
                    })
                    .then( (res) => {
                        this.$store.dispatch('registerBooking', res.data);
                        this.$util.updateStore();
                    })
                    .catch( (err) => {console.log('Saving Booking Error: ' + err)});

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