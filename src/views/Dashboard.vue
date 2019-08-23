<template>
  <v-container>

    <!--- Modal page: Add new rent -->
    <div>
      <transition name="modal">
        <div v-if="isRentOpen">
          <div class="overlay" @click.self="isRentOpen = false;">
            <NewRent @closeModal="onRent" class="modal"/>
          </div>
        </div>
      </transition>
    </div>
    <!-----             -------->

    <!--- Modal page: Add new booking -->
    <div>
      <transition name="modal">
        <div v-if="isBookingOpen">
          <div class="overlay" @click.self="isBookingOpen = false;">
            <NewBooking @closeModal="onBooking" class="modal"/>
          </div>
        </div>
      </transition>
    </div>
    <!-----             -------->

    <v-card class="mb-10 mr-2">
      <v-card-title style="background-color: #12275a; color: white;">
        Movimentação prevista na Livraria nos próximos dias
      </v-card-title>
      <v-sparkline
        :value="value"
        :gradient="['#f16124', '#f19f24', '#204bb3']"
        :smooth="10 || false"
        :padding="10"
        :padding-bottom="5"
        :line-width="2"
        stroke-linecap="round"
        gradient-direction="top"
        :fill="false"
        type="trend"
        :auto-line-width="false"
        auto-draw
        :labels="['Hoje', 'Amanhã', '26/08', '27/08', '28/08', '01/09', '02/09', '03/09']"
        :label-size="4"
      ></v-sparkline>
    </v-card>
    <v-row inline>

      <!--- Alugueis --->
      <v-card cols="12" min-height="500" min-width="50%" max-width="50%">
        <v-card-title style="background-color: #12275a; color: white;">Aluguéis em Andamento</v-card-title>
        <v-data-table class="mt-2"
        :headers="rentHeaders"
        :items="rentList"
        :search="rentSearchVar"
        no-data-text="Você ainda não tem nenhum aluguel cadastrado."
        no-results-text="Sua busca não gerou nenhum resultado."
        locale="pt-BR"
        >
          <template v-slot:item.action="{item}">
            <v-icon
              small
              @click="onConcludeTap(item)">
              {{ 'fa-check '}}
            </v-icon>
          </template>
        </v-data-table>
      </v-card>

      <!-- Reservas --->
      <v-card class="ml-10" min-height="500" min-width="45%" max-width="45%">
        <v-card-title style="background-color: #12275a; color: white;">Reservas</v-card-title>
        <v-data-table class="mt-2"
        :headers="bookingHeaders"
        :items="bookingList"
        :search="bookingSearchVar"
        no-data-text="Você ainda não tem nenhuma reserva cadastrada."
        no-results-text="Sua busca não gerou nenhum resultado."
        locale="pt-BR"
        >
          <template v-slot:item.action="{item}">
            <v-icon
              small
              @click="onConcludeTap(item)">
              {{ 'fa-check '}}
            </v-icon>
          </template>
        </v-data-table>
      </v-card>

    </v-row>
    <v-speed-dial
      v-model="fab"
      bottom
      right
      fixed
      direction="top"
      class="mb-10"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          class="secondary"
          dark
          fab
          large
        >
          <v-icon v-if="fab">{{ 'fa-times' }}</v-icon>
          <v-icon v-else>{{ 'fa-plus' }}</v-icon>
        </v-btn>
      </template>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            dark
            medium
            class="primary"
            v-on="on"
            @click="onBooking"
          >
            <v-icon>{{ 'fa-bookmark' }}</v-icon>
          </v-btn>
        </template>
        <span>Reserva de Livro</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{on}">
          <v-btn
            fab
            medium
            class="primary"
            v-on="on"
            @click="onRent"
          >
            <v-icon light>{{ 'fa-clock' }}</v-icon>
          </v-btn>
        </template>
        <span>Aluguel de Livro</span>
      </v-tooltip>
    </v-speed-dial>
  </v-container>
</template>

<script>

import NewRent from '../components/NewRent';
import NewBooking from '../components/NewBooking';

export default {
  components: {
    NewRent,
    NewBooking
  },
  data(){
    return {
      fab: false,
      value: [0, 2, 5, 9, 8, 2, 9, 0],

      rentHeaders: [
        {
          text: 'Cliente',
          align: 'left',
          sortable: false,
          value: 'personName'
        },
        {
          text: 'Livro',
          align: 'left',
          sortable: false,
          value: 'bookName'
        },
        {
          text: 'Data de Devolução',
          align: 'left',
          sortable: true,
          value: 'delivery'
        },
        { 
          text: 'Concluir',
          value: 'action',
          sortable: false
        },
      ],
      rentSearchVar: '',
      isRentOpen: false,
      rentList: [], //TODO

      bookingHeaders: [
        {
          text: 'Cliente',
          align: 'left',
          sortable: false,
          value: 'personName'
        },
        {
          text: 'Livro',
          align: 'left',
          sortable: false,
          value: 'bookName'
        },
        {
          text: 'Data da Reserva',
          align: 'left',
          sortable: true,
          value: 'retrieveDate'
        },
        { 
          text: 'Concluir',
          value: 'action',
          sortable: false
        },
      ],
      bookingSearchVar: '',
      isBookingOpen: false,
      bookingList: [], //TODO
    };
  },

  mounted(){
    this.rentList = this.$store.state.bookings.filter( (el) => {
      return !el.retrieveDate;
    });

    console.log(this.rentList);

    this.bookingList = this.$store.state.bookings.filter( (el) => {
      return el.retrieveDate;
    });
  },

  methods: {
    onRent(){
      this.isRentOpen = !this.isRentOpen;
    },
    
    onBooking(){
      this.isBookingOpen = !this.isBookingOpen;
    },

    onConcludeTap(item){
      console.log('concluded', item);
    }
  }
};
</script>