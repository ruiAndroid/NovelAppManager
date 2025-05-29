<template>
  <div class="ai-publish-module">
    <el-card class="publish-container">
      <template #header>
        <div class="header">
          <div class="header-left">
            <el-button @click="goBack" link>
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <h3>全平台自动发布中心</h3>
          </div>
          <div class="header-right">
            <el-tag type="warning" effect="dark">工程师级</el-tag>
          </div>
        </div>
      </template>

      <div class="publish-content">
        <!-- 步骤指示器 -->
        <el-steps :active="currentStep" finish-status="success" class="publish-steps" align-center>
          <el-step title="选择小程序" description="选择已构建完成的小程序" />
          <el-step title="选择平台" description="选择要发布的平台" />
          <el-step title="配置信息" description="配置发布参数" />
          <el-step title="开始发布" description="执行发布过程" />
          <el-step title="发布完成" description="查看结果" />
        </el-steps>

        <!-- 步骤内容 -->
        <div class="step-content">
          <!-- 步骤1：选择小程序 -->
          <div v-if="currentStep === 0" class="step-panel">
            <div class="search-bar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索小程序名称或平台"
                class="search-input"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>

            <div class="app-list">
              <el-table
                :data="filteredBuildList"
                style="width: 100%"
                :highlight-current-row="true"
                v-loading="loading"
              >
                <el-table-column prop="appName" label="小程序名称" min-width="200" />
                <el-table-column label="已构建平台" min-width="300">
                  <template #default="scope">
                    <div class="platform-tags">
                      <el-tag
                        v-for="platform in scope.row.platforms"
                        :key="platform.platformCode"
                        :type="getPlatformTagType(platform.platformCode)"
                        effect="light"
                        class="platform-tag"
                      >
                        {{ platform.platformName }}
                      </el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      link
                      @click="handleSelectBuild(scope.row)"
                    >
                      选择
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 步骤2：选择平台 -->
          <div v-if="currentStep === 1" class="step-panel">
            <div class="platform-header">
              <h4>选择发布平台</h4>
              <p class="platform-subtitle">请选择要发布的目标平台</p>
            </div>
            <div class="platform-grid">
              <el-card 
                v-for="platform in availablePlatforms" 
                :key="platform.code"
                class="platform-card"
                :class="{ 'selected': selectedPlatform === platform.code }"
                @click="handleSelectPlatform(platform.code)"
                shadow="hover"
                :style="{
                  background: `linear-gradient(135deg, ${platform.light} 60%, #fff 100%)`,
                  color: '#222',
                  borderColor: selectedPlatform === platform.code ? platform.color : 'transparent'
                }"
              >
                <div class="platform-icon" :style="{ color: platform.color }">
                  <el-icon><component :is="platform.icon" /></el-icon>
                </div>
                <div class="platform-info">
                  <div class="platform-name">{{ platform.name }}</div>
                  <div class="platform-desc">{{ platform.desc }}</div>
                </div>
                <div class="platform-status" v-if="selectedPlatform === platform.code">
                  <el-icon><Check /></el-icon>
                </div>
              </el-card>
            </div>
            <div class="step-actions">
              <el-button @click="currentStep = 0">上一步</el-button>
              <el-button type="primary" @click="nextStep" :disabled="!selectedPlatform">
                下一步
              </el-button>
            </div>
          </div>

          <!-- 步骤3：配置信息 -->
          <div v-if="currentStep === 2" class="step-panel">
            <div class="publish-summary-card gradient-card" :style="selectedPlatform ? {background: `linear-gradient(120deg, ${platforms.find(p=>p.code===selectedPlatform)?.light} 60%, #fff 100%)`} : {}">
              <div class="summary-row platform-row">
                <div class="platform-icon-big" :style="{ color: platforms.find(p=>p.code===selectedPlatform)?.color }">
                  <el-icon style="font-size:32px"><component :is="platforms.find(p=>p.code===selectedPlatform)?.icon" /></el-icon>
                </div>
                <div class="platform-info-block">
                  <div class="platform-label">发布平台</div>
                  <el-tag :type="getPlatformTagType(selectedPlatform)" effect="dark" size="large">
                    {{ getPlatformName(selectedPlatform) }}
                  </el-tag>
                </div>
              </div>
              <el-divider class="summary-divider" />
              <div class="summary-row">
                <span class="summary-label">小程序名称</span>
                <span class="summary-value app-name">{{ selectedBuild?.appName }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">AppID</span>
                <span class="summary-value app-id">{{ selectedBuild?.platforms.find(p => p.platformCode === selectedPlatform)?.appId || '-' }}</span>
              </div>
            </div>
            <el-form :model="publishConfig" label-width="120px" class="config-form">
              <el-form-item label="发布类型">
                <el-tag type="info">体验版</el-tag>
              </el-form-item>
              <el-form-item label="发布版本号">
                <el-input v-model="publishConfig.version" disabled />
              </el-form-item>
              <el-form-item label="发布log" :required="true">
                <el-input
                  v-model="publishConfig.description"
                  type="textarea"
                  rows="3"
                  placeholder="请输入本次发布的说明信息"
                />
              </el-form-item>
            </el-form>
            <div class="step-actions">
              <el-button @click="currentStep = 1">上一步</el-button>
              <el-button type="primary" @click="handleStartPublish" :disabled="!publishConfig.description">发布</el-button>
            </div>
          </div>

          <!-- 步骤4：开始发布 -->
          <div v-if="currentStep === 3" class="step-panel">
            <el-card class="log-card">
              <template #header>
                <span>发布日志</span>
              </template>
              <div class="log-content" ref="logContentRef">
                <pre v-for="(log, idx) in publishLogs" :key="idx" class="log-line">{{ log }}</pre>
              </div>
            </el-card>
            <div class="publish-actions" v-if="publishing && publishTaskId">
              <el-button type="danger" @click="handleStopPublish">停止发布</el-button>
            </div>
            <div class="publish-actions" v-if="publishFailed">
              <el-button @click="currentStep = 2; publishFailed = false">返回上一步</el-button>
              <el-button type="primary" @click="handleStartPublish">重新发布</el-button>
            </div>
          </div>

          <!-- 步骤5：发布完成 -->
          <div v-if="currentStep === 4" class="step-panel">
            <el-result
              icon="success"
              title="发布完成"
              sub-title="请查看发布结果"
            >
              <template #extra>
                <div v-if="qrCodeImage" class="qrcode-container">
                  <h4>体验版二维码</h4>
                  <img :src="qrCodeImage" alt="体验版二维码" class="qrcode-image" />
                  <p>请使用对应平台APP扫码体验</p>
                </div>
                <el-button type="primary" @click="goBack">返回首页</el-button>
                <el-button @click="resetPublish">重新发布</el-button>
              </template>
            </el-result>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Platform, ChatDotRound, Share, Connection, Search, ArrowRight, Check } from '@element-plus/icons-vue'
