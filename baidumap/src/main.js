import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
Vue.prototype.$http=axios

Vue.use(ElementUI);
import BaiduMap from 'vue-baidu-map';// 导入地图

// 进行全局注册，一次性引入百度地图组件库的所有组件
// ak为官方提供的密钥
Vue.use(BaiduMap, {
  ak: '0SglCegTnQS2XzQLwDIEY8TVkrK6xWoW'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
