<template>
  <div class='user-space-info'>
    <a-modal v-model:open='visible' title='空间详情' :footer='false' @cancel='closeModal'>
      <a-card  :bordered='false'>
        <a-card-meta :title="space?.user?.userName" :description="`账号:${space?.user?.userAccount}`">
          <template #avatar>
            <a-avatar :src="space?.user?.userAvatar " />
          </template>
        </a-card-meta>
        <a-space style='margin-top: 20px' direction='vertical'>
          <a-typography-paragraph>已用空间：{{formatSize(space?.totalSize)}}</a-typography-paragraph>
          <a-typography-paragraph>最大空间：{{formatSize(space?.maxSize)}}</a-typography-paragraph>
          <a-typography-paragraph>图片数量：{{space?.totalCount}}</a-typography-paragraph>
          <a-typography-paragraph>最大数量：{{space?.maxCount}}</a-typography-paragraph>
          <a-typography-paragraph>空间类型：{{space?.spaceType ===0 ? '私有空间' : '团队空间'}}</a-typography-paragraph>
          <a-typography-paragraph>创建时间：{{ dayjs(space?.createTime).format('YYYY-MM-DD')}}</a-typography-paragraph>
        </a-space>
      </a-card>
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, ref } from 'vue'
import { formatSize } from '../utils/index'
import dayjs from 'dayjs'

interface Props {
  space: API.SpaceVO
}

const props= defineProps<Props>()



const visible = ref(false)



const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}

//暴露函数
defineExpose({
  openModal
})
</script>

<style scoped>
.user-space-info {
}
</style>
