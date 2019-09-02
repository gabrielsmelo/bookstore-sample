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
        :value="fluxValues"
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
        :labels="fluxDays"
        :label-size="4"
      ></v-sparkline>
    </v-card>
    <v-row inline>

      <!--- Alugueis --->
      <v-card cols="12" min-height="500" min-width="45%" max-width="45%" class="ml-3">
        <v-card-title style="background-color: #12275a; color: white;">Aluguéis em Andamento</v-card-title>
        
        <v-text-field 
        v-model="rentSearchVar"
        single-line 
        hide-details
        label="Procurar"
        prepend-icon="fa-search"
        class="ml-5" style="max-width: 90%;">
        </v-text-field>

        <v-data-table class="mt-5"
        :calculate-widths="true"
        :headers="rentHeaders"
        :items="rentList"
        :search="rentSearchVar"
        no-data-text="Você ainda não tem nenhum aluguel cadastrado."
        no-results-text="Sua busca não gerou nenhum resultado."
        locale="pt-BR"
        >
          <template v-slot:item.value="{item}">
            <span style="color: green; font-weight: bold;">
              R$ {{ item.value.toFixed(2) }}
            </span>
          </template>

          <template v-slot:item.action="{item}">
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-icon
                  small color="green" v-on="on"
                  @click="onConcludeRentTap(item)">
                  {{ 'fa-check '}}
                </v-icon>
              </template>
              <span style="font-size: 12px;">Livro Devolvido</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>

      <!-- Reservas --->
      <v-card class="ml-5" min-height="500" min-width="50%" max-width="50%">
        <v-card-title style="background-color: #12275a; color: white;">Reservas</v-card-title>
        <v-text-field 
        v-model="bookingSearchVar"
        single-line 
        hide-details
        label="Procurar"
        prepend-icon="fa-search"
        class="ml-5" style="max-width: 90%;">
        </v-text-field>
        <v-data-table class="mt-5"
        :calculate-widths="true"
        :headers="bookingHeaders"
        :items="bookingList"
        :search="bookingSearchVar"
        no-data-text="Você ainda não tem nenhuma reserva cadastrada."
        no-results-text="Sua busca não gerou nenhum resultado."
        locale="pt-BR"
        >
          <template v-slot:item.action="{item}">
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-icon
                  small :color="acceptableDate(item.retrieveDate) ? '' : 'green'" v-on="on" 
                  :disabled="acceptableDate(item.retrieveDate)"
                  @click="onConcludeBookingTap(item)">
                  {{ 'fa-check '}}
                </v-icon>
              </template>
              <span style="font-size: 12px;">Entregue ao Cliente</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on}">
                <v-icon
                  small class="ml-5" color="red" v-on="on"
                  @click="onCancelBookingTap(item)">
                  {{ 'fa-times '}}
                </v-icon>
              </template>
              <span style="font-size: 12px;">Cancelar Reserva</span>
            </v-tooltip>
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
      class="mb-10 test"
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
      <v-btn
        fab
        dark
        medium
        class="primary"
        @click="onBooking"
      >
        <v-icon>{{ 'fa-bookmark' }}</v-icon>
      </v-btn>
      <span class="fab-btn-name">Reserva</span>
      <v-btn
        fab
        medium
        class="primary"
        @click="onRent"
      >
        <v-icon light>{{ 'fa-clock' }}</v-icon>
      </v-btn>
      <span class="fab-btn-name">Aluguel</span>
    </v-speed-dial>
  </v-container>
</template>

<script>

import NewRent from '../components/NewRent';
import NewBooking from '../components/NewBooking';
import moment from 'moment';

export default {
  components: {
    NewRent,
    NewBooking
  },
  data(){
    return {
      show: true,
      fab: false,
      fluxValues: [0, 0, 0, 0, 0, 0, 0],
      fluxDays: ['Hoje', 'Amanhã', '-', '-', '-', '-'],

      rentHeaders: [
        {
          text: 'Cliente',
          align: 'left',
          sortable: true,
          value: 'personName',
          fixed: true
        },
        {
          text: 'Livro',
          align: 'left',
          sortable: true,
          value: 'bookName',
          fixed: true
        },
        {
          text: 'Data de Devolução',
          align: 'left',
          sortable: true,
          value: 'delivery',
          fixed: true
        },
        {
          text: 'Valor',
          align: 'center',
          sortable: true,
          value: 'value'
        },
        { 
          text: 'Concluir',
          align: 'center',
          value: 'action',
          sortable: false,
          width: '80px',
          fixed: true
        }
      ],
      rentSearchVar: '',
      isRentOpen: false,
      rentList: this.$store.state.rents, //TODO

      bookingHeaders: [
        {
          text: 'Cliente',
          align: 'left',
          sortable: true,
          value: 'personName',
          fixed: true
        },
        {
          text: 'Livro',
          align: 'left',
          sortable: true,
          value: 'bookName',
          fixed: true
        },
        {
          text: 'Data da Reserva',
          align: 'left',
          sortable: true,
          value: 'retrieveDate',
          fixed: true
        },
        {
          text: 'Data da Devolução',
          align: 'left',
          sortable: true,
          value: 'delivery',
          fixed: true
        },
        { 
          text: 'Ações',
          align: 'center',
          value: 'action',
          sortable: false,
          width: '80px'
        },
      ],
      bookingSearchVar: '',
      isBookingOpen: false,
      bookingList: this.$store.state.bookings, //TODO
    };
  },

  async mounted() {
    // Will provide daily flux and available books
    let nextDays = this.$util.nextDays();
    this.fluxDays = nextDays.map(el => el.formattedDate);
    this.$util.movementOnNextDays();
  },

  computed: {
    bookingListUpdated(){
      return this.$store.state.bookings;
    },

    rentListUpdated(){
      return this.$store.state.rents;
    },

    fluxValuesUpdated(){
      return this.$store.state.fluxValues;
    }
  },
  
  watch: {
    bookingListUpdated(newValue, oldValue){
      this.bookingList = newValue;
    },

    rentListUpdated(newValue, oldValue){
      this.rentList = newValue;
    },

    fluxValuesUpdated(newValue, oldValue){
      this.fluxValues = newValue;
    },

  },

  methods: {

    acceptableDate(date){
      let todayDate = new Date();
      let parts = date.split("/");
      let retDate = new Date(parts[2], parts[1] - 1, parts[0]);
      if(moment(retDate).format('DD/MM/YYYY') == moment(todayDate).format('DD/MM/YYYY'))
        return false;
      else
        return true;
    },

    onRent(){
      this.isRentOpen = !this.isRentOpen;
    },
    
    onBooking(){
      this.isBookingOpen = !this.isBookingOpen;
    },

    onConcludeRentTap(item){
      this.onCancelBookingTap(item);
    },

    onConcludeBookingTap(item){
      this.$api.put(`/api/booking/${item._id}`, {retrieveDate: null})
        .then( () => {
          this.$util.updateStore();
        })
        .catch( (err) => {
        console.log('AXIOS DELETE - Error');
        console.log(err);
        });
    },

    onCancelBookingTap(item){
      this.$api.delete(`/api/booking/${item._id}`)
        .then( () => {
          this.$util.updateStore();
        })
        .catch( (err) => {
        console.log('AXIOS DELETE - Error');
        console.log(err);
        });
    }
  }
};
</script>

<style scoped>

  .fab-btn-name{
    font-size: 12px;
    font-weight: 300;
    color: white;
    background-color: #232020;
    padding: 0 5px;
    border-radius: 4px;

  }

</style>