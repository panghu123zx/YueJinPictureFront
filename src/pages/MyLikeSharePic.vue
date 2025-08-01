<template>
  <!-- 图片列表 -->
  <a-space class='tagsTable'>
    <a-button @click='changePic' style='width: 100px;height: 40px;background-color: #e9bb76;color: #704c4c'>图片
    </a-button>
    <a-button @click='changeForum' style='width: 100px;height: 40px;background-color: #e9bb76;color: #704c4c'>帖子
    </a-button>
  </a-space>

  <a-card title='图片列表'>
    <template #extra>
      <a-space>
        <a-button @click='getMyLike'>我的点赞</a-button>
        <a-button @click='getMyShare'>我的分享</a-button>
      </a-space>
    </template>
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
                   style='height: 180px;object-fit: cover' loading='lazy' />
            </template>
            <a-card-meta :title='change===0 ?item.user?.userName: item.userVO.userName' :description='item.name ?? item.title' >
              <template #avatar>
                <a-avatar :src=' change===0 ? item.user?.userAvatar  : item.userVO.userAvatar' />
              </template>
            </a-card-meta>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
  <!--    分页插件-->
  <a-pagination style='text-align: center;'
                v-model:current='searchParams.current'
                :total='total'
                v-model:pageSize='searchParams.pageSize'
                :onChange='doChangePages' />
</template>

<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getListPictureByVoUsingPost, getMyListPictureByVoUsingPost, listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { CheckCircleOutlined, CloseCircleOutlined, DashOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import { useLoginuserStore } from '../stores/loginuserStore'
import { PIC_REVIEW_STATUS_OPTIONS, PIC_REVIEW_STATUS_ENUM } from '../constants/picture'
import { TARGET_TYPE_ENUM } from '../constants/targetType'
import { LIKE_TYPE_ENUM } from '../constants/likeShare'
import { getLoginUserUsingGet } from '../api/userController'
import { getLikePicUsingPost, getLikePostUsingPost } from '../api/userLikeController'


const pictureList = ref<API.PictureVO>()
const forumList = ref<API.ForumVO>()
const router = useRouter()
const total = ref<number>(0)
const loading = ref(false)
//0-图片  ，1-帖子
const change=ref(0)

const params = ref<API.UserLikeQueryDto>({
  targetType: TARGET_TYPE_ENUM.PICTURE,
  likeShare: LIKE_TYPE_ENUM.LIKE
})

const searchParams = reactive({
  current: 1,
  pageSize: 10
})


//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  if(change.value===0){
    fetchMyPicture()
  }else{
    fetchMyForum()
  }
}

//获取我点赞的图片信息
const fetchMyPicture = async () => {
  loading.value = true

  const res = await getLikePicUsingPost({
    ...params.value,
    ...searchParams
  })
  if (res.code === 0) {
    pictureList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
}


//获取我收藏的图片信息
const fetchMyForum = async () => {
  loading.value = true

  const res = await getLikePostUsingPost({
    ...params.value,
    ...searchParams
  })
  if (res.code === 0) {
    forumList.value = res.data.records ?? []
    total.value = res.data.total ?? 0
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
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
  fetchMyPicture()
})


const getMyLike = () => {
  params.value = {
    ...params.value,
    likeShare: LIKE_TYPE_ENUM.LIKE
  }
  change.value ===0 ? fetchMyPicture() : fetchMyForum()

}

const getMyShare = () => {
  params.value = {
    ...params.value,
    likeShare: LIKE_TYPE_ENUM.SHARE
  }
  change.value ===0 ? fetchMyPicture() : fetchMyForum()
}
//改变为查看图片信息
const changePic = () => {
  change.value = 0
  params.value = {
    ...params.value,
    targetType: TARGET_TYPE_ENUM.PICTURE,
    likeShare: LIKE_TYPE_ENUM.LIKE
  }
  fetchMyPicture()
}
//改变为查看论坛信息
const changeForum=()=>{
  change.value=1
  params.value = {
    ...params.value,
    targetType: TARGET_TYPE_ENUM.FORUM,
    likeShare: LIKE_TYPE_ENUM.LIKE
  }
  fetchMyForum()
}


</script>

<style scoped>
.tagsTable {
  margin-left: 41%;
  margin-bottom: 16px;
}
</style>
