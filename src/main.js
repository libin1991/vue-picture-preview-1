import Vue from 'vue'
import App from './App.vue'
import "@/styles/index.css";

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')


// import VuePicturePreview from '@/components/HelloWorld'
// export default VuePicturePreview;

// if(process.env.NODE_ENV === 'production'){
// } else {
// }
