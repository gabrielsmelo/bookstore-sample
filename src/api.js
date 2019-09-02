import Vue from 'vue'
import axios from 'axios'

const localHost = 'http://localhost:8888';
axios.defaults.baseURL = localHost;

Vue.use({
    install(Vue){
        Vue.prototype.$api = axios;
    }
})

export default axios;