<template>
    <v-container style="background-color: white;">
        <h1>Adicionar Cliente</h1>
        <v-form class="mt-5" ref="form" v-model="valid" :lazy-validation="true">
            <v-text-field v-model="name" placeholder="Alex Silva" :rules="notEmpty" 
            label="Nome*" required/>
            <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="birth"
                persistent
                full-width
                width="290px"
            >
                <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="birth" placeholder="06/05/1999"
                    label="Data de Nascimento*"
                    readonly required
                    v-on="on"
                ></v-text-field>
                </template>
                <v-date-picker v-model="birth" scrollable>
                    <div class="flex-grow-1"></div>
                    <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(birth)">OK</v-btn>
                </v-date-picker>
            </v-dialog>
            <v-text-field v-model="cep" placeholder="58045-130" :rules="notEmpty" label="CEP*" required/>
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

        formatDate(date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },

        onSaveTap(){
            if(this.$refs.form.validate()){
                this.$api.post('/api/users', {
                    name: this.name,
                    birth: this.formatDate(this.birth),
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