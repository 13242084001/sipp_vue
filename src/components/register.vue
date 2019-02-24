<template>
  <div style="background-color: #ac2925;position: fixed;width: 100%;height: 100%;top: 0;left: 0;">
    <div style="position: fixed;width: 400px;height: 300px;top: 20%;left: 36%;background-color: white">
      <div style="margin: 20px">
        <h1 style="text-align: center;margin-bottom: 60px;margin-top: 20px">sip自动化测试系统</h1>
        <div style="text-align: center">
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
              <router-link to="/" style="color: black;">已有账号？立即登陆</router-link>
            </p>
            <FormItem>
              <i-button type="success" long @click="register('formInline')">注&nbsp;册</i-button>
            </FormItem>
          </Form>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  import crypto from 'crypto'
  //import Cookie from 'vue-cookies'

  export default {
    name: "register",
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
      register(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(valid);
            var that = this;
            this.$axios.request({
              url: process.env.URL_PATH+"/register",
              method: 'POST',
              data: {
                username: this.formInline.username,
                password: this.md5Passwd()
              }
            }).then(function (ret) {
              console.log(ret);
              if (ret.data['code'] === 10000) {
                that.token = ret.data.token;
                //location.reload();
                router.push({path: '/'});
              } else {
                that.$Message.error(ret.data.error.username[0])
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
