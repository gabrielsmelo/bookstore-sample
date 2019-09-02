<template>
  <v-app light>
    <v-app-bar app clipped-left :style="{background: $vuetify.theme.themes.light.background}">
      <v-icon large light color="#f16124" >{{ icon }}</v-icon>
      <h1 style="margin-left: 0.5em;" class="app-title">Vox Bookstore</h1>
    </v-app-bar>

    <v-navigation-drawer clipped app :mini-variant="isMobile" permanent>
      <v-list>
        <v-list-item v-for="item in menuList" :key="item.title" link :to="item.link" active-class="bold-text">
          <v-list-item-icon>
            <v-icon small color='#12275a'>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- Because of using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app absolute :style="{background: $vuetify.theme.themes.light.footerBackground}">
      <p style="margin: 0px; padding: 0px; font-size: 1em;" class="app-title">Gabriel Soares - 2019 ©</p>
    </v-footer>
  </v-app>
</template>

<script>

  export default {
    name: 'App',
    components: {
    },

    data: () => ({
      icon: 'fa-book',
      menuList: [
        { icon: 'fa-tachometer-alt', title: 'Dashboard', link: '/dashboard'},
        { icon: 'fa-book-open', title: 'Biblioteca', link: '/biblioteca'},
        { icon: 'fa-users', title: 'Clientes', link: '/clientes'}
      ]
    }),

    computed: {
      isMobile(){
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
      }
    },

    async created(){
      /* Getting API data */
      // Books
      await this.$api.get('/api/books')
      .then(res => {
        this.$store.state.books = res.data;
      })
      .catch(err => {
        console.log('API Error:', err);
      });

      // Users
      await this.$api.get('/api/users')
      .then(res => {
        this.$store.state.users = res.data;
      })
      .catch(err => {
        console.log('API Error:', err);
      });

      // Booking
      await this.$api.get('/api/booking')
      .then(res => {
        this.$store.state.rents = res.data.filter( (el) => {
        return !el.retrieveDate;
        });

        this.$store.state.bookings = res.data.filter( (el) => {
          return el.retrieveDate;
        });
      })
      .catch(err => {
        console.log('API Error:', err);
      });

      // Flux on next days
      this.$util.movementOnNextDays();
    },

    methods: {
      
    }
  };
</script>

<style lang="scss" scoped>

  .app-title{
    font-family: Lato;
    font-weight: 400;
    color: white;
  }

  .bold-text{
    font-weight: bold;
    color: #12275a;
  }

</style>
