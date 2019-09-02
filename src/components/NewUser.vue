<template>
    <v-container style="background-color: white;">
        <h1>Adicionar Cliente</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-text-field v-model="name" placeholder="Alex Silva" :rules="notEmpty" 
            label="Nome*" required/>

            <v-text-field ref="txtBirth" v-model="birth" placeholder="06/05/1999"
             :rules="notEmpty" label="Data de Nascimento*" required @keyup="onBirthChange"/>

            <v-text-field v-model="cep" @keyup="onCepChange" placeholder="58045-130"
            :rules="notEmpty" label="CEP*" required/>
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
            modal: false,
            valid: true,
            name: '',
            birth: '',
            cep: '',
            notEmpty: [
                v => !!v || 'Este campo é obrigatório.'
            ],
            onlyNumberNotEmpty: [
                v => !!v || 'Este campo é obrigatório.',
                v => !isNaN(v) || 'Este valor precisa ser um número.',
            ],
        };
    },

    methods: {
        onCloseTap(){
            this.$emit('closeModal');
        },

        onBirthChange(){
            let mask = new StringMask('00/00/0000');
            let maskResult = mask.apply(this.birth.replace(/[\W_]/g, ""));

            if(this.birth !== maskResult)
                this.birth = maskResult;
        },

        onCepChange(){
            let mask = new StringMask('00000-000');
            let maskResult = mask.apply(this.cep.replace(/[\W_]/g, ""));

            if(this.cep !== maskResult)
                this.cep = maskResult;
        },

        onSaveTap(){
            if(this.$refs.form.validate()){
                this.$api.post('/api/users', {
                    name: this.name,
                    birth: this.birth,
                    cep: this.cep,
                })
                .then( (res) => {
                    this.$store.dispatch('registerUser', res.data);
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