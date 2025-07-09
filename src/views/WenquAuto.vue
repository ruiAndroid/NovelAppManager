<template>
  <div class="wenqu-auto-module">
    <el-card>
      <template #header>
        <div class="header">
          <h3>文曲小程序自动化工厂</h3>
        </div>
      </template>
      <div class="feature-grid">
        <el-card class="feature-card" shadow="hover" @click="goToCreate">
          <div class="feature-icon gen-app">
            <el-icon><DocumentAdd /></el-icon>
          </div>
          <div class="feature-title">生产小程序</div>
          <div class="feature-desc">流水线自动批量生产小程序</div>
          <div class="expert-tag">
            <el-tag type="primary" effect="dark" size="large">
              <el-icon><Star /></el-icon>
              <span>产品级</span>
            </el-tag>
          </div>
        </el-card>
        <el-card class="feature-card" shadow="hover" @click="goToBuild">
          <div class="feature-icon build-app">
            <el-icon><Tools /></el-icon>
          </div>
          <div class="feature-title">编译小程序</div>
          <div class="feature-desc">构建系统，快速编译可执行小程序包</div>
          <div class="expert-tag">
            <el-tag type="success" effect="dark" size="large">
              <el-icon><Star /></el-icon>
              <span>专家级</span>
            </el-tag>
          </div>
        </el-card>
        <el-card class="feature-card" shadow="hover" @click="goToPublish">
          <div class="feature-icon publish-center">
            <el-icon><Share /></el-icon>
          </div>
          <div class="feature-title">发布小程序</div>
          <div class="feature-desc">集成自动发布/预览生成二维码，覆盖主流小程序平台</div>
          <div class="expert-tag">
            <el-tag type="warning" effect="dark" size="large">
              <el-icon><Star /></el-icon>
              <span>工程师级</span>
            </el-tag>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { DocumentAdd, Share, Tools, Star } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToBuild = () => {
  router.push('/auto-build')
}

const goToPublish = () => {
  router.push('/auto-publish')
}

const goToCreate = () => {
  router.push('/auto-create')
}
</script>

<style scoped>
.wenqu-auto-module {
  padding: 20px;
}
.header {
  display: flex;
  align-items: center;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-top: 32px;
}
.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 260px;
  border-radius: 16px;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
  padding: 32px 16px 24px 16px;
  background: linear-gradient(135deg, #f8fafc 60%, #f0f5ff 100%);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.feature-card:hover {
  box-shadow: 0 6px 24px 0 rgba(64,158,255,0.12);
  transform: translateY(-4px) scale(1.03);
}
.feature-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.1) 0%, rgba(103, 194, 58, 0) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.feature-card:hover::after {
  opacity: 1;
}
.feature-icon {
  font-size: 48px;
  margin-bottom: 18px;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.feature-icon.gen-app {
  color: #67c23a;
}
.feature-icon.build-app {
  color: #f56c6c;
}
.feature-icon.publish-center {
  color: #e6a23c;
}
.feature-icon.not-open {
  color: #909399;
}
.feature-icon.generate-app {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}
.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
  text-align: center;
}
.feature-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 18px;
  text-align: center;
  min-height: 40px;
}
.el-button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
.expert-tag {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.expert-tag :deep(.el-tag) {
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
}

.expert-tag :deep(.el-tag span) {
  /* 移除所有垂直对齐相关的属性，完全依赖父级flex布局 */
  /* margin-top: -0.5px; */
}

.expert-tag :deep(.el-icon) {
  /* 移除所有垂直对齐相关的属性，完全依赖父级flex布局 */
  /* position: relative; */
  /* top: -0.5px; */
  /* transform: translateY(...); */
  /* margin-right: 4px; */
}
</style> 