import request from '../utils/request'
import { pinyin } from 'pinyin-pro'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import QRCode from 'qrcode'

const router = useRouter()
const currentStep = ref(0)
const publishing = ref(false)
const publishFailed = ref(false)

// 构建列表
const buildList = ref([])
const searchQuery = ref('')

// 获取构建列表
const fetchBuildList = async () => {
  try {
    const res = await request.get('/api/novel-publish/list')
    if (res.code === 200) {
      buildList.value = res.data
    } else {
      ElMessage.error(res.message || '获取构建列表失败')
    }
  } catch (error) {
    console.error('获取构建列表失败:', error)
    ElMessage.error('获取构建列表失败')
  }
}

// 过滤构建列表
const filteredBuildList = computed(() => {
  if (!searchQuery.value) return buildList.value
  const query = searchQuery.value.toLowerCase()
  const isSingleCharQuery = query.length === 1
  
  return buildList.value.filter(app => {
    const name = app.appName || ''
    // 获取全拼和首字母
    const namePinyinFirst = pinyin(name, {
      pattern: 'first',
      type: 'array',
      toneType: 'none',
      nonZh: 'consecutive'
    }).join('').toLowerCase()
    const namePinyinFull = pinyin(name, {
      pattern: 'pinyin',
      type: 'array',
      toneType: 'none',
      nonZh: 'consecutive'
    }).join('').toLowerCase()
    
    // 检查原始名称8
    if (name.toLowerCase().includes(query)) return true
    // 检查拼音首字母
    if (isSingleCharQuery) {
      if (namePinyinFirst.length > 0 && namePinyinFirst[0] === query) return true
    } else {
      if (namePinyinFirst.startsWith(query)) return true
    }
    // 检查全拼
    if (namePinyinFull.includes(query)) return true
    // 检查平台信息
    return app.platforms.some(platform => 
      platform.platformName.toLowerCase().includes(query)
    )
  })
})

