<template>
  <div>
    <Page :total="total" :current="pageNum" :page-size="pageSize" placement="top" show-elevator show-sizer show-total @on-change="handlePage" @on-page-size-change='handlePageSize'/>
  </div>
</template>

<script>
  export default {
    name: "sipCfgPage",
    props: ['total'],
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
        this.$emit('watchChild', this.pageSize, this.pageSize * (this.pageNum - 1))

      },
      handlePageSize(value) {
        this.pageSize = value;
        this.$emit('watchChild', this.pageSize, this.pageSize * (this.pageNum - 1))

      },
    }
  }
</script>

<style scoped>

</style>

