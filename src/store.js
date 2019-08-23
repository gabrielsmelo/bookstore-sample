import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    books: [],
    users: [],
    bookings: []
  },

  mutations: {
    
    registerBook(state, bookObj) {
      state.books.push(bookObj);
    },
    
    registerUser(state, userObj) {
      state.users.push(userObj);
    },
    
    registerBooking(state, bookingObj) {
      state.bookings.push(bookingObj);
    },

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
  }
})
