<template>
  <div class="ad-management">
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

      <!-- 右侧广告配置 -->
      <el-card class="ad-config-card">
        <template #header>
          <div class="header">
            <h3 class="title-with-tag" v-if="selectedApp">
              广告配置 - {{ selectedApp.appName }}
              <el-tag :type="getPlatformType(selectedApp.platform)" effect="light" size="small" class="platform-tag">
                {{ selectedApp.platform }}
              </el-tag>
            </h3>
            <h3 v-else>广告配置</h3>
          </div>
        </template>

        <div class="ad-config-content">
          <template v-if="selectedApp">
            <div class="ad-config-grid">
              <!-- 激励广告配置 -->
              <el-card class="ad-type-card" :body-style="{ padding: '0' }">
                <div class="ad-card-wrapper">
                  <!-- 广告类型标题区 -->
                  <div class="ad-card-header" :class="{ 'configured': adConfig?.reward }">
                    <div class="ad-type-info">
                      <i class="el-icon-video-play"></i>
                      <div class="ad-type-title">
                        <h4>激励广告</h4>
                        <span class="ad-type-desc">观看视频获得奖励</span>
                      </div>
                    </div>
                    <el-tag size="small" :type="adConfig?.reward ? 'success' : 'info'" effect="plain">
                      {{ adConfig?.reward ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 广告配置内容区 -->
                  <div class="ad-card-content" v-loading="loadingAdConfig">
                    <template v-if="adConfig?.reward">
                      <div class="ad-info-list">
                        <div class="ad-info-item">
                          <span class="label">广告位ID</span>
                          <span class="value">{{ adConfig.reward.rewardAdId }}</span>
                        </div>
                        <div class="ad-info-item">
                          <span class="label">激励次数</span>
                          <span class="value">{{ adConfig.reward.rewardCount }}次</span>
                        </div>
                        <div class="ad-info-item">
                          <span class="label">状态</span>
                          <el-tag size="small" :type="adConfig.reward.isRewardAdEnabled ? 'success' : 'danger'" effect="light">
                            {{ adConfig.reward.isRewardAdEnabled ? '已启用' : '未启用' }}
                          </el-tag>
                        </div>
                      </div>
                    </template>
                    <el-empty v-else description="暂未配置激励广告" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="ad-card-footer">
                    <template v-if="adConfig?.reward">
                      <el-button type="primary" link @click="handleEditAd('reward')">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeleteAd('reward')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreateAd('reward')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>

              <!-- 插屏广告配置 -->
              <el-card class="ad-type-card" :body-style="{ padding: '0' }">
                <div class="ad-card-wrapper">
                  <!-- 广告类型标题区 -->
                  <div class="ad-card-header" :class="{ 'configured': adConfig?.interstitial }">
                    <div class="ad-type-info">
                      <i class="el-icon-picture"></i>
                      <div class="ad-type-title">
                        <h4>插屏广告</h4>
                        <span class="ad-type-desc">全屏展示广告</span>
                      </div>
                    </div>
                    <el-tag size="small" :type="adConfig?.interstitial ? 'success' : 'info'" effect="plain">
                      {{ adConfig?.interstitial ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 广告配置内容区 -->
                  <div class="ad-card-content" v-loading="loadingAdConfig">
                    <template v-if="adConfig?.interstitial">
                      <div class="ad-info-list">
                        <el-empty 
                          description="暂无配置数据" 
                          :image-size="60"
                        >
                          <template #description>
                            <div class="empty-description">
                              <p>已创建但暂无具体配置数据</p>
                              <p class="sub-text">可以通过编辑按钮设置配置信息</p>
                            </div>
                          </template>
                        </el-empty>
                      </div>
                    </template>
                    <el-empty v-else description="未创建插屏广告配置" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="ad-card-footer">
                    <template v-if="adConfig?.interstitial">
                      <el-button type="primary" link disabled title="暂不支持编辑">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeleteAd('interstitial')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreateAd('interstitial')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>

              <!-- 信息流广告配置 -->
              <el-card class="ad-type-card" :body-style="{ padding: '0' }">
                <div class="ad-card-wrapper">
                  <!-- 广告类型标题区 -->
                  <div class="ad-card-header" :class="{ 'configured': adConfig?.native }">
                    <div class="ad-type-info">
                      <i class="el-icon-document"></i>
                      <div class="ad-type-title">
                        <h4>信息流广告</h4>
                        <span class="ad-type-desc">原生广告</span>
                      </div>
                    </div>
                    <el-tag size="small" :type="adConfig?.native ? 'success' : 'info'" effect="plain">
                      {{ adConfig?.native ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 广告配置内容区 -->
                  <div class="ad-card-content" v-loading="loadingAdConfig">
                    <template v-if="adConfig?.native">
                      <div class="ad-info-list">
                        <el-empty 
                          description="暂无配置数据" 
                          :image-size="60"
                        >
                          <template #description>
                            <div class="empty-description">
                              <p>已创建但暂无具体配置数据</p>
                              <p class="sub-text">可以通过编辑按钮设置配置信息</p>
                            </div>
                          </template>
                        </el-empty>
                      </div>
                    </template>
                    <el-empty v-else description="未创建信息流广告配置" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="ad-card-footer">
                    <template v-if="adConfig?.native">
                      <el-button type="primary" link disabled title="暂不支持编辑">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeleteAd('native')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreateAd('native')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>
            </div>
          </template>
          
          <template v-else>
            <div class="empty-config">
              <el-empty 
                :image-size="160"
                description="未选择小程序"
              >
                <template #description>
                  <div class="empty-description">
                    <p>请先从左侧列表选择一个小程序</p>
                    <p class="sub-text">选择后可以查看和配置广告信息</p>
                  </div>
                </template>
              </el-empty>
            </div>
          </template>
        </div>
      </el-card>
    </div>

    <!-- 添加编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="adFormRef"
        :model="adForm"
        :rules="adFormRules"
        label-width="100px"
      >
        <!-- 激励广告表单 -->
        <template v-if="currentAdType === 'reward'">
          <el-form-item label="广告位ID" prop="rewardAdId">
            <el-input v-model="adForm.rewardAdId" placeholder="请输入广告位ID" />
          </el-form-item>
          <el-form-item label="激励次数" prop="rewardCount">
            <el-input-number v-model="adForm.rewardCount" :min="1" />
          </el-form-item>
          <el-form-item label="是否启用" prop="isRewardAdEnabled">
            <el-switch v-model="adForm.isRewardAdEnabled" />
          </el-form-item>
        </template>
        <!-- 其他广告类型的表单待补充 -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitAd" :loading="submitting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="360px"
    >
      <p>确定要删除该广告配置吗？此操作不可恢复。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleConfirmDelete" :loading="deleting">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Edit, Delete, Plus } from '@element-plus/icons-vue'
import request from '../utils/request'

// 小程序列表相关
const apps = ref([])
const loadingApps = ref(false)
const searchQuery = ref('')
const selectedApp = ref(null)

// 广告配置相关
const adConfig = ref(null)
const loadingAdConfig = ref(false)
const adFormRef = ref(null)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentAdType = ref('')
const adForm = ref({})
const adFormRules = ref({})
const submitting = ref(false)

// 添加删除确认对话框相关
const deleteDialogVisible = ref(false)
const deleting = ref(false)
const deleteAdType = ref('')

// 过滤后的小程序列表
const filteredApps = computed(() => {
  if (!searchQuery.value) return apps.value
  const query = searchQuery.value.toLowerCase()
  return apps.value.filter(app => 
    app.appName.toLowerCase().includes(query) || 
    app.appid.toLowerCase().includes(query)
  )
})

// 获取小程序列表
const fetchApps = async () => {
  loadingApps.value = true
  try {
    const res = await request.get('/api/novel-apps/appLists')
    
    let allApps = []
    Object.entries(res.data).forEach(([platform, platformApps]) => {
      const convertedApps = platformApps.map(app => ({
        id: app.id,
        platform: getPlatformName(app.platform),
        appName: app.appName,
        appid: app.appid
      }))
      
      allApps = [...allApps, ...convertedApps]
    })
    
    apps.value = allApps
  } catch (error) {
    console.error('获取小程序列表失败:', error)
    ElMessage.error('获取小程序列表失败')
  } finally {
    loadingApps.value = false
  }
}

// 获取广告配置
const fetchAdConfig = async (appId) => {
  loadingAdConfig.value = true
  try {
    const res = await request.get('/api/novel-ad/appAd/getAppAdByAppId', {
      params: { appId }
    })
    
    if (res.code === 200) {
      adConfig.value = res.data
    } else {
      throw new Error(res.message || '获取广告配置失败')
    }
  } catch (error) {
    console.error('获取广告配置失败:', error)
    // ElMessage.error(error.message || '获取广告配置失败')
    adConfig.value = null
  } finally {
    loadingAdConfig.value = false
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

// 选择小程序
const handleAppSelect = (app) => {
  selectedApp.value = app
  // 加载选中小程序的广告配置
  fetchAdConfig(app.appid)
}

// 刷新小程序列表
const handleRefresh = () => {
  fetchApps()
}

// 修改编辑广告配置的方法
const handleEditAd = (type) => {
  // 只允许编辑激励广告
  if (type !== 'reward') {
    ElMessage.warning('该类型广告暂不支持编辑')
    return
  }

  currentAdType.value = type
  dialogTitle.value = `编辑${getAdTypeName(type)}`
  
  // 初始化激励广告表单数据
  if (adConfig.value?.reward) {
    adForm.value = {
      rewardAdId: adConfig.value.reward.rewardAdId || '',
      rewardCount: adConfig.value.reward.rewardCount || 1,
      isRewardAdEnabled: adConfig.value.reward.isRewardAdEnabled || false
    }
  }
  
  // 设置表单验证规则
  adFormRules.value = {
    rewardAdId: [
      { required: true, message: '请输入广告位ID', trigger: 'blur' }
    ],
    rewardCount: [
      { required: true, message: '请输入激励次数', trigger: 'blur' }
    ]
  }
  
  // 打开对话框
  dialogVisible.value = true
}

// 添加获取广告类型名称的方法
const getAdTypeName = (type) => {
  const names = {
    'reward': '激励广告',
    'interstitial': '插屏广告',
    'native': '信息流广告'
  }
  return names[type] || type
}

// 修改创建广告配置的方法
const handleCreateAd = async (type) => {
  if (!selectedApp.value?.appid) {
    ElMessage.warning('请先选择小程序')
    return
  }

  // 如果没有adConfig数据，说明需要先创建app_ad
  if (!adConfig.value) {
    try {
      const createAppAdRes = await request.post('/api/novel-ad/appAd/create', {
        appid: selectedApp.value.appid
      })
      
      if (createAppAdRes.code !== 200) {
        throw new Error(createAppAdRes.message || '创建应用广告配置失败')
      }
      
      // 保存返回的app_ad数据
      adConfig.value = createAppAdRes.data
    } catch (error) {
      console.error('创建应用广告配置失败:', error)
      ElMessage.error(error.message || '创建应用广告配置失败')
      return
    }
  }

  // 设置当前广告类型和对话框标题
  currentAdType.value = type
  dialogTitle.value = `新建${getAdTypeName(type)}`
  
  // 初始化表单数据
  if (type === 'reward') {
    adForm.value = {
      rewardAdId: '',
      rewardCount: 1,
      isRewardAdEnabled: false
    }
    // 设置表单验证规则
    adFormRules.value = {
      rewardAdId: [
        { required: true, message: '请输入广告位ID', trigger: 'blur' }
      ],
      rewardCount: [
        { required: true, message: '请输入激励次数', trigger: 'blur' }
      ]
    }
  } else {
    adForm.value = {}
    adFormRules.value = {}
  }
  
  // 打开对话框
  dialogVisible.value = true
}

// 修改提交广告配置的方法
const handleSubmitAd = async () => {
  if (!adFormRef.value) return
  
  await adFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      let requestData = {}
      
      if (currentAdType.value === 'reward') {
        // 激励广告需要包含所有字段
        requestData = {
          apAdId: adConfig.value.id,  // 使用app_ad的id
          adType: 'reward',
          rewardAdId: adForm.value.rewardAdId,
          rewardCount: adForm.value.rewardCount,
          isRewardAdEnabled: adForm.value.isRewardAdEnabled
        }
      } else {
        // 其他类型广告只需要基本字段
        requestData = {
          apAdId: adConfig.value.id,  // 使用app_ad的id
          adType: currentAdType.value
        }
      }

      // 根据是否存在对应类型的配置来判断是新建还是更新
      const isEdit = adConfig.value?.[currentAdType.value] != null
      const apiUrl = isEdit 
        ? '/api/novel-ad/adConfig/update'
        : '/api/novel-ad/adConfig/create'

      const res = await request.post(apiUrl, requestData)
      
      if (res.code === 200) {
        ElMessage.success(isEdit ? '广告配置更新成功' : '广告配置创建成功')
        dialogVisible.value = false
        // 重新获取广告配置
        fetchAdConfig(selectedApp.value.appid)
      } else {
        throw new Error(res.message || (isEdit ? '更新失败' : '创建失败'))
      }
    } catch (error) {
      console.error(isEdit ? '更新广告配置失败:' : '创建广告配置失败:', error)
      ElMessage.error(error.message || (isEdit ? '更新失败' : '创建失败'))
    } finally {
      submitting.value = false
    }
  })
}

// 删除广告配置
const handleDeleteAd = (type) => {
  deleteAdType.value = type
  deleteDialogVisible.value = true
}

// 确认删除广告配置
const handleConfirmDelete = async () => {
  if (!selectedApp.value?.appid || !adConfig.value?.id || !deleteAdType.value) {
    ElMessage.warning('无效的删除参数')
    return
  }

  deleting.value = true
  try {
    const res = await request.get('/api/novel-ad/adConfig/deleteByAppAdIdAndType', {
      params: {
        appAdId: adConfig.value.id,
        adType: deleteAdType.value
      }
    })
    
    if (res.code === 200) {
      ElMessage.success('广告配置删除成功')
      // 关闭删除确认对话框
      deleteDialogVisible.value = false
      // 重新获取广告配置数据
      fetchAdConfig(selectedApp.value.appid)
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除广告配置失败:', error)
    ElMessage.error(error.message || '删除广告配置失败')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchApps()
})
</script>

<style scoped>
.ad-management {
  padding: 20px;
}

.layout-container {
  display: flex;
  gap: 20px;
}

.app-list-card {
  flex: 0 0 500px; /* 固定宽度 */
  max-height: calc(100vh - 80px); /* 设置最大高度，减去上下padding的值 */
  display: flex;
  flex-direction: column;
}

.app-list-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto; /* 添加垂直滚动 */
  padding: 0; /* 移除默认内边距 */
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

.ad-config-card {
  flex: 1; /* 占据剩余空间 */
  min-width: 0; /* 防止内容溢出 */
}

.ad-config-content {
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

.empty-config {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;  /* 设置最小高度，使空状态垂直居中 */
}

.empty-config .el-empty {
  padding: 0;
}

.ad-config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
}

.ad-type-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.ad-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.ad-card-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ad-card-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ad-card-header.configured {
  background-color: #f0f9eb;
}

.ad-type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ad-type-info i {
  font-size: 24px;
  color: #409eff;
}

.ad-type-title {
  display: flex;
  flex-direction: column;
}

.ad-type-title h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.ad-type-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.ad-card-content {
  flex: 1;
  padding: 20px;
  min-height: 160px;
}

.ad-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ad-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ad-info-item .label {
  color: #909399;
  font-size: 14px;
}

.ad-info-item .value {
  color: #303133;
  font-weight: 500;
}

.ad-card-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 