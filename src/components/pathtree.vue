<template>


  <div class="pathtree" style="line-height: 20px;">
    <div @click="toggle" :style="indent" style="padding: 7px 0" class="item" :class="{active: current == data_.pathName && open}" ><span style="float: left;padding-left: 5px"><i class="fa" :class="[open?'fa-folder-open': 'fa-folder']" aria-hidden="true"></i> {{ data_.pathName }}</span><span
      style="float: right" class="tags">{{data_.tags}}</span>
      <div style="clear: both"></div>
    </div>

    <!--<path-tree v-if="open" v-for="(node, index) in nodes" :path-name="node.pathName" :nodes="node.nodes" :tags="node.tags" :key="index" :depth="depth + 1" :current="current" @choose="choose"></path-tree>-->
  <path-tree v-if="open" v-for="(data_, index) in data_.nodes" :data_="data_" :key="index" :depth="depth + 1" :current="current" @choose="choose"></path-tree>
  </div>



</template>

<script>
  export default {
    name: "pathTree",
    //props: ['pathName', 'nodes', 'tags', 'depth', 'item', 'current'],//这是父组件传过来的值
    props: ['data_', 'depth', 'item', 'current'],
    components: {},
    data() {
      return {
        open: false,
        isFolder: true,
        bgcolorObj: '',
        isActive: false,
        dirPath: []
      }
    },
    computed: {
      indent() {

        //return {transform: `translate(${this.depth * 10}px)`}// 偏移量
        return {paddingLeft: `${this.depth * 17}px`}
      }
    },
    methods: {
      toggle: function () {

          this.open = !this.open;
          this.choose(this.data_);
          this.isActive = !this.isActive;
          console.log(this.isActive);
          if(this.isActive) {
           //console.log(12345);
            //console.log(this.data_.parent, this.data_.pathName);//加id以及pid，或者加一个上级目录的名称
            //this.data_.parent.push(this.data_.pathName);
            //this.dirPath = this.data_.parent;
            //this.dirPath = this.getDirPath();
            //console.log(this.data_.parent);
            this.dirPath = this.data_.path;
            this.$store.commit('saveCurrentPath', this.data_.path);
            //console.log(this.dirPath);
            this.getScriptInfo();
            //this.dirPath = '';
          }
      },
      choose(info) {
    	this.$emit('choose', info);
      },
      getScriptInfo() {
        var that = this;
        this.$axios.request({
          url: process.env.URL_PATH+"/SippScript!ScriptInfo", //{"order":"asc","limit":10,"offset":0,"dirPath":["admin"],"type":".xml"}
          method: "post",
          params: {},
          data: {
            dirPath: this.dirPath,
            "type": ""

          }
        }).then(function (ret) {
          //console.log(ret.data);
          if (ret.data.code === 10000) {
            //console.log(ret.data);
            that.$store.commit('saveScriptData', ret.data)
          }
        })
      },
    },

  }
</script>

<style scoped>
.path-tree .label-wrapper {

padding-bottom: 10px;

margin-bottom: 10px;

border-bottom: 1px solid #ccc;

}


  .tags {
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    background-color: #777;
    border-radius: 10px;
    margin-right: 10px;
    margin-top: 5px;
  }
  .item {
    border: #ddd 1px solid;
    margin-top: -1px;
    color: #428bca;
  }
  .active {
    color:#FFFFFF;
    background-color:#428bca;
  }
</style>