// 平台列表
const platforms = [
  { 
    code: 'mp-weixin', 
    name: '微信小程序', 
    icon: 'Share',
    color: '#07c160',
    light: '#e6f9ef',
    desc: '覆盖微信生态，触达10亿用户'
  },
  { 
    code: 'mp-toutiao', 
    name: '抖音小程序', 
    icon: 'Platform',
    color: '#000000',
    light: '#f3f3f3',
    desc: '抖音生态，短视频流量入口'
  },
  { 
    code: 'mp-kuaishou', 
    name: '快手小程序', 
    icon: 'ChatDotRound',
    color: '#ffc300',
    light: '#fff9e6',
    desc: '快手生态，短视频流量入口'
  },
  { 
    code: 'mp-baidu', 
    name: '百度小程序', 
    icon: 'Connection',
    color: '#4e6ef2',
    light: '#eef3fd',
    desc: '百度生态，搜索流量入口'
  }
]

// 选中的构建和平台
const selectedBuild = ref(null)
const selectedPlatform = ref('')

// 发布配置
const publishConfig = ref({
  type: 'trial',
  version: '',
  description: '修复已知问题，增加产品稳定性'
})

// 获取可用的平台列表
const availablePlatforms = computed(() => {
  if (!selectedBuild.value) return []
  return platforms.filter(platform => 
    selectedBuild.value.platforms.some(p => p.platformCode === platform.code)
  )
})

// 获取平台标签类型
const getPlatformTagType = (platformCode) => {
  const types = {
    'mp-weixin': 'success',
    'mp-toutiao': 'info',
    'mp-kuaishou': 'danger',
    'mp-baidu': 'primary'
  }
  return types[platformCode] || 'info'
}

// 处理选择构建
const handleSelectBuild = (platform) => {
  selectedBuild.value = platform
  nextStep()
}

// 处理选择平台
const handleSelectPlatform = (platform) => {
  selectedPlatform.value = platform
}

// 获取平台名称
const getPlatformName = (code) => {
  return platforms.find(p => p.code === code)?.name || code
}

// 发布通用配置
const publishCommonConfig = ref({})
const publishLogs = ref([])
const publishTaskId = ref(null)
const publishStompClient = ref(null)
const logContentRef = ref(null)
const qrCodeUrl = ref(null)
const qrCodeImage = ref(null)

// 生成二维码
const generateQRCode = async (url) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    qrCodeImage.value = qrDataUrl
  } catch (err) {
    console.error('生成二维码失败:', err)
    ElMessage.error('生成二维码失败')
  }
}

