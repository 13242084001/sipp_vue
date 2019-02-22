<template>
    <div><Page :total="this.$store.state.pageTotal" :current="pageNum" :page-size="pageSize" placement="top" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'/></div>
</template>

<script>
    export default {
        name: "page",
        data() {
          return {
            pageTotal: 0,//数据总数
            pageNum: 1,//当前页码
            pageSize: 10,//每页显示条数
          }
        },
      methods: {
          handlePage(value) {
            this.pageNum = value;//
            this.getScriptInfo();

        },
        handlePageSize(value) {
            this.pageSize = value;
            this.getScriptInfo();

        },
        getScriptInfo() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+"/SippScript!ScriptInfo", //{"order":"asc","limit":10,"offset":0,"dirPath":["admin"],"type":".xml"}
          method: "post",
          params: {},
          data: {
            dirPath: that.$store.state.CurrentPath,
            "order":"asc",
            "limit":that.pageSize,
            "offset":that.pageSize*(that.pageNum-1),
            "type":""

          }
        }).then(function (ret) {
          //console.log(ret.data);
          if (ret.data.code === 10000) {
            //console.log(ret.data);
            that.$store.commit('saveScriptData', ret.data)
          }
        })
      },
      }
    }
</script>

<style scoped>

</style>
