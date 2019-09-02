<template>
  <v-container fluid>
    <!--- Modal page: Add new person -->
    <div>
      <transition name="modal">
        <div v-if="isOpen">
          <div class="overlay" @click.self="isOpen = false;">
            <NewUser @closeModal="onAddUser" class="modal"/>
          </div>
        </div>
      </transition>
    </div>
    <!-----             -------->

    <v-row style="margin-bottom: 0px; height: 60px; margin-right: 5px;" dense>
      <v-col cols="12" md="10" sm="6" >
        <v-text-field v-model="searchVar"
        label="Pesquisar" placeholder="Nome, Data de Nascimento, CEP..." outlined></v-text-field>
      </v-col>
    </v-row>
    
    <v-row dense class="mt-5">

      <v-data-table style="max-width: 1000px; min-width: 1000px;"
      :headers="headers"
      :items="personList"
      :search="searchVar"
      no-data-text="Você ainda não tem nenhum cliente cadastrado."
      no-results-text="Sua busca não gerou nenhum resultado."
      locale="pt-BR"
      >
        <template v-slot:item.isActive="{item}">
          <v-icon medium :color="item.isActive ? 'green' : 'red'">{{ item.isActive ? 'fa-check' : 'fa-times' }}</v-icon>
        </template>

        <template v-slot:item.action="{item}">
          <v-icon
            small
            class="mr-2"
            @click="onEditTap(item)" disabled>
            {{ 'fa-edit '}}
          </v-icon>
          <v-tooltip top>
            <template v-slot:activator="{on}">
              <v-icon
                small :color="item.isActive ? '' : 'red'" v-on="on"
                @click="onDeleteTap(item)" :disabled="(item.isActive)">
                {{ 'fa-trash-alt '}}
              </v-icon>
            </template>
            <span style="font-size: 12px;">Excluir</span>
          </v-tooltip>
        </template>
      </v-data-table>

    </v-row>
    <v-row align="end" dense class="mt-5">
      <v-btn
        :color="$vuetify.theme.themes.light.primary"
        dark
        medium
        dense
        bottom
        right
        @click="onAddUser">
        Adicionar Cliente
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>

import NewUser from '../components/NewUser';

export default {
  components: {
    NewUser
  },
  data(){
    return {
      headers: [
        {
          text: 'Nome',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Data de Nascimento',
          align: 'center',
          sortable: true,
          value: 'birth'
        },
        {
          text: 'CEP',
          align: 'center',
          sortable: false,
          value: 'cep'
        },
        {
          text: 'Ativo?',
          align: 'center',
          sortable: false,
          value: 'isActive'
        },
        { 
          text: 'Ações',
          value: 'action',
          sortable: false
        },
      ],
      searchVar: '',
      isOpen: false,
      personList: this.$store.state.users,
    };
  },
  
  computed: {
    personListUpdated(){
      return this.$store.state.users;
    }
  },
  
  watch: {
    personListUpdated(newValue, oldValue){
      this.personList = newValue;
    }
  },


  methods: {

    onAddUser(){
      this.isOpen = !this.isOpen;
    },

    onDeleteTap(item){
        console.log(item._id);
        
        this.$api.delete(`/api/users/${item._id}`)
        .then( (res) => {
        this.$api.get('/api/users/').then( (res) => {
            this.$store.state.users = res.data;
            this.personList = res.data;
        }).catch( (err) => {});
        })
        .catch( (err) => {
        console.log('AXIOS DELETE - Error');
        console.log(err);
        });
    },

  }
}
</script>

<style scoped>

  .radio-btn label{
    font-size: 12px;
  }

  .modal {
  width: 500px;
  margin: 0px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px 3px;
  transition: all 0.2s ease-in;
  font-family: Helvetica, Arial, sans-serif;
}
.fadeIn-enter {
  opacity: 0;
}

.fadeIn-leave-active {
  opacity: 0;
  transition: all 0.2s step-end;
}

.fadeIn-enter .modal,
.fadeIn-leave-active.modal {
  transform: scale(1.1);
}
button {
  padding: 7px;
  margin-top: 10px;
  background-color: green;
  color: white;
  font-size: 1.1rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #00000094;
  z-index: 999;
  transition: opacity 0.2s ease;
}
 

</style>