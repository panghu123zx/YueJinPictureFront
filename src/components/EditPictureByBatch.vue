<template>
  <div class='editPicture'>
    <a-modal v-model:open='visible' title='批量编辑图片' :footer='false' @cancel='closeModal'>
      <a-typography-paragraph>* 只对当前界面图片生效</a-typography-paragraph>

      <a-form layout='vertical' :model='editPicture'>
        <a-form-item label='分类' name='category'>
          <a-select
            v-model:value='editPicture.category'
            placeholder='请输入分类'
            style='min-width: 180px'
            allow-clear
          >
            <a-select-option v-for='cat in categoryTagList?.categoryList' :key='cat'>{{ cat }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name='tags' label='标签'>
          <a-select
            v-model:value='editPicture.tags'
            mode='tags'
            placeholder='请输入标签'
            style='min-width: 180px'
            allow-clear
          >
            <a-select-option v-for='tag in categoryTagList?.tagList' :key='tag'>{{ tag }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label='命名规则'>
          <a-input v-model:value='editPicture.nameRule' placeholder='请输入命名规则: 名称_1' />
        </a-form-item>
        <a-form-item>
          <a-button type='primary' @click='doSubmit' :loading='loading'>提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, onMounted, ref } from 'vue'
import { editPictureByBatchUsingPost, listPictureTagCategoryUsingGet } from '../api/pictureController'
import { message } from 'ant-design-vue'

interface Props {
  pictureIdList: number[],
  spaceId: '',
  onSuccess: ()=> ''
}

const loading = ref(false)

const props = defineProps<Props>()

const editPicture = ref<API.PictureEditByBatchDto>({})
const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

const categoryTagList = ref<API.PictureTagCategory>()
const fetchCategoryAndTags = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.code === 0) {
    categoryTagList.value = res.data
  }
}

onMounted(() => {
  fetchCategoryAndTags()
})

//提交编辑
const doSubmit = async () => {
  loading.value= true
  const pictureIdList = props.pictureIdList
  if (pictureIdList.length === 0) {
    message.error('图片为空')
    return
  }
  editPicture.value.pictureIdList = pictureIdList
  editPicture.value.spaceId = props.spaceId
  const res = await editPictureByBatchUsingPost({
    ...editPicture.value
  })
  if (res.code === 0) {
    message.success('批量编辑图片成功')
    closeModal()
    //刷新界面
    props?.onSuccess()
  } else {
    message.error('批量编辑图片失败', res.data)
  }
  loading.value= false
}
//暴露函数
defineExpose({
  openModal
})
</script>

<style scoped>
.editPicture {
}
</style>
