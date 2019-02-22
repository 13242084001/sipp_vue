import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'


Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    username: Cookie.get('username'),
    token: Cookie.get('token'),
    //username: 'jjjj',
    //token: 'aaa'
    pathTree: [],
    ScriptData: [],
    pageTotal: 0,
    CurrentPath: '',
  },
  mutations: {
    saveToken: function (state, usertoken) {
      this.state.username = usertoken['username'];
      this.state.token = usertoken['token'];
      Cookie.set('username', usertoken['username'], "20min");
      Cookie.set('token', usertoken['token'], "20min");
    },
    clearToken: function (state) {
      state.username = null;
      state.token = null;
      Cookie.remove('username');
      Cookie.remove('token');
    },
    saveScriptData: function (state, ScriptData) {
      console.log(ScriptData);
      this.state.ScriptData = ScriptData.result.list;
      this.state.pageTotal = ScriptData.result.total;

    },
    savePathTree: function (state, pathTree) {
      this.state.pathTree = pathTree;
      console.log(this.state.pathTree);
      //this.state.CurrentPath = ScriptData.result.path;
    },
    saveCurrentPath: function (state, path) {
      this.state.CurrentPath = path
    },
    changeTotal: function (state, len) {
      this.state.pageTotal -= len;
      console.log(this.state.pageTotal)
    },

  }
})





