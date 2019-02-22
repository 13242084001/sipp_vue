<template>
  <div class="layout">
    <Layout>
      <Header style="background-color: #ac2925;">
        <div mode="horizontal" style="background-color: #ac2925">
          <div style="float: left"><img src="../assets/cloud.png" style="height: 30px;width: 30px"><span
            style="margin: 0 10px;font-size: 20px;color: white">sipp</span></div>
          <div class="layout-nav">
            <div style="float: right">
              <Dropdown trigger="click" @on-click="handle" style="margin-left: 20px;height: 60px">
                <a href="javascript:void(0)" style="text-decoration: none;color: white">
                  {{this.$store.state.username}}
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem>版本 V 1.0</DropdownItem>
                  <DropdownItem name="changePasswd">修改密码
                  </DropdownItem>

                  <Modal v-model="Modal" title="修改密码">
                    <a slot="close" @click="Modal=false; alertStyle.display='none';value=''"><i
                      class="ivu-icon ivu-icon-ios-close"></i></a>

                    <div slot="footer"> <!--这里自定义的footer；因为自带的确定按钮始终会点击关闭-->
                      <Button type="text" @click="Modal=false; alertStyle.display='none';value=''">取消</Button>
                      <!--<Button type="success" @click="confirm">确定</Button>-->
                      <i-button type="success" @click="confirm('formInline')">确 定</i-button>
                      <!--<i-button type="success" long @click="login('formInline')">登&nbsp;陆</i-button>-->
                    </div>

                    <Form ref="formInline" :model="formInline" :rules="ruleInline">
                      <FormItem prop="oldPasswd"><p><span style="color: red">*</span>&nbsp;原密码</p>
                        <Input type="password" v-model="formInline.oldPasswd" placeholder="oldPasswd">
                          <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                      </FormItem>
                      <FormItem prop="newPasswd"><p><span style="color: red">*</span>&nbsp;原密码</p>
                        <Input type="password" v-model="formInline.newPasswd" placeholder="newPasswd">
                          <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                      </FormItem>

                    </Form>

                  </Modal>


                  <DropdownItem name="logOut">注 销</DropdownItem>

                </DropdownMenu>
              </Dropdown>
            </div>
            <div style="clear: both"></div>
          </div>
        </div>
      </Header>

      <Layout>
        <Sider hide-trigger :style="{background: '#ddd'}">
          <Menu active-name="1-2" width="auto" :open-names="['1']" style="background-color: #ddd">
            <MenuItem name="1" style="border-right: none">
              <i class="fa fa-tachometer fa-fw"></i>
              <router-link to="/index/workbench" class="left-link">工作台</router-link>
            </MenuItem>

            <MenuItem name="2">
              <i class="fa fa-cogs"></i>
              <router-link to="/index/config" class="left-link">&nbsp;配置</router-link>
            </MenuItem>


            <Submenu name="3">
              <template slot="title"><i class="fa fa-tasks"></i>
                &nbsp;<span style="color: black">任务</span>
              </template>
              <MenuItem name="3-1">
                <router-link to="/index/TaskStatus" class="left-link">任务状态</router-link>
              </MenuItem>
              <MenuItem name="3-2">
                <router-link to="/index/TaskContent" class="left-link">任务内容</router-link>
              </MenuItem>
            </Submenu>

            <Submenu name="4">
              <template slot="title"><i class="fa fa-table fa-fw"></i>
                <span style="color: black">脚本</span>
              </template>
              <MenuItem name="4-1">
                <router-link to="/index/SippScript" class="left-link">sipp 脚本</router-link>
              </MenuItem>
              <MenuItem name="4-2">
                <router-link to="/index/PythonScript" class="left-link">python脚本</router-link>
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: 0}">
          <Breadcrumb :style="{margin:  '10px'}">
            <BreadcrumbItem to="/index/workbench">首页</BreadcrumbItem>
            <BreadcrumbItem>{{this.$route.name|breadcrumb}}</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '24px', margin: '24px, 0, 0, 0', minHeight: '700px', background: '#fff'}">

            <router-view/>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import Cookie from 'vue-cookies';

  export default {
    name: "index",

    data() {
      return {
        name: this.$store.state.username,
        Modal: false,
        formInline: {
          oldPasswd: '',
          newPasswd: '',
        },
        ruleInline: {
          oldPasswd: [
            {required: true, message: '原密码不能为空', trigger: 'blur'}
          ],
          newPasswd: [
            {required: true, message: '新密码不能为空', trigger: 'blur'},
            {type: 'string', min: 3, message: '原密码不能小于3个字符', trigger: 'blur'}
          ]
        },

        alertStyle: {
          display: 'none',
          color: 'red'
        }
      }
    },
    methods: {
      handle(name) {
        console.log(name);
        if (name === "changePasswd") {
          this.Modal = true
        } else if (name === "logOut") {
          Cookie.set('username', '');
          Cookie.set('token', '');
          this.$router.push({path: '/'})
        }
      },

      confirm(pwd) {
        this.$refs[pwd].validate((valid) => {
          if (valid) {
            var that = this;
            this.$axios.request({
              url: process.env.URL_PATH+"/changePasswd",
              method: "post",
              params: {},
              data: {
                oldPasswd: that.formInline.oldPasswd,
                newPasswd: that.formInline.newPasswd,
              },
            }).then(function (ret) {
              if (ret.data.code === 10000) {
                that.$Message.success('修改成功');
                that.Modal = false;
                that.oldPasswd = '';
                that.newPasswd = '';
                that.$router.push({path: '/'})
              } else {
                that.$Message.error(ret.data.error)//这里应该搞个目录名不能为空
              }
            }).catch()
          } else {
            //
          }
        });

      },

    }
  }
</script>

<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-logo {
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .left-link {
    text-decoration: none;
    color: black;
  }

</style>
