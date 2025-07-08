<template>
  <div class="wenqu-ai-page">
    <el-card>
      <template #header>
        <div class="header">
          <h3>文曲AI能力中心</h3>
        </div>
      </template>
      <div class="feature-grid">
        <el-card class="feature-card" shadow="hover" disabled>
          <div class="feature-icon not-open">
            <el-icon><Lock /></el-icon>
          </div>
          <div class="feature-title">小文问答</div>
          <div class="feature-desc">敬请期待，文曲AI驱动的智能对话/向导能力。</div>
          <el-button type="info" plain disabled>暂未开放</el-button>
        </el-card>
        <el-card class="feature-card" shadow="hover" disabled>
          <div class="feature-icon not-open">
            <el-icon><Lock /></el-icon>
          </div>
          <div class="feature-title">文曲智能体</div>
          <div class="feature-desc">敬请期待，由文曲提供支持的智能体能力。</div>
          <el-button type="info" plain disabled>暂未开放</el-button>
        </el-card>
        <el-card class="feature-card" shadow="hover" disabled>
          <div class="feature-icon not-open">
            <el-icon><Lock /></el-icon>
          </div>
          <div class="feature-title">MCP能力</div>
          <div class="feature-desc">敬请期待，MCP相关AI能力即将开放。</div>
          <el-button type="info" plain disabled>暂未开放</el-button>
        </el-card>
        <el-card class="feature-card" shadow="hover" disabled>
          <div class="feature-icon not-open">
            <el-icon><Lock /></el-icon>
          </div>
          <div class="feature-title">更多AI能力</div>
          <div class="feature-desc">更多创意与AI能力，敬请期待后续开放。</div>
          <el-button type="info" plain disabled>暂未开放</el-button>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Lock } from '@element-plus/icons-vue'
</script>

<style scoped>
.wenqu-ai-page {
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