import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '../api/userController'

export const useLoginuserStore = defineStore('loginUser', () => {
  const loginUser = ref<API.User>({
    username: '未登入'
  })

  async function fetchLoginUser() {
    const res=await getLoginUserUsingGet();
    if(res.code===0 && res.data){
      loginUser.value=res.data;
    }
  }

  function setLoginUser(newLoginUser: any) {
    loginUser.value = newLoginUser
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
