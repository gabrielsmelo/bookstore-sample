<template>
    <v-container style="background-color: white;">
        <h1>Novo aluguel de livro</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-select
            v-model="selectedBook"
            :items="bookList"
            item-text="name"
            item-value="_id"
            label="Livro*" validate-on-blur
            ></v-select>

            <v-select
            :items="personList"
            label="Cliente*"
            item-text="name"
            item-value="_id"
            v-model="selectedClient"
            ></v-select>

            <v-select
            :items="[7, 14, 21, 30]"
            label="Duração (dias)*"
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

            let newDate = new Date();
            newDate.setDate(newDate.getDate() + this.duration);
            
            moment.locale('pt-BR');
            newDate = moment(newDate).format('L');

            if(this.selectedBook && this.selectedClient && this.duration){
                this.$api.post('/api/booking', {
                    bookId: this.selectedBook,
                    personId: this.selectedClient,
                    personName: person.name,
                    bookName: book.name,
                    delivery: newDate,
                    duration: this.duration
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