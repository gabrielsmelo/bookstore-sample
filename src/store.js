import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    books: [],
    users: [],
    rents: [],
    bookings: [],
    fluxValues: []
  },

  mutations: {
    
    registerBook(state, bookObj) {
      state.books.push(bookObj);
    },
    
    registerUser(state, userObj) {
      state.users.push(userObj);
    },
    
    registerBooking(state, bookingObj) {
      let bookIndex = state.books.findIndex( (el) => {
        return el.name == bookingObj.bookName;
      });
      state.books[bookIndex].available = false;

      if(bookingObj.retrieveDate)
        state.bookings.push(bookingObj);
      else
        state.rents.push(bookingObj);
    },

    removeBooking(state, bookingObj){
      let bookingIndex = state.bookings.findIndex( (el) => {
        return el._id == bookingObj._id;
      });
      state.bookings.splice(bookingIndex);
    },

    registerFluxValues(state, values){
      state.fluxValues = values;
    }
  },

  actions: {
    registerBook: ({commit}, bookObj) => {
      commit('registerBook', bookObj);
    },
   
    registerUser: ({commit}, userObj) => {
      commit('registerUser', userObj);
    },
   
    registerBooking: ({commit}, bookingObj) => {
      commit('registerBooking', bookingObj);
    },

    removeBooking: ({commit}, bookingObj) => {
      commit('removeBooking', bookingObj);
    },

    registerFluxValues({commit}, values){
      commit('registerFluxValues', values);
    }
  }
})
