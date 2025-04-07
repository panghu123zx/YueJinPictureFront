<template>
  <a-flex justify='space-between'>
    <a-space>
      <span style='font-size: 21px; color: #474343;'>{{ space?.spaceName }}</span>
      <ExclamationCircleOutlined style='font-size: large' @click='toUserSpaceInfo'/>
    </a-space>
    <a-space>
      <a-tooltip>
        <template #title>空间额度使用情况</template>
        <a-progress type='circle' :percent='((space?.totalSize * 100) / space?.maxSize).toFixed(1)' :size='40' />
      </a-tooltip>
      <a-button type='primary' v-if='canUploadPicture' @click='router.push(`/addpicture?spaceId=${space?.id}`)'>
        + 创建图片
      </a-button>
      <a-button type='primary' v-if='canUploadPicture' ghost @click='doEditByBatch'>+ 批量编辑</a-button>
      <a-button type='primary' v-if='space?.spaceType===1 && canManageSpaceUser' :href='`/spaceUserManage/${id}`'>
        成员管理
      </a-button>
      <a-button :href='`/space_analyze?spaceId=${space?.id}`' v-if='canManageSpaceUser' >
        <template #icon>
          <AreaChartOutlined />
        </template>
        分析空间
      </a-button>
      <color-picker format='hex' @pureColorChange='onColorChange' />
    </a-space>
  </a-flex>
  <div style='margin-bottom: 16px;'></div>
  <!--  搜索-->
  <PictureSearch :searchParams='searchParams' :doSearch='doSearch' />

  <UserSpaceInfo :space='space' ref='userSpaceInfo'/>
  <div style='margin-bottom: 16px;'></div>

  <!--  图片列表-->
  <PictureList :loading='loading' :dataList='pictureList' :showOptions='true' :onReload='fetchSpacePicture' :canEdit='canEditPicture' :canDelete='canDeletePicture'/>
  <!--    分页插件-->
  <a-pagination style='text-align: right;'
                v-model:current='searchParams.current'
                :total='total'
                v-model:pageSize='searchParams.pageSize'
                :showTotal='(total)=> `共 ${total} 条数据`'
                :onChange='doChangePages' />

  <EditPictureByBatch ref='editPictureByBatch' :pictureIdList='pictureIdList' :spaceId='props.id'
                      :onSuccess='onSuccess' />
</template>

<script lang='ts' setup>
import { computed, defineProps, onMounted, reactive, ref, watch } from 'vue'
import {
  getListPictureByVoUsingPost,
  searchPictureByColorUsingPost
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureList from '../components/PictureList.vue'
import { getSpaceByIdVoUsingGet } from '../api/spaceController'
import PictureSearch from '../components/PictureSearch.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import EditPictureByBatch from '../components/EditPictureByBatch.vue'
import _default from 'ant-design-vue/es/vc-slick/inner-slider'
import { SPACE_PERMISSION_ENUM } from '../constants/spaceuser'
import { ExclamationCircleOutlined ,AreaChartOutlined} from '@ant-design/icons-vue'
import UserSpaceInfo from '../components/UserSpaceInfo.vue'

//获取动态参数
const props = defineProps<{
  id: string | number
}>()

const pictureList = ref<API.PictureVO[]>()
const router = useRouter()
const total = ref(0)
const loading = ref(true)
const space = ref<API.SpaceVO>()
const pictureIdList = ref<number[]>([])
const userSpaceInfo=ref()

/**
 * 搜索条件
 */
const searchParams = reactive<API.PictureQueryDto>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend'
})
//图片的分页
const doChangePages = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchSpacePicture()
}

//获取个人空间图片信息
const fetchSpacePicture = async () => {
  loading.value = true

  const res = await getListPictureByVoUsingPost({
    spaceId: props.id,
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

/**
 * 空间信息的加载
 */
const fetchSpace = async () => {
  const res = await getSpaceByIdVoUsingGet({
    id: props.id
  })
  if (res.code === 0) {
    space.value = res.data
  } else {
    message.error('获取空间信息失败' + res.data)
  }

}


/**
 * 搜索
 */
const doSearch = async () => {
  searchParams.current = 1
  await fetchSpacePicture()
}

onMounted(() => {
  fetchSpacePicture()
  fetchSpace()
})
//颜色搜索
const onColorChange = async (color) => {
  const res = await searchPictureByColorUsingPost({
    spaceId: props.id,
    picColor: color
  })
  if (res.code === 0) {
    pictureList.value = res.data ?? []
    total.value = res.data?.length ?? 0
  } else {
    message.error('使用颜色搜索图片失败', res.data)
  }
}

const editPictureByBatch = ref()
// 批量编辑
const doEditByBatch = () => {
  pictureList.value.forEach((item) => {
    pictureIdList.value.push(item.id)
  })
  if (editPictureByBatch.value) {
    editPictureByBatch.value.openModal()
  }
}

const onSuccess = () => {
  fetchSpacePicture()
}

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value?.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE)
const canUploadPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD)
const canEditPicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDeletePicture = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

const toUserSpaceInfo=()=>{
  if(userSpaceInfo.value){
    userSpaceInfo.value.openModal()
  }
}

//当传入的id发生变化时，重新加载数据
watch(() => props.id,
  (newSpaceId) => {
    fetchSpace()
    fetchSpacePicture()
  }
)
</script>

<style scoped>

</style>
