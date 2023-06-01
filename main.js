

import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import store from './store'
App.mpType = 'app'


import { request,upload } from './common/request/index.js'
Vue.prototype.$request = request
Vue.prototype.$upload = upload
Vue.prototype.$store = store

const app = new Vue({
	store,
    ...App
})
app.$mount()
