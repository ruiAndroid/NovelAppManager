<template>
  <div class="ai-build-module">
    <el-card class="build-container">
      <template #header>
        <div class="header">
          <div class="header-left">
            <el-button @click="goBack" link>
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <h3>智能构建小程序</h3>
          </div>
          <div class="header-right">
            <el-tag type="success" effect="dark">专家级</el-tag>
          </div>
        </div>
      </template>

      <div class="build-content">
        <!-- 步骤指示器 -->
        <CustomSteps :active-step="currentStep" :steps="buildStepsData" />

        <!-- 步骤内容 -->
        <div class="step-content">
          <!-- 步骤1：选择小程序 -->
          <div v-if="currentStep === 0" class="step-panel">
            <div class="search-bar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索小程序"
                class="search-input"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>

            <div class="app-list">
              <el-table
                :data="filteredApps"
                style="width: 100%"
                @row-click="handleAppSelect"
                :highlight-current-row="true"
              >
                <el-table-column prop="platform" label="平台" width="100">
                  <template #default="scope">
                    <el-tag :type="getPlatformType(scope.row.platform)" effect="light">
                      {{ scope.row.platform }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="appName" label="小程序名称" />
                <el-table-column prop="appid" label="AppID" width="220" />
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      link
                      @click.stop="handleSelect(scope.row)"
                    >
                      选择
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 步骤2：配置构建 -->
          <div v-if="currentStep === 1" class="step-panel">
            <el-form
              ref="configForm"
              :model="buildConfig"
              label-width="120px"
              class="config-form"
            >
              <el-form-item label="小程序版本">
                <el-input v-model="selectedApp.version" disabled />
              </el-form-item>
              <el-form-item label="构建环境">
                <el-radio-group v-model="buildConfig.environment">
                  <!-- <el-radio label="development">开发环境</el-radio> -->
                  <el-radio label="production">生产环境</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="构建类型">
                <el-select v-model="buildConfig.buildType" placeholder="请选择构建类型">
                  <el-option label="完整构建" value="full" />
                  <!-- <el-option label="增量构建" value="incremental" /> -->
                  <!-- <el-option label="快速构建" value="quick" /> -->
                </el-select>
              </el-form-item>

              <el-form-item label="优化选项">
                <el-checkbox-group v-model="buildConfig.optimizations">
                  <el-checkbox label="codeMinify" disabled>代码压缩</el-checkbox>
                  <el-checkbox label="imageCompress" disabled>图片压缩</el-checkbox>
                  <el-checkbox label="treeShaking" disabled>Tree Shaking</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="构建说明">
                <el-input
                  v-model="buildConfig.description"
                  type="textarea"
                  rows="3"
                  placeholder="请输入本次构建的说明信息"
                />
              </el-form-item>
            </el-form>
            <div class="build-actions">
              <el-button @click="currentStep = 0">上一步</el-button>
              <el-button type="primary" @click="nextStep">下一步</el-button>
            </div>
          </div>

          <!-- 步骤3：开始构建日志区 -->
          <div v-if="currentStep === 2" class="step-panel">
            <div class="build-summary">
              <h4>构建信息</h4>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="小程序名称">
                  {{ selectedApp?.appName }}
                </el-descriptions-item>
                <el-descriptions-item label="小程序版本">
                  {{ selectedApp?.version }}
                </el-descriptions-item>
                <el-descriptions-item label="平台">
                  {{ selectedApp?.platform }}
                </el-descriptions-item>
                <el-descriptions-item label="构建环境">
                  {{ buildConfig.environment === 'development' ? '开发环境' : '生产环境' }}
                </el-descriptions-item>
                <el-descriptions-item label="构建类型">
                  {{ getBuildTypeName(buildConfig.buildType) }}
                </el-descriptions-item>
                <el-descriptions-item label="优化选项">
                  {{ getOptimizationsText(buildConfig.optimizations) }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div class="build-actions">
              <el-button @click="currentStep = 1">上一步</el-button>
              <el-button 
                type="primary" 
                @click="handleStartBuild" 
                :loading="building" 
                :disabled="taskId !== null">
                {{ taskId === null ? '开始构建' : '构建中...' }}
               </el-button>
            </div>
          </div>

          <!-- 日志区：步骤3 and 4 show -->
          <el-card class="log-card" v-if="currentStep === 3 || currentStep === 4">
            <template #header>
              <span>构建日志</span>
            </template>
            <div class="log-content" ref="logContentRef">
              <pre v-for="(log, idx) in buildLogs" :key="idx" class="log-line">{{ log }}</pre>
            </div>
          </el-card>

          <!-- Stop button moved outside the log card -->
          <div class="build-actions" v-if="currentStep === 3 && taskId !== null && building" style="margin-top: 20px;"> <!-- Show only when building in step 3 -->
                 <el-button 
                 type="danger"
                 @click="handleStopBuild">
                 停止构建任务
              </el-button>
            </div>

          <!-- 步骤4：构建完成 -->
          <div v-if="currentStep === 4" class="step-panel">
            <div class="build-complete">
              <el-result icon="success" title="构建完成" sub-title="请查看下方日志确认构建结果。">
                <template #extra>
                  <el-button type="primary" @click="goBack">返回AI+首页</el-button>
                  <el-button @click="currentStep = 1">重新构建</el-button>
                </template>
              </el-result>
            </div>
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
import { ArrowLeft, Search } from '@element-plus/icons-vue'
import request from '../utils/request'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import { pinyin } from 'pinyin-pro'
import CustomSteps from '../components/CustomSteps.vue'

const router = useRouter()
const currentStep = ref(0)
const searchQuery = ref('')
const apps = ref([])
const selectedApp = ref(null)
const building = ref(false)
const taskId = ref(null)

// 定义构建步骤数据
const buildStepsData = ref([
  {
    title: '选择小程序',
    description: '选择要构建的小程序'
  },
  {
    title: '配置构建',
    description: '设置构建参数'
  },
  {
    title: '开始构建',
    description: '执行构建过程'
  },
  {
    title: '构建完成',
    description: '查看结果'
  }
])

// 构建配置
const buildConfig = ref({
  environment: 'production',
  buildType: 'full',
  optimizations: ['codeMinify', 'imageCompress', 'treeShaking'],
  description: ''
})

// 日志相关
const buildLogs = ref([])
const stompClient = ref(null)
const logContentRef = ref(null)

const buildCmd = ref('')
const platformMap = {
  '抖音': 'tt',
  '微信': 'wx',
  '快手': 'ks',
  '百度': 'bd'
}

const connectLogSocket = (taskIdToSubscribe) => {
  if (stompClient.value) {
    try { stompClient.value.disconnect() } catch {}
    stompClient.value = null
  }
  const socket = new SockJS(`${window.location.protocol}//${window.location.hostname}:8080/ws`)
  const client = Stomp.over(socket)
  client.heartbeat.outgoing = 0
  client.heartbeat.incoming = 0
  client.debug = () => {}
  client.connect({}, () => {
    client.subscribe(`/topic/build-logs/${taskIdToSubscribe}`, (message) => {
      if (message.body) {
        buildLogs.value.push(message.body)
        nextTick(() => {
          if (logContentRef.value) {
            logContentRef.value.scrollTop = logContentRef.value.scrollHeight
          }
        })
        console.log(message.body)
        if (message.body.includes('Build completed successfully')) {
          setTimeout(() => {
            if (stompClient.value) stompClient.value.disconnect()
            stompClient.value = null
            currentStep.value = 4
            building.value = false
            taskId.value = null
          }, 1000)
        } else if (message.body.includes('Build error')) {
          setTimeout(() => {
            if (stompClient.value) stompClient.value.disconnect()
            stompClient.value = null
            building.value = false
            taskId.value = null
          }, 1000)
        }
      }
    })
  })
  stompClient.value = client
}

onBeforeUnmount(() => {
  if (stompClient.value) stompClient.value.disconnect()
  if (taskId.value) {
    handleStopBuild()
  }
})

// 获取小程序列表
const fetchApps = async () => {
  try {
    const res = await request.get('/api/novel-apps/appLists')
    const data = res.data
    
    let appList = []
    Object.values(data).forEach(platformApps => {
      appList = [...appList, ...platformApps.map(app => ({
        id: app.id,
        platform: getPlatformName(app.platform),
        appName: app.appName,
        appid: app.appid,
        version: app.version // 假设后端接口返回了 version 字段
      }))]
    })
    
    apps.value = appList
  } catch (error) {
    console.error('获取小程序列表失败:', error)
    ElMessage.error('获取小程序列表失败')
  }
}

// 过滤小程序列表
const filteredApps = computed(() => {
  if (!searchQuery.value) return apps.value
  const query = searchQuery.value.toLowerCase()
  const isSingleCharQuery = query.length === 1;
  return apps.value.filter(app => {
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
    // 检查原始名称
    if (name.toLowerCase().includes(query)) return true
    // 检查拼音首字母
    if (isSingleCharQuery) {
      if (namePinyinFirst.length > 0 && namePinyinFirst[0] === query) return true;
    } else {
      if (namePinyinFirst.startsWith(query)) return true
    }
    // 检查全拼
    if (namePinyinFull.includes(query)) return true
    // 检查其他字段
    return (app.appid && app.appid.toLowerCase().includes(query))
  })
})

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

// 构建类型名称
const getBuildTypeName = (type) => {
  const types = {
    'full': '完整构建',
    'incremental': '增量构建',
    'quick': '快速构建'
  }
  return types[type] || type
}

// 优化选项文本
const getOptimizationsText = (optimizations) => {
  const options = {
    'codeMinify': '代码压缩',
    'imageCompress': '图片压缩',
    'treeShaking': 'Tree Shaking'
  }
  return optimizations.map(opt => options[opt]).join('、')
}

// 处理小程序选择
const handleSelect = (app) => {
  selectedApp.value = app
  nextStep()
}

const fetchBuildCodeAndGenCmd = async () => {
  if (!selectedApp.value) return
  try {
    const res = await request.get('/api/novel-common/getAppCommonConfig', {
      params: { appId: selectedApp.value.appid }
    })
    if (res.code === 200 && res.data) {
      const buildCode = res.data.buildCode || ''
      const plat = platformMap[selectedApp.value.platform] || ''
      if (buildConfig.value.environment === 'production') {
        buildCmd.value = `npm run build:${plat}-${buildCode}`
      } else {
        buildCmd.value = `npm run dev:${plat}-${buildCode}`
      }
    }
  } catch (e) {
    buildCmd.value = ''
  }
}

// 下一步
const nextStep = async () => {
  if (currentStep.value === 0 && !selectedApp.value) {
    ElMessage.warning('请先选择一个小程序')
    return
  }
  if (currentStep.value === 1) {
    await fetchBuildCodeAndGenCmd()
  }
  currentStep.value++
}

const handleStartBuild = async () => {
  if (!selectedApp.value) {
    ElMessage.error('请先选择小程序');
    return;
  }

  buildLogs.value = [];
  building.value = true;
  taskId.value = null; // Clear previous task ID

  try {
    const res = await request.post(
      `/api/novel-build/build?cmd="${buildCmd.value}"`
    );

    if (res.code === 200 && res.data) {
      taskId.value = res.data; 
      currentStep.value = 3;
      await nextTick(); 
      connectLogSocket(taskId.value); 
      ElMessage.success('构建任务已启动，任务ID: ' + taskId.value);
    } else if (res.code === 200 && res.message) {
       ElMessage.info('构建任务已启动，等待任务ID...');
        building.value = false; 
    }
     else {
      ElMessage.error('启动构建失败: ' + (res.message || '未知错误'));
      building.value = false;
    }

  } catch (error) {
    ElMessage.error('启动构建失败: ' + (error?.message || ''));
    building.value = false;
  }
};

const handleStopBuild = async () => {
  if (!taskId.value) return;

  try {
    const res = await request.get(
      '/api/novel-build/stop',{
        params:{
          taskId: taskId.value
        } 
      }
    );

    if (res.code === 200) {
      ElMessage.success(`任务 ${taskId.value} 已停止`);
      if (stompClient.value) stompClient.value.disconnect();
      stompClient.value = null;
      building.value = false;
      taskId.value = null;
      currentStep.value = 1;
      await nextTick(); 
    } else {
      ElMessage.error('停止任务失败: ' + (res.message || '未知错误'));
    }
  } catch (error) {
    ElMessage.error('停止任务失败: ' + (error?.message || ''));
  }
};

// 返回上一页
const goBack = () => {
  router.push('/ai-plus')
}

// 初始化
fetchApps()
</script>

<style scoped>
.ai-build-module {
  padding: 20px;
}


.build-container {
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

.build-content {
  padding: 24px 0;
}

.build-steps {
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

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 300px;
}

.config-form {
  max-width: 600px;
  margin: 0 auto;
}

.build-summary {
  max-width: 600px;
  margin: 0 auto;
}

.build-summary h4 {
  margin-bottom: 16px;
}

.build-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.app-list {
  margin-top: 16px;
}

:deep(.el-descriptions__label) {
  width: 120px;
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
</style> 