import router from './router/index'
import { useLoginuserStore } from './stores/loginuserStore'
import { message } from 'ant-design-vue'

let firstEntry = true


router.beforeEach(async (to, from, next) => {
  //得到当前登入用户
  const loginUserStore = useLoginuserStore()
  let loginUser = loginUserStore.loginUser
  //观察是否是第一次验证
  if (firstEntry) {
    //是第一次就获取数据
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstEntry = false
  }

  //得到全部地址
  const url = to.fullPath
  //如果以admin开头，则需要权限
  if (url.startsWith('/admin')) {
    //没有loginguser或则 权限部位admin直接退出
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('没有权限')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
  }
  //放行
  next()
})
