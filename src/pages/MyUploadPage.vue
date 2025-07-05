<template>
  <a-space class='tagsTable'>
    <a-button @click='getMyPic'  style='width: 100px;height: 40px;    background-color: rgb(237 226 209);color: #704c4c'>我的图片</a-button>
    <a-button @click='getMyForum'  style='width: 100px;height: 40px;    background-color: rgb(237 226 209);color: #704c4c'>我的帖子</a-button>
  </a-space>
  <!--  搜索-->
  <a-flex justify='space-between'>
    <a-form layout='inline' :model='searchParams'>
      <a-form-item label='关键词' v-if='picOrForum ===0 '>
        <a-input v-model:value='searchParams.searchText' placeholder='请输入关键词...' />
      </a-form-item>
      <a-form-item label='名称' v-if='picOrForum ===1 '>
        <a-input v-model:value='searchParams.name' placeholder='请输入名称...' />
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
          v-if='picOrForum===0'
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
    <a-button v-if='picOrForum===0' type='primary' @click='router.push("/addpicture/batch")'>批量获取图片</a-button>
  </a-flex>
  <div style='margin-bottom: 16px;' />

  <!-- 图片列表 -->
  <MyUploadPic v-if ='picOrForum===0' :searchParams='searchParams' :total='total' :pictureList='pictureList' :loading='loading' :onSuccess='onSuccess'/>
  <MyUploadForum v-else :searchParams='searchParams' :total='total' :forumList='forumList' :loading='loading' :onSuccess='onSuccess' />
</template>

<script lang='ts' setup>
import {  onMounted, reactive, ref } from 'vue'
import {
   getMyListPictureByVoUsingPost, listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { CheckCircleOutlined ,CloseCircleOutlined,DashOutlined } from '@ant-design/icons-vue'
import 'vue3-colorpicker/style.css'
import { useLoginuserStore } from '../stores/loginuserStore'
import { PIC_REVIEW_STATUS_OPTIONS,PIC_REVIEW_STATUS_ENUM } from '../constants/picture'
import { getLoginUserUsingGet } from '../api/userController'
import MyUploadPic from '../components/MyUploadPic.vue'
import { getMyListForumByVoUsingPost, listForumCategoryUsingGet } from '../api/forumController'
import MyUploadForum from '../components/MyUploadForum.vue'
import { saveAs } from 'file-saver'


const pictureList = ref<API.PictureVO[]>()
const forumList= ref<API.ForumVO[]>()
const total = ref(0)
const loading = ref(false)
const categoryTagList = ref<API.PictureTagCategory>()

const picOrForum=ref(0)

const loginUserStore = useLoginuserStore()
const loginUser = loginUserStore.loginUser

const userId = ref(loginUser.id)
//获取我的图片
const getMyPic= async ()=>{
  picOrForum.value =0
  if(picOrForum.value===0){
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
}

//获取我的帖子
const getMyForum= async ()=>{
  picOrForum.value = 1
  if(picOrForum.value === 1){
    loading.value = true
    if(!userId.value){
      await fetchUser()
    }
    const category =await listForumCategoryUsingGet()
    if(category.code === 0){
      categoryTagList.value = category.data
    }
    const res = await getMyListForumByVoUsingPost({
      userId: userId.value,
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
}

const  onSuccess =() =>{
  if(picOrForum.value === 0){
    getMyPic()
  }else{
    getMyForum()
  }
}

/**
 * 搜索条件
 */
const searchParams = reactive({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend'
})

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
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  if(picOrForum.value === 1){
    getMyForum()
  }else{
    getMyPic()
  }
}

onMounted(() => {
  getMyPic()
  fetchCategoryAndTags()
})



</script>

<style scoped>
.tagsTable{
  margin-left: 40%;
  margin-bottom: 10px;
}
</style>
