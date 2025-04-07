<template>
  <div id='AddPicture'>
    <a-typography-paragraph v-if='spaceId'>上传图片至: <a :href='`/space/${spaceId}`'
                                                     target='_blank'>{{ space?.spaceType === 0 ? '个人空间' : '团队空间' }}</a>
    </a-typography-paragraph>

    <div style='margin-bottom: 16px;' />

    <a-row :gutter='[16,16]'>
      <a-col :span='picture ? 15 : 24'  >
        <a-tabs v-model:activeKey='activeKey' style='max-width: 800px; text-align: center;margin: auto '>
          <a-tab-pane key='file' tab='文件上传'>
            <PictureUpload :picture='picture' :spaceId='spaceId' :onSuccess='onSuccess' />
          </a-tab-pane>
          <a-tab-pane key='url' tab='url上传' force-render>
            <UrlUpload :picture='picture' :spaceId='spaceId' :onSuccess='onSuccess' />
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span='picture ? 9 : 0'  v-if='picture'>
        <a-card>
          <div class='editCropper'>
            <a-space v-if='picture' class='btn'>
              <a-button :icon='h(EditOutlined)' @click='editPicture'>编辑图片</a-button>
              <a-button type='primary' ghost :icon='h(FullscreenOutlined)' @click='editPictureByAi'>AI扩图</a-button>
            </a-space>
            <PictureCropper ref='pictureCropper' :picture='picture' :imgUrl='picture?.url' :spaceId='spaceId' :space='space'
                            :onSuccess='onSuccess' />
            <EnlargingPictureByAi ref='enlrgingPictureRef' :spaceId='spaceId' :picture='picture' :onSuccess='onSuccess' />
          </div>
          <div style='margin-bottom: 16px;' />
          <a-form

            :model='formData'
            name='basic'
            layout='vertical'
            autocomplete='off'
            @finish='onFinish'
            @finishFailed='onFinishFailed'
          >
            <a-form-item
              label='名称'
              name='name'
              :rules="[{  message: '请输入名称' }]"
            >
              <a-input v-model:value='formData.name' />
            </a-form-item>

            <a-form-item
              label='简介'
              name='introduction'
            >
              <a-textarea v-model:value='formData.introduction' placeholder='请输入简介' :rows='1' />
            </a-form-item>

            <a-form-item label='分类' name='category'>
              <a-select
                v-model:value='formData.category'
                placeholder='请输入分类'
                allow-clear
              >
                <a-select-option v-for='cat in categoryTagList?.categoryList' :key='cat'>{{ cat }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item name='tags' label='标签'>
              <a-select
                v-model:value='formData.tags'
                mode='tags'
                placeholder='请输入标签'
                allow-clear
              >
                <a-select-option v-for='tag in categoryTagList?.tagList' :key='tag'>{{ tag }}</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-button type='primary' html-type='submit' style='min-width: 100%;' @click='doEditPicture'>创建</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>




  </div>
</template>
<script lang='ts' setup>
import PictureUpload from '../components/PictureUpload.vue'
import { FullscreenOutlined, EditOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, ref, h, watchEffect } from 'vue'
import PictureEditDto = API.PictureEditDto
import {
  editPictureUsingPost,
  getPictureByIdVoUsingGet,
  listPictureTagCategoryUsingGet
} from '../api/pictureController'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import UrlUpload from '../components/UrlUpload.vue'
import PictureCropper from '../components/PictureCropper.vue'
import EnlargingPictureByAi from '../components/EnlargingPictureByAi.vue'
import { getSpaceByIdUsingGet, getSpaceByIdVoUsingGet } from '../api/spaceController'

const picture = ref<API.PictureVO>()
const router = useRouter()
const route = useRoute()
const pictureCropper = ref()
const enlrgingPictureRef = ref()
const space = ref<API.SpaceVO>()

const spaceId = computed(() => {
  return route.query?.spaceId
})

const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  formData.value.name = newPicture.name
}

const formData = ref<API.PictureEditDto>({})

const categoryTagList = ref<API.PictureTagCategory>()

const activeKey = ref<'file' | 'url'>('file')


const fetchCategoryAndTags = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.code === 0) {
    categoryTagList.value = res.data
  }
}

onMounted(() => {
  fetchCategoryAndTags()
})

//上传图片
const doEditPicture = async () => {
  const pictureId = picture.value.id
  if (pictureId === undefined) {
    message.error('图片上传失败')
    return
  }
  const res = await editPictureUsingPost({
    spaceId: spaceId.value as number,
    id: pictureId ,
    ...formData.value
  })
  if (res.code === 0) {
    message.success('图片创建成功')
    await router.push({
      path: `/picture/${pictureId}`
    })
  } else {
    message.error('图片创建失败')
  }
}

const getOldPicture = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getPictureByIdVoUsingGet({
      id: id as number
    })
    if (res.code === 0) {
      const data = res.data
      picture.value = data
      formData.value.name = data.name
      formData.value.introduction = data.introduction
      formData.value.tags = data.tags
      formData.value.category = data.category
    }
  }
}

const fetchSpaceData = async () => {
  if (spaceId.value) {
    const res = await getSpaceByIdVoUsingGet({
      id: spaceId.value
    })
    if (res.code === 0) {
      space.value = res.data
    }
  }
}

const editPicture = () => {
  if (pictureCropper.value) {
    pictureCropper.value.openModal()
  }
}

const editPictureByAi = () => {
  if (enlrgingPictureRef.value) {
    enlrgingPictureRef.value.openModal()
  }
}

watchEffect(() => {
  fetchSpaceData()
})

onMounted(() => {
  getOldPicture()

})

</script>

<style scoped>
#AddPicture {
  max-width: 1524px;
  margin: 0 auto;
}

.editCropper {
  text-align: center;
  margin: 16px 0;
}
</style>
