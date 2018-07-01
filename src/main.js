import Vue from 'vue'
import VueMq from 'vue-mq'
import DesktopApp from './DesktopApp.vue'

Vue.config.productionTip = false
Vue.use(VueMq, {
    breakpoints: {
        sm: 450,
        lg: Infinity,
    }
})

new Vue({
    render: h => h(DesktopApp)
})
.$mount('#app')