// 连接发布日志 WebSocket
const connectPublishLogSocket = (taskId) => {
  if (publishStompClient.value) {
    try { publishStompClient.value.disconnect() } catch {}
    publishStompClient.value = null
  }
  const socket = new SockJS(`${window.location.protocol}//${window.location.hostname}:8080/ws`)
  const client = Stomp.over(socket)
  client.heartbeat.outgoing = 0
  client.heartbeat.incoming = 0
  client.debug = () => {}
  client.connect({}, () => {
    client.subscribe(`/topic/publish-logs/${taskId}`, (message) => {
      if (message.body) {
        publishLogs.value.push(message.body)
        nextTick(() => {
          if (logContentRef.value) {
            logContentRef.value.scrollTop = logContentRef.value.scrollHeight
          }
        })
        if (message.body.startsWith('Publish success')) {
          setTimeout(() => {
            if (publishStompClient.value) publishStompClient.value.disconnect()
            publishStompClient.value = null
            publishing.value = false
            publishTaskId.value = null
            currentStep.value = 4
            publishFailed.value = false
          }, 1000)
        } else if (message.body.startsWith('Publish error')) {
          setTimeout(() => {
            if (publishStompClient.value) publishStompClient.value.disconnect()
            publishStompClient.value = null
            publishing.value = false
            publishTaskId.value = null
            publishFailed.value = true
            ElMessage.error('发布失败，请检查日志并重试')
          }, 1000)
        } else if(message.body.startsWith('二维码生成成功: ')){
          qrCodeUrl.value = message.body.substring('二维码生成成功: '.length).trim()
          generateQRCode(qrCodeUrl.value) // 生成二维码
        }
      }
    })
  })
  publishStompClient.value = client
}

// 停止发布
const handleStopPublish = async () => {
  if (!publishTaskId.value) return
  try {
    const res = await request.post(`/api/novel-publish/stop/${publishTaskId.value}`)
    if (res.code === 200) {
      ElMessage.success(`任务 ${publishTaskId.value} 已停止`)
      if (publishStompClient.value) publishStompClient.value.disconnect()
      publishStompClient.value = null
      publishing.value = false
      publishTaskId.value = null
      publishFailed.value = true
    } else {
      ElMessage.error('停止任务失败: ' + (res.message || '未知错误'))
    }
  } catch (error) {
    ElMessage.error('停止任务失败: ' + (error?.message || ''))
  }
}

// 开始发布
const handleStartPublish = async () => {
  // 立即切换到日志面板
  currentStep.value = 3
  // 组装参数
  const platformInfo = selectedBuild.value.platforms.find(p => p.platformCode === selectedPlatform.value)
  if (!platformInfo) {
    ElMessage.error('未找到平台信息')
    return
  }
  const params = {
    platformCode: platformInfo.platformCode,
    appId: platformInfo.appId,
    projectPath: platformInfo.projectPath,
    version: publishConfig.value.version,
    log: publishConfig.value.description,
  }
  // 仅抖音需要 douyinAppToken
  if (platformInfo.platformCode === 'mp-toutiao' && publishCommonConfig.value.douyinAppToken) {
    params.douyinAppToken = publishCommonConfig.value.douyinAppToken
  }
  publishing.value = true
  publishLogs.value = []
  publishTaskId.value = null
  try {
    const res = await request.post('/api/novel-publish/publish', params)
    if (res.code === 200 && res.data && res.data.taskId) {
      publishTaskId.value = res.data.taskId
      connectPublishLogSocket(publishTaskId.value)
      ElMessage.success('发布任务已启动，任务ID: ' + publishTaskId.value)
    } else {
      ElMessage.error('启动发布失败: ' + (res.message || '未知错误'))
      publishing.value = false
    }
  } catch (error) {
    ElMessage.error('启动发布失败: ' + (error?.message || ''))
    publishing.value = false
  }
}

// 重置发布
const resetPublish = () => {
  currentStep.value = 0
  selectedBuild.value = null
  selectedPlatform.value = ''
  publishConfig.value = {
    type: 'trial',
    version: '',
    description: '修复已知问题，增加产品稳定性'
  }
}

// 返回上一页
const goBack = () => {
  router.push('/ai-plus')
}

