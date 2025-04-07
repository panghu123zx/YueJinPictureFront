<template>
  <div id='AddSpace'>
    <h2> {{ id ? '更新' : '创建' }} {{ SPACE_TYPE_MAP[spaceType] }}</h2>
    <div style='margin-bottom: 16px;'></div>
    <a-form
      :model='formData'
      name='basic'
      layout='vertical'
      autocomplete='off'
      @finish='onFinish'
      @finishFailed='onFinishFailed'
    >
      <a-form-item
        label='空间名称'
        name='spaceName'
        :rules="[{ require:true ,message: '必须填充空间名称' }]"
      >
        <a-input v-model:value='formData.spaceName' placeholder='请输入空间名称' />
      </a-form-item>
      <a-form-item label='空间级别' name='spaceLevel'>
        <a-select
          v-model:value='formData.spaceLevel'
          placeholder='请输入空间级别'
          :options='SPACE_LEVEL_OPTIONS'
          style='min-width: 180px'
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type='primary' html-type='submit' style='min-width: 100%;' @click='doAddSpace'>提交</a-button>
      </a-form-item>
    </a-form>
    <a-card title='空间级别介绍'>
      <a-typography-paragraph>
        * 目前只支持开通普通版，如需升级空间，请联系 <a href='https://github.com/panghu123zx' target='_blank'>管理员</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for='level in spaceLevelData' :key='level'>
        {{ level.text }}: 大小 {{ formatSize(level.maxSize) }}, 数量: {{ level.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>

</template>
<script lang='ts' setup>
import { computed, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { SPACE_LEVEL_MAP, SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS } from '../constants/space'
import {
  addSpaceUsingPost,
  getSpaceByIdVoUsingGet,
  getSpaceLevelUsingGet, updateSpaceUsingPost
} from '../api/spaceController'
import { formatSize } from '../utils/index'
import { SPACE_TYPE_ENUM, SPACE_TYPE_MAP } from '../constants/spaceuser'
import { number } from 'echarts/core'


const route = useRoute()
const id = route.query?.id

const formData = ref<API.SpaceAddDto | API.SpaceEditDto>({
  spaceLevel: SPACE_LEVEL_ENUM.COMMON
})


const router = useRouter()
const loading = ref<boolean>(false)

const spaceType = computed(() => {
  if (route.query?.type) {
    return Number(route.query.type)
  }
  return SPACE_TYPE_ENUM.PRIVATE
})

//创建空间
const doAddSpace = async () => {
  loading.value = true
  let res
  if (id) {
    //id存在就是更新
    res = await updateSpaceUsingPost({
      id: id,
      ...formData.value
    })
  } else {
    res = await addSpaceUsingPost({
      ...formData.value,
      spaceType: spaceType.value
    })
  }

  if (res.code === 0) {
    message.success('空间创建成功')
    const path = `/space/${id ?? res.data}`
    router.push({
      path
    })
  } else {
    message.error('空间创建失败:' + res.data)
  }
  loading.value = false
}
const spaceLevelData = ref<API.SpaceLevel[]>([])

/**
 * 获取空间级别信息
 */
const fetchSpaceLevel = async () => {
  const res = await getSpaceLevelUsingGet()
  if (res.code === 0) {
    spaceLevelData.value = res.data
  } else {
    message.error('获取空间级别介绍失败')
  }
}

const getOldSpaceInfo = async () => {
  if (!id) {
    return
  }
  const res = await getSpaceByIdVoUsingGet({ id })
  if (res.code === 0) {
    formData.value = res.data
  } else {
    message.error('获取个人空间信息失败：' + res.data)
  }
}

onMounted(() => {
  fetchSpaceLevel()
  getOldSpaceInfo()
})


</script>

<style scoped>
#AddSpace {
  max-width: 720px;
  margin: 0 auto;
}
</style>
