<template>
  <div id='globalSide'>
    <a-layout-sider
      :style="{  position: 'sticky', left: 0, top: 0, bottom: 0 }"
      width='200'
      v-if='useLoginuser.loginUser?.id'
      breakpoint='lg'
      collapsed-width='0'
      :collapsible='true'
    >
      <a-menu
        v-model:selectedKeys='current'
        mode='inline'
        :items='menuItems'
        @click='doMenu'
      />
    </a-layout-sider>
  </div>
</template>
<script lang='ts' setup>
import { computed, h, onMounted, ref, watchEffect } from 'vue'
import { UserOutlined, PictureOutlined, TeamOutlined,CloudUploadOutlined } from '@ant-design/icons-vue'
import { useLoginuserStore } from '../stores/loginuserStore'
import { useRouter } from 'vue-router'
import { MenuProps, message } from 'ant-design-vue'
import { SPACE_TYPE_ENUM } from '../constants/spaceuser'
import { listMySpaceUserUsingGet } from '../api/spaceUserController'



const current = ref<string[]>([])


const originItems = [
  {
    key: '/',
    icon: () => h(PictureOutlined, { style: 'color: #4a90e2;font-size: large' }),
    label: '公共图库',
    title: '主页'
  },
  {
    key: '/space',
    label: '个人空间',
    title: '个人空间',
    icon: () => h(UserOutlined, { style: 'color: #55d6d1;font-size: large' })
  },
  {
    key: '/myupload',
    label: '我的上传',
    title: '我的上传',
    icon: () => h(CloudUploadOutlined,{style : 'color: #7ED321;font-size: large'})
  },
  {
    key: '/addspace?type=' + SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    title: '创建团队',
    icon: () => h(TeamOutlined,{ style: 'color: #ffa726;font-size: large' })
  }
]

const router = useRouter()
const doMenu = ({ key }: { key: String }) => {
  router.push(key)
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


const spaceUserList = ref<API.SpaceUserVO[]>([])
const menuItems = computed(() => {
  //没有团队空间，展示固定菜单
  if (spaceUserList.value.length < 1) {
    return originItems
  }
  //有团队空间，展示团队空间菜单
  const teamSpaceMenu = spaceUserList.value.map(spaceUser => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName
    }
  })

  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceMenu
  }

  return [...originItems, teamSpaceMenuGroup]

})


const getSpaceUserList = async () => {
  const res = await listMySpaceUserUsingGet()
  if (res.code === 0) {
    spaceUserList.value = res.data
  }
}

onMounted(() => {
  getSpaceUserList()
})

//监听变量
watchEffect(() => {
  if (useLoginuser.loginUser.id) {
    getSpaceUserList()
  }
})
</script>


<style scoped>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}

 :deep(.ant-layout-sider-zero-width-trigger){
  top: 3px !important;
  inset-inline-end: -21px !important;
  width: 21px;
  background: #d0e7f9;
}

:deep(.ant-menu-item-active){
   background-color: #bedcf5;
 }
</style>
