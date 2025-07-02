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
                <el-form ref="formRef" :model="configForm" :rules="formRules" label-width="160px">
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
                    <el-form-item label="抖音AppToken">
                      <el-input
                        v-model="configForm.douyinAppToken"
                        type="textarea"
                        :rows="6"
                        placeholder="请输入抖音AppToken（私钥内容）"
                      />
                    </el-form-item>
                  </template>

                  <!-- Conditionally show Weixin fields -->
                  <template v-if="selectedApp.platform === '微信'">
                    <el-form-item label="微信AppToken">
                      <el-input
                        v-model="configForm.weixinAppToken"
                        type="textarea"
                        :rows="6"
                        placeholder="请输入微信AppToken（私钥内容）"
                      />
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
                    <el-form-item label="快手AppToken">
                      <el-input
                        v-model="configForm.kuaishouAppToken"
                        type="textarea"
                        :rows="6"
                        placeholder="请输入快手AppToken（私钥内容）"
                      />
                    </el-form-item>
                  </template>
            
                  <el-form-item label="客服URL">
                    <el-input v-model="configForm.contact" placeholder="请输入客服URL" />
                  </el-form-item>
                  
                  <el-form-item label="支付卡片样式">
                    <el-select v-model="configForm.payCardStyle" placeholder="请选择支付卡片样式">
                      <el-option :value="1" label="样式1" />
                      <el-option :value="2" label="样式2" />
                      <el-option :value="3" label="样式3" />
                      <el-option :value="4" label="样式4" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="首页卡片样式">
                    <el-select v-model="configForm.homeCardStyle" placeholder="请选择首页卡片样式">
                      <el-option :value="1" label="样式1" />
                    </el-select>
                  </el-form-item>
                  
                  <el-form-item label="构建命令" prop="buildCode">
                    <el-input v-model="configForm.buildCode" placeholder="请输入构建命令（如 npm run build:xxx）" />
                  </el-form-item>
                  
                  <el-form-item label="IAA模式">
                    <el-switch v-model="configForm.iaaMode" />
                    <span class="form-tip">是否开启IAA(In-App-Advertising)模式</span>
                  </el-form-item>
                  
                  <!-- 我的页登录类型 -->
                  <el-form-item label="我的页登录类型" class="login-type-item">
                    <el-radio-group v-model="configForm.mineLoginType">
                      <el-radio label="anonymousLogin">静默登录</el-radio>
                      <el-radio label="phoneLogin">
                        手机号授权登录
                        <span class="form-tip">无手机号权限的小程序默认使用静默登录</span>
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
            
                  <!-- 阅读页登录类型 -->
                  <el-form-item label="阅读页登录类型" class="login-type-item">
                    <el-radio-group v-model="configForm.readerLoginType">
                      <el-radio label="anonymousLogin">静默登录</el-radio>
                      <el-radio label="phoneLogin">
                        手机号授权登录
                        <span class="form-tip">无手机号权限的小程序默认使用静默登录</span>
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
            
                  <el-form-item>
                    <el-button type="primary" @click="handleSaveConfig" :loading="saving">保存配置</el-button>
                    <el-button type="danger" @click="handleDeleteConfirm" v-if="configForm.id">删除配置</el-button>
                    <el-button @click="handleCopyGeneralConfig">复制配置</el-button>
                    <el-button @click="handlePasteGeneralConfig">粘贴配置</el-button>
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

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定要删除该配置吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDeleteConfig">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import request from '../utils/request'
import { pinyin } from 'pinyin-pro'

// 状态变量
const searchQuery = ref('')
const loadingApps = ref(false)
const loadingConfig = ref(false)
const saving = ref(false)
const apps = ref([])
const selectedApp = ref(null)
const deleteDialogVisible = ref(false)
const configForm = ref({
  id: null,
  appId: '',
  contact: '',
  douyinImId: '',
  kuaishouClientId: '',
  kuaishouClientSecret: '',
  payCardStyle: null,
  homeCardStyle: null,
  buildCode: '',
  kuaishouAppToken: '',
  douyinAppToken: '',
  weixinAppToken: '',
  mineLoginType: 'anonymousLogin',
  readerLoginType: 'anonymousLogin',
  iaaMode: false
})
const formRef = ref(null)

