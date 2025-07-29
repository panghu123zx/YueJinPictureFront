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
            <div v-if='useLoginuser.loginUser?.id'>
              <a-space >
                <a-avatar :src='useLoginuser.loginUser.userAvatar ' />
                {{ useLoginuser.loginUser.userName ?? '无名1' }}
              </a-space>
            </div>
            <div v-else>
              <a-space>
                <a-button type='primary' href='/user/login'>登入</a-button>
                <a-button type='primary' href='/user/register'>注册</a-button>
              </a-space>
            </div>
          </div>
          <template #overlay>
            <a-menu v-if='useLoginuser?.loginUser?.id'>
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
<AllUploadPage  ref='allUploadPage'/>
  </div>
</template>
<script setup lang='ts'>
import { computed, h, ref } from 'vue'
import { HomeOutlined, LogoutOutlined,UserOutlined ,SettingOutlined,PlusOutlined } from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginuserStore } from '../stores/loginuserStore'
import { userLogoutUsingGet } from '../api/userController'
import AllUploadPage from './AllUploadPage.vue'

const loginUserStore = useLoginuserStore()
const current = ref<string[]>([])
const allUploadPage=ref()

const originItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页'
  },
  {
    key: '/forum',
    label: '论坛',
    title: '论坛'
  },
  {
    key: 'model',
    icon: () => h(PlusOutlined ,{ style: 'color: white;font-size: large;justify-content: center;' }),
  },
  {
    key: '/message',
    label: '消息',
    title: '消息'
  },
  {
    key: '/chat',
    label: '聊天',
    title: '聊天'
  },
  {
    key: '/admin/usermanager',
    label: '用户管理',
    title: '用户管理'
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
  },
  {
    key: '/admin/forummanager',
    label: '论坛管理',
    title: '论坛管理'
  },
]

const router = useRouter()
const doMenu = ({ key }: { key: String }) => {
  if(key==='model'){
    if(allUploadPage){
      allUploadPage.value.openModal()
    }
  }else{
    router.push({
      path: key
    })
  }

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

:deep(:where(.css-dev-only-do-not-override-1p3hq3p).ant-menu
.ant-menu-item.ant-menu-item-only-child >.anticon,
:where(.css-dev-only-do-not-override-1p3hq3p).ant-menu
.ant-menu-submenu-title.ant-menu-item-only-child >.anticon, :where(.css-dev-only-do-not-override-1p3hq3p).ant-menu
.ant-menu-item.ant-menu-item-only-child
>.ant-menu-item-icon, :where(.css-dev-only-do-not-override-1p3hq3p).ant-menu .ant-menu-submenu-title.ant-menu-item-only-child >.ant-menu-item-icon){
  width: 44px;
  height: 44px;
  background-color: #7ed321;
  border-radius: 52%;
}
</style>