// 下一步
const nextStep = async () => {
  if (currentStep.value === 1 && selectedBuild.value) {
    publishConfig.value.version = selectedBuild.value.platforms.find(p => p.platformCode === selectedPlatform.value)?.version || ''
    // 获取当前平台的appId
    const appId = selectedBuild.value.platforms.find(p => p.platformCode === selectedPlatform.value)?.appId
    if (appId) {
      try {
        const res = await request.get('/api/novel-common/getAppCommonConfig', { params: { appId } })
        if (res.code === 200 && res.data) {
          publishCommonConfig.value = res.data
        } else {
          publishCommonConfig.value = {}
        }
      } catch (e) {
        publishCommonConfig.value = {}
      }
    }
  }
  currentStep.value++
}

onBeforeUnmount(() => {
  if (publishStompClient.value) publishStompClient.value.disconnect()
  if (publishTaskId.value) {
    handleStopPublish()
  }
})

// 初始化
fetchBuildList()
</script>

<style scoped>
.ai-publish-module {
  padding: 20px;
}

.publish-container {
  min-height: calc(100vh - 40px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h3 {
  margin: 0;
}

.publish-content {
  padding: 24px 0;
}

.publish-steps {
  margin-bottom: 40px;
}

.step-content {
  min-height: 400px;
}

.step-panel {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
}

.platform-header {
  text-align: center;
  margin-bottom: 32px;
}

.platform-header h4 {
  font-size: 20px;
  color: var(--el-text-color-primary);
  margin: 0 0 8px 0;
}

.platform-subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.platform-card {
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  /* 背景色由内联style控制 */
}
.platform-card.selected {
  border-color: var(--el-color-primary);
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  filter: brightness(0.99);
}
.platform-icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.platform-info {
  text-align: center;
}
.platform-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}
.platform-desc {
  font-size: 13px;
  line-height: 1.4;
}
.platform-status {
  position: absolute;
  top: 12px;
  right: 12px;
  color: var(--el-color-primary);
  font-size: 20px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s;
}
.platform-card.selected .platform-status {
  opacity: 1;
  transform: scale(1);
}
:deep(.el-card__body) {
  padding: 24px;
}

.config-form {
  max-width: 600px;
  margin: 0 auto;
}

.publish-summary {
  max-width: 600px;
  margin: 0 auto 24px auto;
}

.publish-summary h4 {
  margin-bottom: 16px;
}

.step-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

:deep(.el-descriptions__label) {
  width: 120px;
}

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 400px;
}

.app-list {
  margin-top: 16px;
}

.platform-tags {
  display: flex;
  gap: 8px;
}

.platform-tag {
  font-size: 12px;
}

:deep(.el-table .el-table__row) {
  cursor: pointer;
}

:deep(.el-table .el-table__row:hover) {
  background-color: var(--el-color-primary-light-9);
}

.publish-summary-card.gradient-card {
  max-width: 600px;
  margin: 0 auto 32px auto;
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.08);
  padding: 32px 36px 18px 36px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: linear-gradient(120deg, #f8fafc 60%, #fff 100%);
  border: 1.5px solid #f0f0f0;
}
.platform-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 0;
}
.platform-icon-big {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  font-size: 32px;
}
.platform-info-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.platform-label {
  color: #888;
  font-size: 14px;
  margin-bottom: 2px;
}
.summary-divider {
  margin: 10px 0 10px 0;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  font-size: 16px;
}
.summary-label {
  min-width: 90px;
  color: #888;
  font-weight: 500;
  text-align: right;
  font-size: 15px;
}
.summary-value {
  color: #222;
  font-weight: 600;
  font-size: 16px;
}
.app-name {
  letter-spacing: 1px;
}
.app-id {
  color: #999;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.5px;
}
.log-card {
  margin-top: 24px;
  margin-bottom: 24px;
  max-height: 350px;
}
.log-content {
  background: #111;
  color: rgb(211, 218, 211);
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 13px;
  border-radius: 4px;
  min-height: 120px;
  max-height: 250px;
  overflow-y: auto;
}
.log-line {
  margin: 0;
  white-space: pre-wrap;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 12px;
  padding-right: 12px;
}
.publish-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
.qrcode-container {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
.qrcode-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  border: 1px solid #eee;
  padding: 10px;
  background: #fff;
  border-radius: 4px;
}
</style> 