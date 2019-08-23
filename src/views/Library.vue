<template>
  <v-container fluid>
    <!--- Modal page: Add new book -->
    <div>
      <transition name="modal">
        <div v-if="isOpen">
          <div class="overlay" @click.self="isOpen = false;">
            <NewBook @closeModal="onAddBook" class="modal"/>
          </div>
        </div>
      </transition>
    </div>
    <!-----             -------->

    <v-row style="margin-bottom: 0px; height: 60px; margin-right: 5px;" dense>
      <v-col cols="12" md="10" sm="6" >
        <v-text-field v-model="searchVar"
        label="Pesquisar" placeholder="Nome, Autor, Edição..." outlined></v-text-field>
      </v-col>
    </v-row>
    
    <v-row dense class="mt-5">

      <v-data-table style="max-width: 1000px; min-width: 1000px;"
      :headers="headers"
      :items="bookList"
      :search="searchVar"
      no-data-text="Você ainda não tem nenhum livro cadastrado."
      no-results-text="Sua busca não gerou nenhum resultado."
      locale="pt-BR"
      >
        <template v-slot:item.available="{item}">
          <v-chip :color="getColor(item.available)" dark>
            <v-icon small>{{ item.available ? 'fa-check' : 'fa-times' }}</v-icon>
          </v-chip>
        </template>

        <template v-slot:item.action="{item}">
          <v-icon
            small
            class="mr-2"
            @click="onEditTap(item)" disabled>
            {{ 'fa-edit '}}
          </v-icon>
          <v-icon
            small
            @click="onDeleteTap(item)">
            {{ 'fa-trash-alt '}}
          </v-icon>
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
        @click="onAddBook">
        Adicionar Livro
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>

import NewBook from '../components/NewBook';

export default {
  components: {
    NewBook
  },
  data(){
    return {
      headers: [
        {
          text: 'Nome',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Autor',
          align: 'left',
          sortable: false,
          value: 'author'
        },
        {
          text: 'Editora',
          align: 'left',
          sortable: false,
          value: 'publisher'
        },
        {
          text: 'Edição',
          align: 'center',
          sortable: true,
          value: 'edition'
        },
        {
          text: 'Quantidade',
          align: 'center',
          sortable: true,
          value: 'quantity'
        },
        {
          text: 'Disponibilidade',
          align: 'center',
          sortable: true,
          value: 'available'
        },
        { 
          text: 'Ações',
          value: 'action',
          sortable: false
        },
      ],
      searchVar: '',
      isOpen: false,
      bookList: this.$store.state.books,
    };
  },
  
  mounted(){
    setInterval(() => {
      this.bookList = this.$store.state.books;
      if(this.bookList.length)
        return;
    }, 30);
  },

  methods: {

    onAddBook(){
      this.isOpen = !this.isOpen;
    },

    onDeleteTap(item){
      this.$api.delete(`/api/books/${item._id}`)
      .then( (res) => {
        this.$api.get('/api/books/').then( (res) => {
          this.$store.state.books = res.data;
          this.bookList = res.data;
        }).catch( (err) => {});
      })
      .catch( (err) => {
        console.log('AXIOS DELETE - Error');
        console.log(err);
      });
    },

    getColor(boolean){
      return boolean ? 'green' : 'red'
    }

  }
}
</script>

<style lang="scss">

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