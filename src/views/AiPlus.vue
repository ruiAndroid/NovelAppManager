<template>
  <div class="ai-plus-module">
    <el-card>
      <template #header>
        <div class="header">
          <h3>创意工坊</h3>
        </div>
      </template>
      <div class="feature-grid">
        <el-card class="feature-card" shadow="hover">
          <div class="feature-icon gen-app">
            <el-icon><DocumentAdd /></el-icon>
          </div>
          <div class="feature-title">小程序生成器</div>
          <div class="feature-desc">一键生成多平台小程序，智能配置，极速上线。</div>
          <el-button type="primary" plain disabled>敬请期待</el-button>
        </el-card>
        <el-card class="feature-card" shadow="hover">
          <div class="feature-icon publish-center">
            <el-icon><Share /></el-icon>
          </div>
          <div class="feature-title">全平台自动发布中心</div>
          <div class="feature-desc">一站式管理与自动发布，覆盖主流小程序平台。</div>
          <el-button type="primary" plain disabled>敬请期待</el-button>
        </el-card>
        <el-card class="feature-card" shadow="hover" disabled>
          <div class="feature-icon not-open">
            <el-icon><Lock /></el-icon>
          </div>
          <div class="feature-title">更多AI+能力</div>
          <div class="feature-desc">更多创意与AI能力，敬请期待后续开放。</div>
          <el-button type="info" plain disabled>暂未开放</el-button>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { DocumentAdd, Share, Lock } from '@element-plus/icons-vue'
// 预留后续AI相关逻辑
</script>

<style scoped>
.ai-plus-module {
  padding: 20px;
}
.header {
  display: flex;
  align-items: center;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
}
.feature-card:hover {
  box-shadow: 0 6px 24px 0 rgba(64,158,255,0.12);
  transform: translateY(-4px) scale(1.03);
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
.feature-icon.publish-center {
  color: #e6a23c;
}
.feature-icon.not-open {
  color: #909399;
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
</style> 