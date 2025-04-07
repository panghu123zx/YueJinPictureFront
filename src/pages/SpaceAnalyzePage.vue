<template>
  <div id='space-analyze-page'>
    <h2>
      <span v-if='queryAll'> 全部空间</span>
      <span v-else-if='queryPublic'> 公共空间</span>
      <span v-else>
      <a :href="`/space/${spaceId}`" target='_blank'>个人空间</a>
    </span>
    </h2>
    <a-row :gutter='[16,16]'>
      <a-col :xs='24' :md='12'>
        <SpaceUsageAnalyzePage :spaceId='spaceId' :queryAll='queryAll' :queryPublic='queryPublic' />
      </a-col>
      <a-col :xs='24' :md='12'>
        <SpaceCategoryAnalyzePage :spaceId='spaceId' :queryAll='queryAll' :queryPublic='queryPublic' />
      </a-col>
      <a-col :xs='24' :md='12'>
        <SpaceTagAnalyzePage :spaceId='spaceId' :queryAll='queryAll' :queryPublic='queryPublic' />
      </a-col>
      <a-col :xs='24' :md='12'>
        <SpaceSizeAnalyzePage :spaceId='spaceId' :queryAll='queryAll' :queryPublic='queryPublic' />
      </a-col>
      <a-col :xs='24' :md='12'>
        <SpaceUserAnalyzePage :spaceId='spaceId' :queryAll='queryAll' :queryPublic='queryPublic' />
      </a-col>
      <a-col :xs='24' :md='12'>
        <SpaceRankAnalyzePage v-if='isAdmin' :spaceId='spaceId' :queryAll='queryAll' :queryPublic='queryPublic' />
      </a-col>

    </a-row>

  </div>
</template>

<script lang='ts' setup>
import { useRoute } from 'vue-router'
import { computed, ref, watchEffect } from 'vue'
import SpaceUsageAnalyzePage from '../components/spaceAnalyze/SpaceUsageAnalyzePage.vue'
import SpaceCategoryAnalyzePage from '../components/spaceAnalyze/SpaceCategoryAnalyzePage.vue'
import SpaceTagAnalyzePage from '../components/spaceAnalyze/SpaceTagAnalyzePage.vue'
import SpaceUserAnalyzePage from '../components/spaceAnalyze/SpaceUserAnalyzePage.vue'
import SpaceRankAnalyzePage from '../components/spaceAnalyze/SpaceRankAnalyzePage.vue'
import SpaceSizeAnalyzePage from '../components/spaceAnalyze/SpaceSizeAnalyzePage.vue'
import { useLoginuserStore } from '../stores/loginuserStore'
import { getLoginUserUsingGet } from '../api/userController'

const route = useRoute()

const spaceId = computed(() => route.query?.spaceId)

const queryAll = computed(() => route.query?.queryAll)

const queryPublic = computed(() => route.query?.queryPublic)

const loginUserStore = useLoginuserStore()
const loginUser = loginUserStore.loginUser
const role=ref(loginUser.userRole)


const isAdmin = computed( () => {
  if(!role.value){
     fetchUser()
  }
  return role.value === "admin"
})

const fetchUser = async () => {
  const res = await getLoginUserUsingGet()
  if (res.code === 0 && res.data) {
    role.value = res.data?.userRole
  }
}


</script>

<style scoped>

</style>
