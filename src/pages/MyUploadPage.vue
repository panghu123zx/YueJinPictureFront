<template>
  <!--  搜索-->
  <a-flex justify='space-between'>
    <a-form layout='inline' :model='searchParams'>
      <a-form-item label='关键词'>
        <a-input v-model:value='searchParams.searchText' placeholder='请输入关键词...' />
      </a-form-item>
      <a-form-item label='分类' name='category'>
        <a-select
          v-model:value='searchParams.category'
          placeholder='请输入分类'
          style='min-width: 180px'
          allow-clear
        >
          <a-select-option v-for='cat in categoryTagList?.categoryList' :key='cat'>{{ cat }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name='tags' label='标签'>
        <a-select
          v-model:value='searchParams.tags'
          mode='tags'
          placeholder='请输入标签'
          style='min-width: 180px'
          allow-clear
        >
          <a-select-option v-for='tag in categoryTagList?.tagList' :key='tag'>{{ tag }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='审核状态' name='reviewStatus'>
        <a-select
          v-model:value='searchParams.reviewStatus'
          placeholder='请输入审核状态'
          style='min-width: 180px'
          allow-clear
          :options='PIC_REVIEW_STATUS_OPTIONS'
        />

      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type='primary' @click='doSearch'>搜索</a-button>
        </a-space>
      </a-form-item>
    </a-form>
    <a-button type='primary' @click='router.push("/addpicture/batch")'>批量获取图片</a-button>
  </a-flex>
  <div style='margin-bottom: 16px;' />

  <!-- 图片列表 -->
  <a-list
    :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
    :data-source='pictureList'
    :pagination='paginationParams'
    :loading='loading'
  >
    <template #renderItem='{item :picture}'>
      <a-list-item style='padding: 10px'>
        <a-card hoverable style='width: 240px;' @click='doPictureDetail(picture)'>
          <template #cover>
            <img :alt='picture.name' :src='picture.thumbnailUrl ?? picture.url' style='height: 180px;object-fit: cover' loading='lazy' />
          </template>
          <a-card-meta :title='picture.name' />
          <a-card-meta v-if='picture.reviewStatus === PIC_REVIEW_STATUS_ENUM.REVIEWING' description='待审阅' style='margin-top: 20px;'>
            <template #avatar>
              <DashOutlined  style='margin-left: 50px;'/>
            </template>
          </a-card-meta>
          <a-card-meta v-if='picture.reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS' description='已通过' style='margin-top: 20px;color: #6bb66e'>
            <template #avatar >
              <CheckCircleOutlined style='margin-left: 50px;color: #6bb66e'/>
            </template>
          </a-card-meta>
          <a-card-meta v-if='picture.reviewStatus === PIC_REVIEW_STATUS_ENUM.REJECT' title='拒绝' style='margin-top: 20px;'>
            <template #avatar>
              <CloseCircleOutlined style='margin-left: 50px; color: #f15151'/>
            </template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang='ts' setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getListPictureByVoUsingPost, getMyListPictureByVoUsingPost, listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { CheckCircleOutlined ,CloseCircleOutlined,DashOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import { useLoginuserStore } from '../stores/loginuserStore'
import { PIC_REVIEW_STATUS_OPTIONS,PIC_REVIEW_STATUS_ENUM } from '../constants/picture'
import { getLoginUserUsingGet } from '../api/userController'


const pictureList = ref<API.PictureVO[]>()
const router = useRouter()
const total = ref(0)
const loading = ref(true)
const categoryTagList = ref<API.PictureTagCategory>()


const loginUserStore = useLoginuserStore()
const loginUser = loginUserStore.loginUser

const userId = ref(loginUser.id)

/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryDto>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend'
})
const paginationParams = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 12,
    total: total.value,
    showPageSizeChanger: true,
    showTotal: (total) => `共${total}条`,
    onChange: (page, pageSize) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchMyPicture()
    }
  }
})

//获取个人发布在公共图库的图片信息
const fetchMyPicture = async () => {
  loading.value = true
  if(!userId.value){
    await fetchUser()
  }

  const res = await getMyListPictureByVoUsingPost({
    userId: userId.value,
    queryPublic: true,
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

const fetchCategoryAndTags = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.code === 0) {
    categoryTagList.value = res.data
  }
}

const fetchUser = async () => {
  const res = await getLoginUserUsingGet()
  if (res.code === 0 && res.data) {
    userId.value = res.data?.id
  }
}

/**
 * 跳转图片详情页
 * @param picture
 */
const doPictureDetail = (picture) => {
  router.push({
    path: `/picture/${picture.id}`
  })
}


/**
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  fetchMyPicture()
}

onMounted(() => {
  fetchMyPicture()
  fetchCategoryAndTags()
})



</script>

<style scoped>

</style>
