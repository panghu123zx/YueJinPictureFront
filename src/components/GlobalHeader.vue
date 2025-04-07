<template>
  <div id='globalHeader'>
    <a-row :wrap='false'>
      <a-col flex='200px'>
        <router-link to='/'>
          <div class='header-logo'>
            <img class='logo' src='../assets/logo.png' alt='logo'>
          </div>
        </router-link>
      </a-col>

      <a-col flex='auto'>
        <a-menu v-model:selectedKeys='current' mode='horizontal' :items='items' @click='doMenu' />
      </a-col>
      <a-col flex='170px'>
        <a-dropdown>
          <div class='login-status'>
            <div v-if='useLoginuser.loginUser.id'>
              <a-space >
                <a-avatar :src='useLoginuser.loginUser.userAvatar ' />
                {{ useLoginuser.loginUser.userName ?? '无名1' }}
              </a-space>
            </div>
            <div v-else>
              <a-button type='primary' href='/user/login'>登入</a-button>
            </div>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <router-link to='/my'>
                  <SettingOutlined />
                  个人中心
                </router-link>
              </a-menu-item>
              <a-menu-item>
                <router-link to='/space'>
                  <UserOutlined />
                  我的空间
                </router-link>
              </a-menu-item>
              <a-menu-item @click='doLogout'>
                <LogoutOutlined />
                退出登入
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

      </a-col>
    </a-row>

  </div>
</template>
<script setup lang='ts'>
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined,UserOutlined ,SettingOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginuserStore } from '../stores/loginuserStore'
import { userLogoutUsingGet } from '../api/userController'


const loginUserStore = useLoginuserStore()
const current = ref<string[]>([])

const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页'
  },
  {
    key: '/admin/usermanager',
    label: '用户管理',
    title: '用户管理'
  },
  {
    key: '/addpicture',
    label: '创建图片',
    title: '创建图片'
  },
  {
    key: '/admin/picturemanager',
    label: '图片管理',
    title: '图片管理'
  },
  {
    key: '/admin/spacemanager',
    label: '空间管理',
    title: '空间管理'
  }

]

const router = useRouter()
const doMenu = ({ key }: { key: String }) => {
  router.push({
    path: key
  })
}
/**
 * 得到显示的导航栏值
 */
router.afterEach(to => {
  current.value = [to.path]
})

/**
 * 得到用户信息值
 */
const useLoginuser = useLoginuserStore()
useLoginuser.fetchLoginUser()

/**
 * 退出登入
 */
const doLogout = async () => {
  const res = await userLogoutUsingGet()
  if (res.code === 0) {
    message.success('退出成功')
    //去除登入态
    loginUserStore.setLoginUser({})
    router.push('/user/login')
  } else {
    message.error('退出登入失败')
  }
}
/**
 * 过滤菜单
 */
// const items = ref()
const filterItems = (menu = [] as MenuProps['items']) => {
  return menu?.filter((menu) => {
    if (menu.key.startsWith('/admin')) {
      const loginUser = useLoginuser.loginUser
      if (!loginUser || loginUser.userRole !== 'admin') {
        return false
      }
    }
    return true
  })
}

const items = computed<MenuProps['items']>(() => filterItems(originItems))

</script>


<style scoped>
.header-logo {
  display: flex;
  align-items: center;
}

.logo {
  height: 65px;
  margin-left: 12px;
}



.login-status {
}
</style>
