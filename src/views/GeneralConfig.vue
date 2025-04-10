<template>
  <div class="general-config">
    <el-card>
      <template #header>
        <div class="header">
          <h3>通用配置</h3>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="basicConfig" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicConfig.systemName" />
            </el-form-item>
            
            <el-form-item label="管理员邮箱">
              <el-input v-model="basicConfig.adminEmail" />
            </el-form-item>
            
            <el-form-item label="日志保留天数">
              <el-input-number v-model="basicConfig.logRetentionDays" :min="7" :max="90" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="API配置" name="api">
          <el-form :model="apiConfig" label-width="120px">
            <el-form-item label="API密钥">
              <el-input v-model="apiConfig.apiKey" show-password />
            </el-form-item>
            
            <el-form-item label="请求限流">
              <el-input-number v-model="apiConfig.rateLimit" :min="10" :max="100" />
            </el-form-item>
            
            <el-form-item label="缓存时间(秒)">
              <el-input-number v-model="apiConfig.cacheTime" :min="60" :max="3600" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="消息通知" name="notification">
          <el-form :model="notificationConfig" label-width="120px">
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationConfig.emailEnabled" />
            </el-form-item>
            
            <el-form-item label="钉钉通知">
              <el-switch v-model="notificationConfig.dingTalkEnabled" />
            </el-form-item>
            
            <el-form-item label="钉钉Webhook">
              <el-input v-model="notificationConfig.dingTalkWebhook" placeholder="请输入钉钉Webhook地址" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      
      <div class="actions">
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicConfig = ref({
  systemName: '小说小程序管理系统',
  adminEmail: 'admin@example.com',
  logRetentionDays: 30
})

const apiConfig = ref({
  apiKey: 'sk_12345678abcdefgh',
  rateLimit: 60,
  cacheTime: 300
})

const notificationConfig = ref({
  emailEnabled: true,
  dingTalkEnabled: false,
  dingTalkWebhook: ''
})

const handleSave = () => {
  // 实现保存配置的逻辑
  ElMessage.success('配置保存成功')
}
</script>

<style scoped>
.general-config {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  margin-top: 20px;
  text-align: center;
}
</style> 