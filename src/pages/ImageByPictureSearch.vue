<template>
  <div id='imageSearch'>
    <h2 style='margin-bottom: 16px;'>以图搜图</h2>
    <h3 style='margin-bottom: 16px;'>原图</h3>
    <a-image :src='picture?.url' style='height: 300px' />
    <div style='margin-bottom: 16px;' />

    <h3 style='margin-bottom: 16px;'>识图结果</h3>
    <a-list
      :grid='{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }'
      :data-source='pictureList'
      :loading='loading'
    >
      <template #renderItem='{item :picture}'>
        <a-list-item style='padding: 10px'>
          <a :href='picture.fromUrl'>
            <a-card hoverable style='width: 240px;'>
              <template #cover>
                <img :src='picture.thumbUrl' style='height: 180px' />
              </template>
            </a-card>
          </a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router'
import { getPictureByIdVoUsingGet, imageSearchUsingPost } from '../api/pictureController'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'

const route = useRoute()

const pictureId = computed(() => route.query?.pictureId)
const picture = ref<API.PictureVO>()

const pictureList = ref<API.ImageSearchDto[]>([])
const loading = ref(false)

//获取原图数据
const fetchPicture = async () => {
  const id = route.query?.pictureId
  if (id === null) {
    message.error('图片错误')
    return
  }
  const res = await getPictureByIdVoUsingGet({
    id: id
  })
  if (res.code === 0) {
    picture.value = res.data
  } else {
    message.error('获取图片错误' + res.data)
  }
}
//得到以图搜图数据
const getImageList = async () => {
  loading.value = true
  const res = await imageSearchUsingPost({
    pictureId: pictureId.value
  })
  if (res.code === 0) {
    pictureList.value = res.data
  } else {
    message.error('以图搜图' + res.data)
  }
  loading.value = false
}


onMounted(() => {
  fetchPicture()
  getImageList()
})


</script>

<style scoped>
#imageSearch {
}
</style>
