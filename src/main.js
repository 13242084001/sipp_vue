// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/store'
//import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
//import 'vue-easytable/libs/themes-base/index.css'
//import {VTable,VPagination} from 'vue-easytable'
import BootstrapVue from 'bootstrap-vue'
//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import echarts from 'echarts';
import Cookie from 'vue-cookies';
//Vue.use(BootstrapVue);
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.prototype.$store = store;
Vue.config.productionTip = false;
//Vue.use(ElementUI);
//Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.use(router);
Vue.use(iView);

Vue.filter('toZn', function (value) {
  if (value === 1) {
    return "未完成"
  } else if (value === 0) {
    return "已完成"
  } else if (!value) {
    return "-"
  } else {
    return value
  }
});
Vue.filter('breadcrumb', function (value) {
  if (value === "Home") {
    return 首页
  } else if (value === "workbench") {
    return "工作台"
  }
  else if (value === "config") {
    return "配置"
  } else if (value === "TaskStatus") {
    return "任务状态"
  } else if (value === "TaskContent") {
    return "任务内容"
  } else if (value === "SippScript") {
    return "sipp脚本"
  } else if (value === "PythonScript") {
    return "python脚本"
  }
});
/* eslint-disable no-new */

axios.interceptors.request.use(config => {
    var token = Cookie.get('token');
    console.log(token);
    if (token) {
      //console.log(token);
      config.headers.Authorization = token;
    } else {
      //console.log(123);
      router.push({path: '/'});
    }
    return config
  },
  error => {
    return Promise.reject(error)
  });

new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
//console.log(router);

// router.beforeEach((to, from, next) => {
//     if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//         if (store.state.token) {// 通过vuex state获取当前的token是否存在
//             next();
//         }
//         else {
//             next({
//                 path: '/',
//                 query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             })
//         }
//     }
//     else {
//         next();
//     }
// });


