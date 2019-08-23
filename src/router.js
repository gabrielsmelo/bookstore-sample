import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Library from './views/Library.vue'
import Clients from './views/Clients.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/biblioteca',
      name: 'biblioteca',
      component: Library
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Clients
    }
  ]
})
