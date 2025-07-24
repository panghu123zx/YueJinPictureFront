<template>
  <div id='userRegister'>
    <h2 class='title'>跃金图库-用户注册</h2>
    <div class='desc'>致力于打造更好的图片服务平台</div>
    <a-form
      :model='formState'
      autocomplete='off'
    >
      <a-form-item
        name='email'
        :rules="[{ required: true, message: '请输入邮箱' },{min: 4,message: '邮箱过短'}]"
      >
        <a-input v-model:value='formState.email' placeholder='请输入邮箱' />
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
      <a-form-item
        name='code'
        :rules="[{ required: true, message: '请输入验证码' },{len: 6,message: '请输入验证码长度错误'}]"
      >
        <a-space>
          <a-input v-model:value='formState.code' placeholder='请输入验证码' style='min-width: 250px'/>
          <!-- 在按钮上添加状态控制 -->
          <a-button
            @click='havingCode'
            :disabled="countDown > 0"
          >
          {{ countDown > 0 ? `${countDown}s后重新获取` : '获取验证码' }}
          </a-button>
        </a-space>

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
import { onUnmounted, reactive, ref } from 'vue'
import { sendMailUsingPost, userRegisterUsingPost } from '../../api/userController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginuserStore } from '../../stores/loginuserStore'

const router = useRouter()
// 定义倒计时状态变量
const countDown = ref(0);  // 初始为0，代表未进入倒计时
let timer=null


const formState = reactive<API.UserRegisterDto>({
  email: '',
  userPassword: '',
  checkPassword: '',
  code: ''
})
//注册
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
/**
 * 发送验证码
 */
const havingCode=async ()=>{
  if(formState.email===''){
    message.error("请输入邮箱");
    return;
  }
  const res =await sendMailUsingPost({
    email: formState.email
  })
  if(res.code===0){
    message.success("验证码已发送")
  }
  startCountDown();  // 启动倒计时
}

/**
 * 启动60秒倒计时
 */
const startCountDown = () => {
  countDown.value = 60;  // 初始倒计时60秒
  if(!timer) clearInterval(timer);
  timer = setInterval(() => {
    countDown.value--;
    // 倒计时结束清除定时器
    if (countDown.value <= 0) {
      clearInterval(timer);
      timer=null
    }
  }, 1000);  // 每1秒执行一次
};
onUnmounted(()=>{
  if(timer) clearInterval(timer);
})
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

