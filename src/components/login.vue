<template>
  <div style="background-color: #ac2925;position: fixed;width: 100%;height: 100%;top: 0;left: 0;">
    <!--<div style="position: fixed;width: 400px;height: 300px;top: 20%;left: 36%;background-color: white">
      <div style="margin: 20px">

         <h1 style="text-align: center;margin-bottom: 60px;">sip自动化测试系统</h1>
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="username">
          <Input type="text" v-model="formInline.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
          <p style="text-align: left"><router-link to="/register" style="color: black">没有账号？立即注册</router-link></p>
        <FormItem>
          <i-button type="success" long @click="login('formInline')">登&nbsp;陆</i-button>
        </FormItem>
      </Form>

      </div>
      </div>-->

    <Row :gutter="16" style="top: 30%;">
      <Col :xs="{ span: 20, offset: 2}" :sm="{ span: 16, offset: 4 }" :md="{ span: 12, offset: 6}"
           :lg="{ span: 8, offset: 8}" style="background-color: white">
        <div style="margin: 20px">

          <h1 style="text-align: center;margin-bottom: 60px;">sip自动化测试系统</h1>
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="username">
              <Input type="text" v-model="formInline.username" placeholder="Username">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="Password">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <p style="text-align: left">
              <router-link to="/register" style="color: black">没有账号？立即注册</router-link>
            </p>
            <FormItem>
              <i-button type="success" long @click="login('formInline')">登&nbsp;陆</i-button>
            </FormItem>
          </Form>

        </div>
      </Col>
    </Row>

  </div>


</template>

<script>
  import router from '../router'
  import crypto from 'crypto'
  //import Cookie from 'vue-cookies'

  export default {
    name: "login",
    data() {
      return {
        formInline: {
          username: '',
          password: ''
        },
        ruleInline: {
          username: [
            {required: true, message: 'Please fill in the user name', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please fill in the password.', trigger: 'blur'},
            {type: 'string', min: 3, message: 'The password length cannot be less than 3 bits', trigger: 'blur'}
          ]
        },

      }
    },
    methods: {
      login(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(valid);
            var that = this;
            this.$axios.request({
              url: process.env.URL_PATH + "/login",
              method: 'POST',
              data: {
                username: that.formInline.username,
                password: that.md5Passwd()
              }
            }).then(function (ret) {
              console.log(ret);
              if (ret.data['code'] === 10000) {
                //that.username = ret.data.username;
                console.log(ret.data.token);
                that.$store.commit('saveToken', {username: that.formInline.username, token: ret.data['token']});
                //location.reload();
                router.push({path: '/index/workbench'});
              } else {

              }
            }).catch(function (ret) {
              console.log(ret);
            })
          } else {
            this.$Message.error('Fail!');
          }
        });

      },
      md5Passwd() {
        var md5 = crypto.createHash("md5");
        md5.update(this.formInline.password); //需要加密的密码
        var password = md5.digest('hex');  //password 加密完的密码
        console.log(password);
        return password
      }
    }
  }
</script>

<style scoped>

</style>
