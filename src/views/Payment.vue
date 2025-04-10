<template>
  <div class="payment">
    <el-card>
      <template #header>
        <div class="header">
          <h3>支付配置</h3>
          <el-button type="primary" @click="handleAdd">添加支付配置</el-button>
        </div>
      </template>

      <el-table :data="paymentConfigs" style="width: 100%">
        <el-table-column prop="platform" label="平台">
          <template #default="scope">
            <el-tag :type="getPlatformType(scope.row.platform)" effect="light">
              {{ scope.row.platform }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="appName" label="小程序" />
        <el-table-column prop="payType" label="支付类型" />
        <el-table-column prop="merchantId" label="商户号" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button 
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 支付配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑支付配置' : '添加支付配置'"
      width="50%"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="platform">
          <el-select v-model="form.platform">
            <el-option label="抖音小程序" value="抖音" />
            <el-option label="快手小程序" value="快手" />
            <el-option label="微信小程序" value="微信" />
            <el-option label="百度小程序" value="百度" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="appId">
          <el-select v-model="form.appId" placeholder="选择小程序">
            <el-option 
              v-for="app in appOptions" 
              :key="app.id" 
              :label="app.appName" 
              :value="app.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="payType">
          <el-select v-model="form.payType">
            <el-option label="微信支付" value="wechat" />
            <el-option label="支付宝" value="alipay" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="merchantId">
          <el-input v-model="form.merchantId" placeholder="请输入商户号" />
        </el-form-item>
        
        <el-form-item label="merchantKey">
          <el-input v-model="form.merchantKey" placeholder="请输入商户密钥" show-password />
        </el-form-item>
        
        <el-form-item label="notifyUrl">
          <el-input v-model="form.notifyUrl" placeholder="请输入回调地址" />
        </el-form-item>
        
        <el-form-item label="status">
          <el-switch
            v-model="form.status"
            :active-value="'启用'"
            :inactive-value="'禁用'"
          />
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
import request from '../utils/request'

const paymentConfigs = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({
  platform: '',
  appId: '',
  payType: '',
  merchantId: '',
  merchantKey: '',
  notifyUrl: '',
  status: '启用'
})
const appOptions = ref([])

// 获取小程序列表作为选项
const fetchAppOptions = async () => {
  try {
    const res = await request.get('/api/novel-apps/appLists')
    const data = res.data
    
    let apps = []
    Object.values(data).forEach(platformApps => {
      apps = [...apps, ...platformApps.map(app => ({
        id: app.id,
        appName: app.appName,
        platform: app.platform
      }))]
    })
    
    appOptions.value = apps
  } catch (error) {
    console.error('获取小程序列表失败:', error)
  }
}

// 获取支付配置列表
const fetchPaymentConfigs = async () => {
  try {
    // 暂时使用模拟数据，后续可以替换为真实接口
    paymentConfigs.value = [
      {
        id: 1,
        platform: '微信',
        appName: '云游小说',
        payType: '微信支付',
        merchantId: '12345678',
        status: '启用'
      },
      {
        id: 2,
        platform: '抖音',
        appName: '看点小说',
        payType: '支付宝',
        merchantId: '87654321',
        status: '启用'
      }
    ]
  } catch (error) {
    console.error('获取支付配置失败:', error)
  }
}

const getPlatformType = (platform) => {
  const types = {
    '抖音': 'info',
    '快手': 'danger',
    '微信': 'success',
    '百度': 'primary'
  }
  return types[platform] || 'info'
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    platform: '',
    appId: '',
    payType: '',
    merchantId: '',
    merchantKey: '',
    notifyUrl: '',
    status: '启用'
  }
  dialogVisible.value = true
}

const handleEdit = (config) => {
  isEdit.value = true
  form.value = { ...config }
  dialogVisible.value = true
}

const handleDelete = (config) => {
  ElMessageBox.confirm(`确定要删除该支付配置吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    paymentConfigs.value = paymentConfigs.value.filter(item => item.id !== config.id)
    ElMessage.success('删除成功')
  })
}

const handleSave = () => {
  if (!form.value.platform || !form.value.appId || !form.value.payType || !form.value.merchantId) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  if (isEdit.value) {
    const index = paymentConfigs.value.findIndex(item => item.id === form.value.id)
    if (index !== -1) {
      paymentConfigs.value[index] = { ...form.value }
    }
  } else {
    paymentConfigs.value.push({
      id: Date.now(),
      ...form.value,
      appName: appOptions.value.find(app => app.id === form.value.appId)?.appName
    })
  }
  
  ElMessage.success('保存成功')
  dialogVisible.value = false
}

onMounted(() => {
  fetchAppOptions()
  fetchPaymentConfigs()
})
</script>

<style scoped>
.payment {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 