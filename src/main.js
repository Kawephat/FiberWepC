// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGoodTable from 'vue-good-table';
import * as VueGoogleMaps from "vue2-google-maps";



Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAyCEzPjAsjYJhqnH3Dug9FyWrw6QXXmhs",
    v: "3.30"
    // libraries: 'places', //// If you need to use place input
  }
});

Vue.use(VueGoodTable); 

Vue.use(VueAxios, axios)
// Vue.use(VueResource)
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
