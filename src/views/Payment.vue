<template>
  <div class="payment-management">
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

      <!-- 右侧支付配置 -->
      <el-card class="payment-config-card">
        <template #header>
          <div class="header">
            <h3 class="title-with-tag" v-if="selectedApp">
              支付配置 - {{ selectedApp.appName }}
              <el-tag :type="getPlatformType(selectedApp.platform)" effect="light" size="small" class="platform-tag">
                {{ selectedApp.platform }}
              </el-tag>
            </h3>
            <h3 v-else>支付配置</h3>
          </div>
        </template>

        <div class="payment-config-content">
          <template v-if="selectedApp">
            <div class="payment-config-grid">
              <!-- 普通支付配置 -->
              <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                <div class="payment-card-wrapper">
                  <!-- 支付类型标题区 -->
                  <div class="payment-card-header" :class="{ 'configured': paymentConfig?.normalPay }">
                    <div class="payment-type-info">
                      <el-icon><Money /></el-icon>
                      <div class="payment-type-title">
                        <h4>{{ getPaymentTypeName('normalPay') }}</h4>
                      </div>
                    </div>
                    <el-tag size="small" :type="paymentConfig?.normalPay ? 'success' : 'info'" effect="plain">
                      {{ paymentConfig?.normalPay ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 支付配置内容区 -->
                  <div class="payment-card-content" v-loading="loadingPaymentConfig">
                    <template v-if="paymentConfig?.normalPay">
                      <div class="payment-info-list">
                        <div class="payment-info-item">
                          <span class="label">状态</span>
                          <el-tag size="small" :type="paymentConfig.normalPay.enabled ? 'success' : 'danger'" effect="light">
                            {{ paymentConfig.normalPay.enabled ? '已配置' : '未配置' }}
                          </el-tag>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (Android)</span>
                          <span class="value">{{ paymentConfig.normalPay.gatewayAndroid }}</span>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (iOS)</span>
                          <span class="value">{{ paymentConfig.normalPay.gatewayIos }}</span>
                        </div>
                      </div>
                    </template>
                    <el-empty v-else description="暂未配置普通支付" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="payment-card-footer">
                    <template v-if="paymentConfig?.normalPay">
                      <el-button type="primary" link @click="handleEditPayment('normalPay')">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeletePayment('normalPay')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreatePayment('normalPay')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>

              <!-- 订单支付配置 -->
              <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                <div class="payment-card-wrapper">
                  <!-- 支付类型标题区 -->
                  <div class="payment-card-header" :class="{ 'configured': paymentConfig?.orderPay }">
                    <div class="payment-type-info">
                      <el-icon><Goods /></el-icon>
                      <div class="payment-type-title">
                        <h4>{{ getPaymentTypeName('orderPay') }}</h4>
                      </div>
                    </div>
                    <el-tag size="small" :type="paymentConfig?.orderPay ? 'success' : 'info'" effect="plain">
                      {{ paymentConfig?.orderPay ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 支付配置内容区 -->
                  <div class="payment-card-content" v-loading="loadingPaymentConfig">
                    <template v-if="paymentConfig?.orderPay">
                      <div class="payment-info-list">
                        <div class="payment-info-item">
                          <span class="label">状态</span>
                          <el-tag size="small" :type="paymentConfig.orderPay.enabled ? 'success' : 'danger'" effect="light">
                            {{ paymentConfig.orderPay.enabled ? '已配置' : '未配置' }}
                          </el-tag>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (Android)</span>
                          <span class="value">{{ paymentConfig.orderPay.gatewayAndroid }}</span>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (iOS)</span>
                          <span class="value">{{ paymentConfig.orderPay.gatewayIos }}</span>
                        </div>
                      </div>
                    </template>
                    <el-empty v-else description="暂未配置通用交易支付" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="payment-card-footer">
                    <template v-if="paymentConfig?.orderPay">
                      <el-button type="primary" link @click="handleEditPayment('orderPay')">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeletePayment('orderPay')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreatePayment('orderPay')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>

              <!-- 续费支付配置 -->
              <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                <div class="payment-card-wrapper">
                  <!-- 支付类型标题区 -->
                  <div class="payment-card-header" :class="{ 'configured': paymentConfig?.renewPay }">
                    <div class="payment-type-info">
                      <el-icon><Calendar /></el-icon>
                      <div class="payment-type-title">
                        <h4>{{ getPaymentTypeName('renewPay') }}</h4>
                      </div>
                    </div>
                    <el-tag size="small" :type="paymentConfig?.renewPay ? 'success' : 'info'" effect="plain">
                      {{ paymentConfig?.renewPay ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 支付配置内容区 -->
                  <div class="payment-card-content" v-loading="loadingPaymentConfig">
                    <template v-if="paymentConfig?.renewPay">
                      <div class="payment-info-list">
                        <div class="payment-info-item">
                          <span class="label">状态</span>
                          <el-tag size="small" :type="paymentConfig.renewPay.enabled ? 'success' : 'danger'" effect="light">
                            {{ paymentConfig.renewPay.enabled ? '已配置' : '未配置' }}
                          </el-tag>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (Android)</span>
                          <span class="value">{{ paymentConfig.renewPay.gatewayAndroid }}</span>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (iOS)</span>
                          <span class="value">{{ paymentConfig.renewPay.gatewayIos }}</span>
                        </div>
                      </div>
                    </template>
                    <el-empty v-else description="暂未配置连包支付" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="payment-card-footer">
                    <template v-if="paymentConfig?.renewPay">
                      <el-button type="primary" link @click="handleEditPayment('renewPay')">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeletePayment('renewPay')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreatePayment('renewPay')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>

              <!-- 抖赞支付配置 -->
              <el-card class="payment-type-card" :body-style="{ padding: '0' }">
                <div class="payment-card-wrapper">
                  <!-- 支付类型标题区 -->
                  <div class="payment-card-header" :class="{ 'configured': paymentConfig?.douzuanPay }">
                    <div class="payment-type-info">
                      <el-icon><Star /></el-icon>
                      <div class="payment-type-title">
                        <h4>{{ getPaymentTypeName('douzuanPay') }}</h4>
                      </div>
                    </div>
                    <el-tag size="small" :type="paymentConfig?.douzuanPay ? 'success' : 'info'" effect="plain">
                      {{ paymentConfig?.douzuanPay ? '已配置' : '未配置' }}
                    </el-tag>
                  </div>

                  <!-- 支付配置内容区 -->
                  <div class="payment-card-content" v-loading="loadingPaymentConfig">
                    <template v-if="paymentConfig?.douzuanPay">
                      <div class="payment-info-list">
                        <div class="payment-info-item">
                          <span class="label">状态</span>
                          <el-tag size="small" :type="paymentConfig.douzuanPay.enabled ? 'success' : 'danger'" effect="light">
                            {{ paymentConfig.douzuanPay.enabled ? '已启用' : '未启用' }}
                          </el-tag>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (Android)</span>
                          <span class="value">{{ paymentConfig.douzuanPay.gatewayAndroid }}</span>
                        </div>
                        <div class="payment-info-item">
                          <span class="label">网关 (iOS)</span>
                          <span class="value">{{ paymentConfig.douzuanPay.gatewayIos }}</span>
                        </div>
                      </div>
                    </template>
                    <el-empty v-else description="暂未配置抖钻支付" :image-size="60" />
                  </div>

                  <!-- 操作按钮区 -->
                  <div class="payment-card-footer">
                    <template v-if="paymentConfig?.douzuanPay">
                      <el-button type="primary" link @click="handleEditPayment('douzuanPay')">
                        <el-icon><Edit /></el-icon>编辑
                      </el-button>
                      <el-button type="danger" link @click="handleDeletePayment('douzuanPay')">
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleCreatePayment('douzuanPay')">
                        <el-icon><Plus /></el-icon>新建配置
                      </el-button>
                    </template>
                  </div>
                </div>
              </el-card>
            </div>
          </template>
          <template v-else>
            <el-empty 
              description="请先选择一个小程序" 
              :image-size="200"
            >
              <template #description>
                <p>请从左侧列表选择一个小程序以配置其支付选项</p>
              </template>
            </el-empty>
          </template>
        </div>
    </el-card>
    </div>

    <!-- 支付配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑支付配置' : '添加支付配置'"
      width="50%"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="'启用'"
            :inactive-value="'禁用'"
          />
        </el-form-item>
        <el-form-item label="网关 (Android)">
          <el-input v-model="form.gatewayAndroid" placeholder="请输入网关 (Android)" />
        </el-form-item>
        <el-form-item label="网关 (iOS)">
          <el-input v-model="form.gatewayIos" placeholder="请输入网关 (iOS)" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Money, Goods, Calendar, Star, Edit, Delete, Plus } from '@element-plus/icons-vue'
import request from '../utils/request'

const searchQuery = ref('')
const loadingApps = ref(false)
const loadingPaymentConfig = ref(false)
const apps = ref([])
const selectedApp = ref(null)
const paymentConfig = ref(null)
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  payType: '',
  merchantId: '',
  merchantKey: '',
  notifyUrl: '',
  status: '启用'
})
const currentPaymentType = ref('')

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

// 获取支付配置信息
const fetchPaymentConfig = async (appId) => {
  if (!appId) return
  
  loadingPaymentConfig.value = true
  try {
    const res = await request.get('/api/novel-pay/getAppPayByAppId', {
      params: { appId }
    })
    if (res.code === 200) {
      paymentConfig.value = res.data
    } else {
      throw new Error(res.message || '获取支付配置失败')
    }
  } catch (error) {
    console.error('获取支付配置失败:', error)
    paymentConfig.value = null
  } finally {
    loadingPaymentConfig.value = false
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

const handleRefresh = () => {
  fetchApps()
}

const handleAppSelect = (row) => {
  selectedApp.value = row
  fetchPaymentConfig(row.appid)
}

const handleCreatePayment = async (type) => {
  if (!selectedApp.value?.appid) {
    ElMessage.warning('请先选择小程序')
    return
  }

  currentPaymentType.value = type
  form.value = {
    status: '禁用',
    gatewayAndroid: '',
    gatewayIos: ''
  }
  dialogVisible.value = true
}

const handleEditPayment = (type) => {
  isEdit.value = true
  currentPaymentType.value = type
  form.value = {
    status: paymentConfig.value[type]?.enabled ? '启用' : '禁用',
    gatewayAndroid: paymentConfig.value[type]?.gatewayAndroid || '',
    gatewayIos: paymentConfig.value[type]?.gatewayIos || ''
  }
  dialogVisible.value = true
}

const handleDeletePayment = (type) => {
  if (!selectedApp.value?.appid) {
    ElMessage.warning('请先选择小程序')
    return
  }

  ElMessageBox.confirm(`确定要删除${getPaymentTypeName(type)}配置吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await request.get('/api/novel-pay/deleteAppPayByAppIdAndType', {
        params: {
          appId: selectedApp.value.appid,
          payType: type
        }
      })
      
      if (res.code === 200) {
        ElMessage.success('删除成功')
        // 重新获取支付配置
        await fetchPaymentConfig(selectedApp.value.appid)
      } else {
        throw new Error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {
    // 取消删除操作
  })
}

const handleSave = async () => {
  if (!form.value.gatewayAndroid || !form.value.gatewayIos) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  try {
    const requestData = {
      appId: selectedApp.value.appid,
      payType: currentPaymentType.value,
      enabled: form.value.status === '启用',
      gatewayAndroid: form.value.gatewayAndroid,
      gatewayIos: form.value.gatewayIos
    }
    
    const apiUrl = isEdit.value 
      ? '/api/novel-pay/updateAppPay' 
      : '/api/novel-pay/create'

    const res = await request.post(apiUrl, requestData)
    
    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      paymentConfig.value = res.data
      dialogVisible.value = false
    } else {
      throw new Error(res.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    console.error(isEdit.value ? '更新失败:' : '创建失败:', error)
    ElMessage.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
  }
}

const getPaymentTypeName = (type) => {
  const names = {
    normalPay: '普通支付',
    orderPay: '通用交易支付',
    renewPay: '连包支付',
    douzuanPay: '抖钻支付'
  }
  return names[type] || type
}

onMounted(() => {
  fetchApps()
})
</script>

<style scoped>
.payment-management {
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

.payment-config-card {
  flex: 1; /* 占据剩余空间 */
  min-width: 0; /* 防止内容溢出 */
}

.payment-config-content {
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

.payment-config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
}

.payment-type-card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.payment-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.payment-card-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.payment-card-header {
  padding: 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-card-header.configured {
  background-color: #f0f9eb;
}

.payment-type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-type-info el-icon {
  font-size: 24px;
  color: #409eff;
}

.payment-type-title {
  display: flex;
  flex-direction: column;
}

.payment-type-title h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.payment-type-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.payment-card-content {
  flex: 1;
  padding: 20px;
  min-height: 160px;
}

.payment-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-info-item .label {
  color: #909399;
  font-size: 14px;
}

.payment-info-item .value {
  color: #303133;
  font-weight: 500;
}

.payment-card-footer {
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 