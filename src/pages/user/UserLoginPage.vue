<template>
  <div id='userLogin'>
    <h2 class='title'>胖虎图库-用户登入</h2>
    <div class='desc'>致力于打造更好的图片服务平台</div>
    <a-form
      :model='formState'
      autocomplete='off'
    >
      <a-form-item
        name='userAccount'
        :rules="[{ required: true, message: '请输入账号' }]"
      >
        <a-input v-model:value='formState.userAccount' placeholder='请输入账号' />
      </a-form-item>

      <a-form-item
        name='userPassword'
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password v-model:value='formState.userPassword' placeholder='请输入密码' />
      </a-form-item>

      <div class='prompt'>
        <span>没有账号？</span>
        <router-link to='/user/register'>去注册</router-link>
      </div>


      <a-form-item>
        <a-button type='primary' @click='submitHandler' style='width: 360px'>登入</a-button>
      </a-form-item>
    </a-form>
  </div>

</template>
<script lang='ts' setup>
import { reactive } from 'vue'
import { userLoginUsingPost } from '../../api/userController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginuserStore } from '../../stores/loginuserStore'

const router = useRouter()

const loginUserStore = useLoginuserStore()


const formState = reactive<API.UserLoginDto>({
  userAccount: '',
  userPassword: ''
})
//登入
const submitHandler = async () => {
  const res = await userLoginUsingPost(formState)
  if (res.code === 0) {
    message.success('登入成功')
    router.push({
      path: '/',
      replace: true
    })
    //设置登录态
    loginUserStore.setLoginUser(res.data)
  } else {
    message.error("登入失败"+res.data)
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

#userLogin {
  max-width: 360px;
  margin: 0 auto;
}
.prompt{
  text-align: right;
  margin-bottom: 8px;

}
</style>

