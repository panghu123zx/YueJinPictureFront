<template>
  <a-row :gutter='[16,16]'>
    <a-col :span='24'>
      <a-card>
        <a-space>
          <a-avatar :size='100' :src='user?.userAvatar ' />
          <a-typography>
            <a-typography-paragraph style='margin-bottom: 1px;'>{{ user?.userName }}</a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px; '>账号：{{ user?.userAccount }}</a-typography-paragraph>
            <a-typography-paragraph style='margin-bottom: 1px;color: #7c6b6b'>简介: {{ user?.userProfile }}
              <a-typography-paragraph style='margin-bottom: 1px;color: #7c6b6b'>
                <a-space>
                  <span @click='getMyFollow'>{{followerCount}} 关注</span>
                  <span @click='getFollowMy'>{{fansCount}} 粉丝</span>
                </a-space>
              </a-typography-paragraph>
            </a-typography-paragraph>
          </a-typography>
        </a-space>
      </a-card>
    </a-col>
  </a-row>
  <!-- 图片列表 -->
  <a-space class='tagsTable'>
    <a-button @click='getPic' style='width: 100px;height: 40px;background-color: #e9bb76;color: #704c4c'>图片
    </a-button>
    <a-button @click='getFor' style='width: 100px;height: 40px;background-color: #e9bb76;color: #704c4c'>帖子
    </a-button>
  </a-space>
  <a-card>
    <a-list
      :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }'
      :data-source='change===0 ? pictureList : forumList'
      :loading='loading'
    >
      <template #renderItem='{ item }'>
        <a-list-item style='padding: 10px'>
          <a-card hoverable style='width: 240px;' @click='doDetail(item)'>
            <template #cover>
              <img :alt='item.name ?? item.title'
                   :src='change ===0 ? (item?.thumbnailUrl ?? item?.url):
                   (item?.forumFile[0]?.thumbnailUrl ?? item?.forumFile[0]?.picUrl) '
                   style='height: 300px;object-fit: cover' loading='lazy' />
            </template>
            <a-card-meta >
              <template #description>{{change===0? item.name: item.title}}</template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
  <!--    分页插件-->
  <a-pagination style='text-align: right;'
                v-model:current='searchParams.current'
                :total='total'
                v-model:pageSize='searchParams.pageSize'
                :onChange='doChangePages' />
</template>

<script lang='ts' setup>
import { useLoginuserStore } from '../stores/loginuserStore'
import { defineProps, nextTick, onMounted, reactive, ref } from 'vue'
import { getLoginUserUsingGet, getUserVoByIdUsingGet, userLogoutUsingGet } from '../api/userController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import EditUserPwd from '../components/EditUserPwd.vue'
import EditUserInfo from '../components/EditUserInfo.vue'
import FollowPage from '../components/FollowPage.vue'
import dayjs from 'dayjs'
import { getFollowCountByUserUsingGet, getFollowCountUsingGet } from '../api/followController'
import { getListPictureByVoUsingPost } from '../api/pictureController'
import { listForumVoUsingPost } from '../api/forumController'

//获取动态参数
const props = defineProps<{
  id: string | number
}>()

//0-图片  ，1-帖子
const change=ref(0)
const router = useRouter()
const loginUserStore = useLoginuserStore()
const user = ref<API.UserVO>()
//粉丝数
const fansCount = ref()
//关注数
const followerCount = ref()
const searchParams = reactive({
  current: 1,
  pageSize: 10
})
const pictureList=ref<API.PictureVO[]>([])
const forumList=ref<API.ForumVO[]>([])
const total=ref(0)


/**
 * 获取个人信息
 */
const fetchData = async () => {
  const res = await getUserVoByIdUsingGet({
    id: props.id as any
  })
  if (res.code === 0 && res.data) {
    user.value = res.data
  } else {
    message.error('获取用户信息失败' + res.data)
  }
}

/**
 * 获取关注数和粉丝数
 */
const fetchFollowCount = async () => {
  const res = await getFollowCountByUserUsingGet({
    id: props.id as any
  })
  if (res.code === 0 && res.data) {
    fansCount.value = res.data.followerId
    followerCount.value = res.data.userId
  }else{
    message.error('获取关注信息失败' )
  }
}

/**
 * 获取用户的图片信息
 */
const getPic=async ()=>{
  change.value=0
  const res=await getListPictureByVoUsingPost({
    ...searchParams,
    userId:props.id as any
  })
  if(res.code===0 && res.data){
    pictureList.value=res.data.records ?? []
    total.value=res.data.total ?? 0
  }else{
    message.error('获取图片信息失败'+res.data)
  }
}

/**
 * 获取用户的帖子信息
 */
const getFor=async ()=>{
  change.value=1
  const res=await listForumVoUsingPost({
    ...searchParams,
    userId: props.id as any
  })
  if(res.code===0 && res.data){
    forumList.value=res.data.records ?? []
    total.value=res.data.total ?? 0
  }else{
    message.error('获取帖子信息失败'+res.data)

  }
}

//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  if(change.value===0){
    getPic()
  }else{
    getFor()
  }
}


/**
 * 跳转图片详情页
 * @param item
 */
const doDetail=(item) => {
  if(change.value===0){
    router.push({
      path: `/picture/${item.id}`
    })
  }else{
    router.push({
      path: `/forum/${item.id}`
    })
  }

}

onMounted(() => {
  fetchData()
  fetchFollowCount()
  getPic()
})

</script>

<style scoped>
:deep(.ant-collapse-content-active) {
  max-height: 1px;
}
.tagsTable {
  margin-left: 41%;
  margin-bottom: 16px;
  margin-top: 16px;
}
</style>
