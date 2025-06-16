<template>
  <div class="generate-app-container">
    <el-card class="workflow-container">
      <template #header>
        <div class="header">
          <h3>小程序生成</h3>
        </div>
      </template>
      <div class="workflow-content">
        <div class="placeholder-content">
          <el-empty description="小程序生成模块开发中..." />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppGenerationStore } from '../../stores/appGenerationStore'; // 导入 Pinia store

const route = useRoute();
const appGenerationStore = useAppGenerationStore(); // 使用 Pinia store

onMounted(() => {
  // 从 Pinia store 获取配置数据
  const configData = appGenerationStore.getConfigData();
  console.log('Received config data from Pinia:', configData);
  // TODO: 使用配置数据开始生成流程
});
</script>

<style scoped>
.generate-app-container {
  padding: 20px;
}

.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.workflow-content {
  padding: 20px;
}

.placeholder-content {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}
</style> 