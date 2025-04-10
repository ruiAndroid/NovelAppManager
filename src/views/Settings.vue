<template>
  <div class="settings">
    <el-card>
      <template #header>
        <h3>系统设置</h3>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础设置" name="basic">
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="小程序名称">
              <el-input v-model="basicSettings.appName" />
            </el-form-item>
            
            <el-form-item label="小程序简介">
              <el-input
                v-model="basicSettings.description"
                type="textarea"
                rows="4"
              />
            </el-form-item>
            
            <el-form-item label="联系方式">
              <el-input v-model="basicSettings.contact" />
            </el-form-item>
            
            <el-form-item label="版权信息">
              <el-input v-model="basicSettings.copyright" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="阅读设置" name="reading">
          <el-form :model="readingSettings" label-width="120px">
            <el-form-item label="默认字体大小">
              <el-input-number v-model="readingSettings.fontSize" :min="12" :max="24" />
            </el-form-item>
            
            <el-form-item label="默认主题">
              <el-select v-model="readingSettings.theme">
                <el-option label="浅色" value="light" />
                <el-option label="深色" value="dark" />
                <el-option label="护眼" value="eye" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="章节缓存数">
              <el-input-number v-model="readingSettings.cacheChapters" :min="5" :max="50" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="支付设置" name="payment">
          <el-form :model="paymentSettings" label-width="120px">
            <el-form-item label="微信支付商户号">
              <el-input v-model="paymentSettings.merchantId" />
            </el-form-item>
            
            <el-form-item label="商户密钥">
              <el-input v-model="paymentSettings.merchantKey" show-password />
            </el-form-item>
            
            <el-form-item label="支付通知地址">
              <el-input v-model="paymentSettings.notifyUrl" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="actions">
        <el-button type="primary" @click="handleSave">保存设置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicSettings = ref({
  appName: '我的小说小程序',
  description: '一个优秀的小说阅读小程序',
  contact: 'admin@example.com',
  copyright: '© 2024 小说小程序'
})

const readingSettings = ref({
  fontSize: 16,
  theme: 'light',
  cacheChapters: 20
})

const paymentSettings = ref({
  merchantId: '',
  merchantKey: '',
  notifyUrl: ''
})

const handleSave = () => {
  // 实现保存设置的逻辑
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.actions {
  margin-top: 20px;
  text-align: center;
}
</style> 