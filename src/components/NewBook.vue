<template>
    <v-container style="background-color: white;">
        <h1>Adicionar Livro</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-text-field v-model="name" placeholder="Harry Potter e a Pedra Filosofal" :rules="notEmpty" 
            label="Nome*" required/>
            <v-text-field v-model="author" placeholder="J.K Rowling" :rules="notEmpty" label="Autor*" required/>
            <v-text-field v-model="publisher" placeholder="Rocco" :rules="notEmpty" label="Editora*" required/>
            <v-text-field v-model="edition" placeholder="1998" :rules="onlyNumberNotEmpty" label="Edição*" required/>
            <v-text-field v-model="quantity" label="Quantidade" :rules="onlyNumberNotZero" placeholder="1" required/>
            <div id="value-form">
                <p id="value-cipher">R$</p>
                <v-text-field v-model="value" label="Valor do Aluguel (por dia)" @keypress="onValueChanged"
                :rules="notEmpty" placeholder="1,00" required/>
            </div>
        </v-form>
        <v-row row justify="end">
            <v-btn color="secondary" @click="onSaveTap()">Salvar</v-btn>
            <v-btn color="primary" class="ml-2" @click="onCloseTap()">Cancelar</v-btn>
        </v-row>
    </v-container>
</template>

<script>

import StringMask from 'string-mask';

export default {
    data(){
        return{
            valid: true,
            name: '',
            author: '',
            publisher: '',
            edition: '',
            quantity: 1,
            value: '',
            notEmpty: [
                v => !!v || 'Este campo é obrigatório.'
            ],
            onlyNumberNotEmpty: [
                v => !!v || 'Este campo é obrigatório.',
                v => !isNaN(v) || 'Este valor precisa ser um número.',
                v => v < 2019 || 'O valor precisa ser um ano válido.'
            ],
            onlyNumberNotZero: [
                v => !isNaN(v) || 'Este valor precisa ser um número.',
                v => v > 0 || 'O valor precisa ser maior que zero.'
            ]
        };
    },

    methods: {
        onCloseTap(){
            this.$emit('closeModal');
        },

        onValueChanged(){
            let mask = new StringMask('0,0', {reverse: true});
            let maskResult = mask.apply(parseInt(this.value.replace(/[\W_]/g, "")));
            
            if(this.value !== maskResult)
                this.value = maskResult;
        },

        onSaveTap(){
            let rentValue = this.value.replace(',', '.');
            if(this.$refs.form.validate()){
                this.$api.post('/api/books', {
                    name: this.name,
                    author: this.author,
                    publisher: this.publisher,
                    edition: this.edition,
                    quantity: this.quantity,
                    value: rentValue
                })
                .then( (res) => {
                    this.$store.dispatch('registerBook', res.data);
                })
                .catch( (err) => {console.log(err)});

                // After all the post...
                this.$emit('closeModal');
            }
        }
    }
}
</script>

<style>

#value-form{
    display: flex;
}

#value-cipher{
    margin-top: 20px;
    margin-right: 4px;
}

</style>