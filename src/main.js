import Vue from 'vue'
import app from './app'
import axios from 'axios'
import router from './router'

Vue.config.productionTip = false

//  全局配置axios
axios.defaults.baseURL = 'http://rest.promotion.baobeituan.com/card'
axios.defaults.withCredentials = true
/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<app/>',
    components: {
        app
    },
    router
})
