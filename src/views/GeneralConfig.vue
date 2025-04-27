<template>
  <div class="general-config">
    <div class="layout-container">
      <!-- 左侧小程序列表 -->
      <el-card class="app-list-card">
        <template #header>
          <div class="header">
            <h3>小程序列表</h3>
            <div>
              <el-input
                v-model="searchQuery"
                placeholder="搜索小程序"
                style="width: 200px; margin-right: 15px"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="handleRefresh">刷新数据</el-button>
            </div>
          </div>
        </template>

        <div v-loading="loadingApps">
          <template v-if="filteredApps.length === 0">
            <el-empty 
              :image-size="200"
              description="暂无小程序数据"
            >
              <template #description>
                <div class="empty-description">
                  <p>还没有找到任何小程序</p>
                  <p class="sub-text">点击刷新按钮获取最新数据</p>
                </div>
              </template>
              <el-button type="primary" @click="handleRefresh">
                <el-icon><Refresh /></el-icon>
                立即刷新
              </el-button>
            </el-empty>
          </template>
          
          <el-table 
            v-else
            :data="filteredApps" 
            style="width: 100%"
            @row-click="handleAppSelect"
            row-key="id"
            :highlight-current-row="true"
          >
            <el-table-column prop="platform" label="平台" width="80">
              <template #default="scope">
                <el-tag :type="getPlatformType(scope.row.platform)" effect="light" size="small">
                  {{ scope.row.platform }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="appName" label="小程序名称" width="180" />
            <el-table-column prop="appid" label="AppID" width="220" />
          </el-table>
        </div>
      </el-card>

      <!-- 右侧通用配置 -->
      <el-card class="config-card">
        <template #header>
          <div class="header">
            <h3 class="title-with-tag" v-if="selectedApp">
              通用配置 - {{ selectedApp.appName }}
              <el-tag :type="getPlatformType(selectedApp.platform)" effect="light" size="small" class="platform-tag">
                {{ selectedApp.platform }}
              </el-tag>
            </h3>
            <h3 v-else>通用配置</h3>
          </div>
        </template>

        <div class="config-content">
          <template v-if="selectedApp">
            <div class="config-form" v-loading="loadingConfig">
              <template v-if="!configForm.id">
                <el-empty 
                  description="暂无配置信息" 
                  :image-size="100"
                >
                  <template #description>
                    <p>当前小程序尚未配置通用信息</p>
                    <p class="sub-text">点击下方按钮创建配置</p>
                  </template>
                  <el-button type="primary" @click="handleCreateConfig">
                    创建配置
                  </el-button>
                </el-empty>
              </template>
              <template v-else>
                <el-form :model="configForm" label-width="160px">
                  <el-form-item label="配置ID">
                    <span class="readonly-value">{{ configForm.id }}</span>
                  </el-form-item>
                  <el-form-item label="AppID">
                    <span class="readonly-value">{{ configForm.appId }}</span>
                  </el-form-item>

                  <!-- Conditionally show Douyin field -->
                  <template v-if="selectedApp.platform === '抖音'">
                    <el-form-item label="抖音IM ID">
                      <el-input v-model="configForm.douyinImId" placeholder="请输入抖音IM ID" />
                    </el-form-item>
                  </template>

                  <!-- Conditionally show Kuaishou fields -->
                  <template v-if="selectedApp.platform === '快手'">
                    <el-form-item label="快手Client ID">
                      <el-input v-model="configForm.kuaishouClientId" placeholder="请输入快手Client ID" />
                    </el-form-item>
                    <el-form-item label="快手Client Secret">
                      <el-input v-model="configForm.kuaishouClientSecret" placeholder="请输入快手Client Secret" show-password />
                    </el-form-item>
                  </template>

                  <el-form-item label="客服URL">
                    <el-input v-model="configForm.contact" placeholder="请输入客服URL" />
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" @click="handleSaveConfig" :loading="saving">保存配置</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </div>
          </template>
          <template v-else>
            <el-empty 
              description="请先选择一个小程序" 
              :image-size="200"
            >
              <template #description>
                <p>请从左侧列表选择一个小程序以进行通用配置</p>
              </template>
            </el-empty>
          </template>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import request from '../utils/request'

// 状态变量
const searchQuery = ref('')
const loadingApps = ref(false)
const loadingConfig = ref(false)
const saving = ref(false)
const apps = ref([])
const selectedApp = ref(null)
const configForm = ref({
  id: null,
  appId: '',
  contact: '',
  douyinImId: '',
  kuaishouClientId: '',
  kuaishouClientSecret: ''
})

// 过滤小程序列表
const filteredApps = computed(() => {
  if (!searchQuery.value) return apps.value
  return apps.value.filter(app => 
    app.appName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    app.appid.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 获取小程序列表
const fetchApps = async () => {
  loadingApps.value = true
  try {
    const res = await request.get('/api/novel-apps/appLists')
    const data = res.data
    
    let appList = []
    Object.values(data).forEach(platformApps => {
      appList = [...appList, ...platformApps.map(app => ({
        id: app.id,
        platform: getPlatformName(app.platform),
        appName: app.appName,
        appid: app.appid
      }))]
    })
    
    apps.value = appList
  } catch (error) {
    console.error('获取小程序列表失败:', error)
    ElMessage.error('获取小程序列表失败')
    apps.value = []
  } finally {
    loadingApps.value = false
  }
}

// 获取通用配置
const fetchConfig = async (appId) => {
  if (!appId) return
  
  loadingConfig.value = true
  try {
    const res = await request.get('/api/novel-common/getAppCommonConfig', {
      params: { appId }
    })
    if (res.code === 200) {
      configForm.value = {
        id: res.data.id || null,
        appId: res.data.appId || '',
        contact: res.data.contact || '',
        douyinImId: res.data.douyinImId || '',
        kuaishouClientId: res.data.kuaishouClientId || '',
        kuaishouClientSecret: res.data.kuaishouClientSecret || ''
      }
    } else {
      throw new Error(res.message || '获取配置失败')
    }
  } catch (error) {
    console.error('获取配置失败:', error)
    // ElMessage.error(error.message || '获取配置失败')
    // 重置配置表单
    configForm.value = {
      id: null,
      appId: selectedApp.value.appid,
      contact: '',
      douyinImId: '',
      kuaishouClientId: '',
      kuaishouClientSecret: ''
    }
  } finally {
    loadingConfig.value = false
  }
}

// 平台类型和名称转换
const getPlatformType = (platform) => {
  const types = {
    '抖音': 'info',
    '快手': 'danger',
    '微信': 'success',
    '百度': 'primary'
  }
  return types[platform] || 'info'
}

const getPlatformName = (platformCode) => {
  const platforms = {
    'douyin': '抖音',
    'kuaishou': '快手',
    'weixin': '微信',
    'baidu': '百度'
  }
  return platforms[platformCode] || platformCode
}

// 刷新列表
const handleRefresh = () => {
  fetchApps()
}

// 选择小程序
const handleAppSelect = (row) => {
  selectedApp.value = row
  fetchConfig(row.appid)
}

// 保存配置
const handleSaveConfig = async () => {
  if (!selectedApp.value?.appid) {
    ElMessage.warning('请先选择小程序')
    return
  }

  saving.value = true
  try {
    // 只提交必要的字段
    const requestData = {
      id: configForm.value.id,
      appId: selectedApp.value.appid,
      contact: configForm.value.contact,
      douyinImId: configForm.value.douyinImId,
      kuaishouClientId: configForm.value.kuaishouClientId,
      kuaishouClientSecret: configForm.value.kuaishouClientSecret
    }

    const res = await request.post('/api/novel-common/updateAppCommonConfig', requestData)
    
    if (res.code === 200) {
      ElMessage.success('配置保存成功')
    } else {
      throw new Error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error(error.message || '保存配置失败')
  } finally {
    saving.value = false
  }
}

// 创建配置
const handleCreateConfig = async () => {
  if (!selectedApp.value?.appid) {
    ElMessage.warning('请先选择小程序')
    return
  }

  saving.value = true
  try {
    // 只提交必要的字段
    const requestData = {
      appId: selectedApp.value.appid,
      contact: configForm.value.contact,
      douyinImId: configForm.value.douyinImId,
      kuaishouClientId: configForm.value.kuaishouClientId,
      kuaishouClientSecret: configForm.value.kuaishouClientSecret
    }

    const res = await request.post('/api/novel-common/createAppCommonConfig', requestData)
    
    if (res.code === 200) {
      ElMessage.success('配置创建成功')
      // 直接使用返回的数据更新表单
      configForm.value = {
        id: res.data.id,
        appId: res.data.appId,
        contact: res.data.contact || '',
        douyinImId: res.data.douyinImId || '',
        kuaishouClientId: res.data.kuaishouClientId || '',
        kuaishouClientSecret: res.data.kuaishouClientSecret || ''
      }
    } else {
      throw new Error(res.message || '创建失败')
    }
  } catch (error) {
    console.error('创建配置失败:', error)
    ElMessage.error(error.message || '创建配置失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchApps()
})
</script>

<style scoped>
.general-config {
  padding: 20px;
}

.layout-container {
  display: flex;
  gap: 20px;
}

.app-list-card {
  flex: 0 0 500px;
  max-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.app-list-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.app-list-card .el-table {
  height: 100%;
}

.app-list-card :deep(.el-card__body)::-webkit-scrollbar {
  width: 6px;
}

.app-list-card :deep(.el-card__body)::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.app-list-card :deep(.el-card__body)::-webkit-scrollbar-track {
  background: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-card {
  flex: 1;
  min-width: 0;
}

.config-content {
  min-height: 200px;
}

.title-with-tag {
  display: flex;
  align-items: center;
  margin: 0;
}

.platform-tag {
  margin-left: 8px;
}

.empty-description {
  text-align: center;
  color: #909399;
}

.empty-description .sub-text {
  font-size: 12px;
  margin-top: 8px;
  color: #C0C4CC;
}

.el-empty {
  padding: 40px 0;
}

.config-form {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.readonly-value {
  color: #606266;
  font-size: 14px;
}

.sub-text {
  font-size: 12px;
  margin-top: 8px;
  color: #C0C4CC;
}
</style> 