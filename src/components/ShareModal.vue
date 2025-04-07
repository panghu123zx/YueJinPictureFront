<template>
  <div>
    <a-modal v-model:open='visible' title='分享图片' :footer='false' @cancel='closeModal' style='text-align: center;'>
      <a-image :src='url' :height='100'/>
      <p>复制图片链接</p>
      <a-typography-link copyable>{{ link }}</a-typography-link>
      <p style='margin-top: 16px;'>手机扫码查看</p>
      <a-qrcode :value='link' style='margin-left: 34%;'/>
    </a-modal>
  </div>
</template>

<script lang='ts' setup>
import { defineExpose, defineProps, ref, withDefaults } from 'vue'
import { Empty } from 'ant-design-vue';

interface Props {
  title: string,
  link: string,
  url: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '分享图片',
  link: 'https://www.baidu.com',
  url: `${Empty.PRESENTED_IMAGE_SIMPLE}`
})


const visible = ref(false)

const openModal = () => {
  visible.value = true
}

const closeModal = () => {
  visible.value = false
}


defineExpose({
  openModal,
})
</script>

<style scoped>

</style>
