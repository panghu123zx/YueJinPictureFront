<template>
  <div id='userRegister'>
    <h2 class='title'>跃金图库-用户注册</h2>
    <div class='desc'>致力于打造更好的图片服务平台</div>
    <a-form
      :model='formState'
      autocomplete='off'
    >
      <a-form-item
        name='userAccount'
        :rules="[{ required: true, message: '请输入账号' },{min: 4,message: '账号过短'}]"
      >
        <a-input v-model:value='formState.userAccount' placeholder='请输入账号' />
      </a-form-item>

      <a-form-item
        name='userPassword'
        :rules="[{ required: true, message: '请输入密码' },{min: 8,message: '密码过短'}]"
      >
        <a-input-password v-model:value='formState.userPassword' placeholder='请输入密码' />
      </a-form-item>
      <a-form-item
        name='checkPassword'
        :rules="[{ required: true, message: '请输入确认密码' },{min: 8,message: '确认密码过短'}]"
      >
        <a-input-password v-model:value='formState.checkPassword' placeholder='请输入确认密码' />
      </a-form-item>

      <div class='prompt'>
        <span>已有账号？</span>
        <router-link to='/user/login'>去登入</router-link>
      </div>


      <a-form-item>
        <a-button type='primary' @click='submitHandler' style='width: 360px'>注册</a-button>
      </a-form-item>
    </a-form>
  </div>

</template>
<script lang='ts' setup>
import { reactive } from 'vue'
import { userRegisterUsingPost } from '../../api/userController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginuserStore } from '../../stores/loginuserStore'

const router = useRouter()


const formState = reactive<API.UserRegisterDto>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})
//登入
const submitHandler = async () => {
  if(formState.userPassword!==formState.checkPassword){
    message.error("两次密码不一致");
    return;
  }
  const res = await userRegisterUsingPost(formState)
  if (res.code === 0) {
    message.success('注册成功')
    router.push({
      path: '/user/login',
      replace: true
    })
  } else {
    message.error("注册失败"+res.data)
  }

}
</script>

<style scoped>
.desc {
  color: #999;
  font-size: 13px;
  text-align: center;
  margin-bottom: 16px;
}

.title {
  text-align: center;
}

#userRegister {
  max-width: 360px;
  margin: 0 auto;
}
.prompt{
  text-align: right;
  margin-bottom: 8px;

}
</style>

