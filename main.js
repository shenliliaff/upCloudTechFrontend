
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import store from './store'
App.mpType = 'app'


import { request,upload } from './common/request/index.js'
Vue.prototype.$request = request
Vue.prototype.$upload = upload


const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif