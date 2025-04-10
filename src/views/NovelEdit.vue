<template>
  <div class="novel-edit">
    <h2>{{ isEdit ? '编辑小说' : '添加小说' }}</h2>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      
      <el-form-item label="作者">
        <el-input v-model="form.author" />
      </el-form-item>
      
      <el-form-item label="分类">
        <el-select v-model="form.category">
          <el-option label="玄幻" value="玄幻" />
          <el-option label="武侠" value="武侠" />
          <el-option label="都市" value="都市" />
          <el-option label="科幻" value="科幻" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option label="连载中" value="连载中" />
          <el-option label="已完结" value="已完结" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="简介">
        <el-input
          v-model="form.description"
          type="textarea"
          rows="4"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="$router.push('/novels')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNovelStore } from '../stores/novelStore'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useNovelStore()

const isEdit = route.params.id !== undefined
const form = ref({
  title: '',
  author: '',
  category: '',
  status: '',
  description: ''
})

onMounted(() => {
  if (isEdit) {
    const novel = store.novels.find(n => n.id === Number(route.params.id))
    if (novel) {
      form.value = { ...novel }
    }
  }
})

const handleSubmit = () => {
  if (!form.value.title || !form.value.author) {
    ElMessage.error('请填写标题和作者')
    return
  }
  
  if (isEdit) {
    store.updateNovel(form.value)
  } else {
    store.addNovel(form.value)
  }
  
  ElMessage.success('保存成功')
  router.push('/novels')
}
</script>

<style scoped>
.novel-edit {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
</style> 