const formRules = {
  buildCode: [
    { required: true, message: '请输入构建命令', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/^\d+$/.test(value)) {
          callback(new Error('构建命令不能为纯数字'));
        } else if (/^\d/.test(value)) {
          callback(new Error('构建命令不能以数字开头'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  // ... 你可以把其他字段的校验规则也写在这里
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
      // 对于单字符查询，严格匹配首字母
      if (namePinyinFirst.length > 0 && namePinyinFirst[0] === query) return true;
    } else {
      // 对于多字符查询，检查是否以首字母开头
      if (namePinyinFirst.startsWith(query)) return true
    }

    // 检查全拼
    if (namePinyinFull.includes(query)) return true

    // 检查其他字段
    return (app.appid && app.appid.toLowerCase().includes(query))
  })
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
        kuaishouClientSecret: res.data.kuaishouClientSecret || '',
        payCardStyle: res.data.payCardStyle ?? null,
        homeCardStyle: res.data.homeCardStyle ?? null,
        buildCode: res.data.buildCode || '',
        kuaishouAppToken: res.data.kuaishouAppToken || '',
        douyinAppToken: res.data.douyinAppToken || '',
        weixinAppToken: res.data.weixinAppToken || '',
        mineLoginType: res.data.mineLoginType || 'anonymousLogin',
        readerLoginType: res.data.readerLoginType || 'anonymousLogin',
        iaaMode: res.data.iaaMode ?? false
      }
    } else {
      ElMessage.warning(res.message || '获取配置失败，可能该小程序未创建通用配置');
      configForm.value = {
        id: null,
        appId: selectedApp.value.appid,
        contact: '',
        douyinImId: '',
        kuaishouClientId: '',
        kuaishouClientSecret: '',
        payCardStyle: null,
        homeCardStyle: null,
        buildCode: '',
        kuaishouAppToken: '',
        douyinAppToken: '',
        weixinAppToken: '',
        mineLoginType: 'anonymousLogin',
        readerLoginType: 'anonymousLogin',
        iaaMode: false
      }
    }
  } catch (error) {
    console.error('获取配置失败:', error)
    configForm.value = {
      id: null,
      appId: selectedApp.value.appid,
      contact: '',
      douyinImId: '',
      kuaishouClientId: '',
      kuaishouClientSecret: '',
      payCardStyle: null,
      homeCardStyle: null,
      buildCode: '',
      kuaishouAppToken: '',
      douyinAppToken: '',
      weixinAppToken: '',
      mineLoginType: 'anonymousLogin',
      readerLoginType: 'anonymousLogin',
      iaaMode: false
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
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) {
    ElMessage.error('请检查表单填写是否正确');
    return;
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
      kuaishouClientSecret: configForm.value.kuaishouClientSecret,
      payCardStyle: configForm.value.payCardStyle,
      homeCardStyle: configForm.value.homeCardStyle,
      buildCode: configForm.value.buildCode,
      kuaishouAppToken: configForm.value.kuaishouAppToken,
      douyinAppToken: configForm.value.douyinAppToken,
      weixinAppToken: configForm.value.weixinAppToken,
      mineLoginType: configForm.value.mineLoginType,
      readerLoginType: configForm.value.readerLoginType,
      iaaMode: configForm.value.iaaMode
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
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) {
    ElMessage.error('请检查表单填写是否正确');
    return;
  }
  saving.value = true
  try {
    // 只提交必要的字段
    const requestData = {
      appId: selectedApp.value.appid,
      contact: configForm.value.contact,
      douyinImId: configForm.value.douyinImId,
      kuaishouClientId: configForm.value.kuaishouClientId,
      kuaishouClientSecret: configForm.value.kuaishouClientSecret,
      payCardStyle: configForm.value.payCardStyle,
      homeCardStyle: configForm.value.homeCardStyle,
      buildCode: configForm.value.buildCode,
      kuaishouAppToken: configForm.value.kuaishouAppToken,
      douyinAppToken: configForm.value.douyinAppToken,
      weixinAppToken: configForm.value.weixinAppToken,
      mineLoginType: configForm.value.mineLoginType,
      readerLoginType: configForm.value.readerLoginType,
      iaaMode: configForm.value.iaaMode
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
        kuaishouClientSecret: res.data.kuaishouClientSecret || '',
        payCardStyle: res.data.payCardStyle ?? null,
        homeCardStyle: res.data.homeCardStyle ?? null,
        buildCode: res.data.buildCode || '',
        kuaishouAppToken: res.data.kuaishouAppToken || '',
        douyinAppToken: res.data.douyinAppToken || '',
        weixinAppToken: res.data.weixinAppToken || '',
        mineLoginType: res.data.mineLoginType || 'anonymousLogin',
        readerLoginType: res.data.readerLoginType || 'anonymousLogin',
        iaaMode: res.data.iaaMode ?? false
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

// 显示删除确认对话框
const handleDeleteConfirm = () => {
  deleteDialogVisible.value = true
}

// 执行删除操作
const handleDeleteConfig = async () => {
  if (!selectedApp.value?.appid) {
    ElMessage.warning('请先选择小程序')
    return
  }

  loadingConfig.value = true
  try {
    const res = await request.get('/api/novel-common/deleteAppCommonConfig', {
      params: {
        appId: selectedApp.value.appid
      }
    })
    
    if (res.code === 200) {
      ElMessage.success('配置删除成功')
      // 清空配置表单并设置默认值
      configForm.value = {
        id: null,
        appId: selectedApp.value.appid,
        contact: '',
        douyinImId: '',
        kuaishouClientId: '',
        kuaishouClientSecret: '',
        payCardStyle: null,
        homeCardStyle: null,
        buildCode: '',
        kuaishouAppToken: '',
        douyinAppToken: '',
        weixinAppToken: '',
        mineLoginType: 'anonymousLogin',
        readerLoginType: 'anonymousLogin',
        iaaMode: false
      }
      // 关闭确认对话框
      deleteDialogVisible.value = false
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除配置失败:', error)
    ElMessage.error(error.message || '删除配置失败')
  } finally {
    loadingConfig.value = false
  }
}

const handleCopyGeneralConfig = () => {
  try {
    // 复制包含新字段的数据
    const dataToCopy = {
      ...configForm.value,
      mineLoginType: configForm.value.mineLoginType,
      readerLoginType: configForm.value.readerLoginType,
      iaaMode: configForm.value.iaaMode
    }
    localStorage.setItem('generalConfigCopy', JSON.stringify(dataToCopy))
    ElMessage.success('通用配置已复制')
  } catch (e) {
    console.error('复制失败:', e)
    ElMessage.error('复制失败')
  }
}

const handlePasteGeneralConfig = () => {
  try {
    const data = localStorage.getItem('generalConfigCopy')
    if (data) {
      const parsedData = JSON.parse(data);
      // 粘贴时更新新字段
      configForm.value = {
        ...configForm.value,
        ...parsedData,
        mineLoginType: parsedData.mineLoginType ?? 'anonymousLogin',
        readerLoginType: parsedData.readerLoginType ?? 'anonymousLogin',
        iaaMode: parsedData.iaaMode ?? false
      }
      ElMessage.success('通用配置已粘贴')
    } else {
      ElMessage.warning('没有可粘贴的配置')
    }
  } catch (e) {
    console.error('粘贴失败:', e)
    ElMessage.error('粘贴失败')
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

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 15px;
  white-space: nowrap;
}

.login-type-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.login-type-item :deep(.el-form-item__content .el-radio-group) {
  align-self: center;
  flex-shrink: 0;
}

.login-type-item :deep(.el-radio__label) {
  display: inline-flex;
  align-items: center;
}
</style> 