<template>
  <div class="app-list">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card 
          class="data-card douyin-card"
          :class="{ 'is-active': selectedPlatform === '抖音' }"
          @click="handlePlatformSelect('抖音')"
        >
          <template #header>
            <div class="card-header">
              <span>抖音小程序</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.douyin }}</div>
          <div class="card-trend">
            小程序总数 <span class="count">{{ statistics.douyinCount }}</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card 
          class="data-card kuaishou-card"
          :class="{ 'is-active': selectedPlatform === '快手' }"
          @click="handlePlatformSelect('快手')"
        >
          <template #header>
            <div class="card-header">
              <span>快手小程序</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.kuaishou }}</div>
          <div class="card-trend">
            小程序总数 <span class="count">{{ statistics.kuaishouCount }}</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card 
          class="data-card weixin-card"
          :class="{ 'is-active': selectedPlatform === '微信' }"
          @click="handlePlatformSelect('微信')"
        >
          <template #header>
            <div class="card-header">
              <span>微信小程序</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.weixin }}</div>
          <div class="card-trend">
            小程序总数 <span class="count">{{ statistics.weixinCount }}</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card 
          class="data-card baidu-card"
          :class="{ 'is-active': selectedPlatform === '百度' }"
          @click="handlePlatformSelect('百度')"
        >
          <template #header>
            <div class="card-header">
              <span>百度小程序</span>
            </div>
          </template>
          <div class="card-value">{{ statistics.baidu }}</div>
          <div class="card-trend">
            小程序总数 <span class="count">{{ statistics.baiduCount }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="app-table">
      <template #header>
        <div class="header">
          <h3>
            {{ selectedPlatform ? selectedPlatform + '小程序列表' : '全部小程序列表' }}
            <el-tag 
              v-if="selectedPlatform"
              class="platform-tag"
              :type="getPlatformType(selectedPlatform)"
              effect="light"
              closable
              @close="clearPlatformSelect"
            >
              {{ selectedPlatform }}
            </el-tag>
          </h3>
          <div style="display: flex; align-items: center; gap: 15px;">
            <el-input
              v-model="searchQuery"
              placeholder="搜索小程序"
              style="width: 220px;"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleAddApp">快速创建小程序</el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="filteredAppList" 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column 
          v-for="col in tableColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        >
          <template #default="scope" v-if="col.slot">
            <!-- 平台列 -->
            <template v-if="col.prop === 'platform'">
              <el-tag 
                :type="getPlatformType(scope.row.platform)"
                :effect="'light'"
              >
                {{ scope.row.platform }}
              </el-tag>
            </template>
            
            <!-- 状态列 -->
            <template v-if="col.prop === 'status'">
              <el-tag :type="scope.row.status === '运行中' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>

            <!-- 主题色列 -->
            <template v-if="col.prop === 'mainTheme' || col.prop === 'secondTheme'">
              <div class="color-block" :style="{ backgroundColor: scope.row[col.prop] || '#ffffff00' }"></div>
              <span>{{ scope.row[col.prop] || '-' }}</span>
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" fixed="right">
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

    <!-- 小程序编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑小程序' : '添加小程序'"
      width="50%"
    >
      <el-form :model="appForm" label-width="120px">
        <el-form-item label="platform">
          <el-select v-model="appForm.platform">
            <el-option label="抖音小程序" value="抖音" />
            <el-option label="快手小程序" value="快手" />
            <el-option label="微信小程序" value="微信" />
            <el-option label="百度小程序" value="百度" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="appName">
          <el-input v-model="appForm.appName" placeholder="请输入小程序名称" />
        </el-form-item>
        
        <el-form-item label="version">
          <el-input v-model="appForm.version" placeholder="请输入版本号" />
        </el-form-item>
        
        <el-form-item label="appCode">
          <el-input v-model="appForm.appCode" placeholder="例：tt_miniapp_yunyounovel" />
        </el-form-item>
        
        <el-form-item label="product">
          <el-input v-model="appForm.product" placeholder="例：yunyounovel" />
        </el-form-item>
        
        <el-form-item label="customer">
          <el-input v-model="appForm.customer" placeholder="例：tt_yunyounovel" />
        </el-form-item>
        
        <el-form-item label="appid">
          <el-input v-model="appForm.appid" placeholder="请输入AppID" />
        </el-form-item>
        
        <el-form-item label="token_id">
          <el-input-number 
            v-model="appForm.token_id" 
            :min="1"
            placeholder="请输入Token ID"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="cl">
          <el-input v-model="appForm.cl" placeholder="例：tt_miniapp_yunyounovel" />
        </el-form-item>
        
        <el-form-item label="deliverId">
          <el-input v-model="appForm.deliverId" placeholder="例：ad_12345" />
        </el-form-item>
        
        <el-form-item label="bannerId">
          <el-input v-model="appForm.bannerId" placeholder="例：banner_6789" />
        </el-form-item>
        
        <el-form-item label="mainTheme">
          <el-color-picker 
            v-model="appForm.mainTheme" 
            show-alpha 
            color-format="hex" 
          />
        </el-form-item>
        
        <el-form-item label="secondTheme">
          <el-color-picker 
            v-model="appForm.secondTheme" 
            show-alpha 
            color-format="hex" 
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
import { Search } from '@element-plus/icons-vue'
import request from '../utils/request'
import { pinyin } from 'pinyin-pro'

// 平台映射
const platformMap = {
  'douyin': '抖音',
  'kuaishou': '快手',
  'weixin': '微信',
  'baidu': '百度'
}

// 统计数据
const statistics = ref({
  douyin: '抖音小程序',
  douyinCount: 0,
  kuaishou: '快手小程序',
  kuaishouCount: 0,
  weixin: '微信小程序',
  weixinCount: 0,
  baidu: '百度小程序',
  baiduCount: 0
})

// 小程序列表数据
const appList = ref([])
const selectedPlatform = ref('')
const loading = ref(false)
const searchQuery = ref('')

// 获取小程序列表
const fetchAppList = async () => {
  loading.value = true
  try {
    const res = await request.get('/api/novel-apps/appLists')
    const data = res.data
    
    // 处理数据
    let allApps = []
    Object.entries(data).forEach(([platform, apps]) => {
      // 更新统计数据
      statistics.value[`${platform}Count`] = apps.length
      
      // 转换应用数据
      const convertedApps = apps.map(app => ({
        id: app.id,
        platform: platformMap[app.platform] || app.platform,
        appName: app.appName,
        appid: app.appid,
        appCode: app.appCode,
        product: app.product,
        customer: app.customer,
        token_id: app.tokenId,
        cl: app.cl,
        deliverId: app.deliverId,
        bannerId: app.bannerId,
        mainTheme: app.mainTheme,
        secondTheme: app.secondTheme,
        version: app.version,
        status: '运行中',
        createTime: new Date(app.createTime).toLocaleDateString(),
        updateTime: new Date(app.updateTime).toLocaleDateString()
      }))
      
      allApps = [...allApps, ...convertedApps]
    })
    
    appList.value = allApps
  } catch (error) {
    console.error('获取应用列表失败:', error)
    ElMessage.error('获取应用列表失败')
  } finally {
    loading.value = false
  }
}

const dialogVisible = ref(false)
const isEdit = ref(false)
const appForm = ref({
  platform: '',
  appName: '',
  appCode: '',
  product: '',
  customer: '',
  appid: '',
  token_id: null,
  cl: '',
  deliverId: '',
  bannerId: '',
  mainTheme: '',
  secondTheme: '',
  version: ''
})

// 根据选中平台过滤小程序列表
const filteredAppList = computed(() => {
  let list = appList.value
  if (selectedPlatform.value) {
    list = list.filter(app => app.platform === selectedPlatform.value)
  }
  if (!searchQuery.value) return list
  const q = searchQuery.value.toLowerCase()
  const isSingleCharQuery = q.length === 1;
  return list.filter(app => {
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
    if (name.toLowerCase().includes(q)) return true
    
    // 检查拼音首字母
    if (isSingleCharQuery) {
      // 对于单字符查询，严格匹配首字母
      if (namePinyinFirst.length > 0 && namePinyinFirst[0] === q) return true;
    } else {
      // 对于多字符查询，检查是否以首字母开头
      if (namePinyinFirst.startsWith(q)) return true
    }
    
    // 检查全拼
    if (namePinyinFull.includes(q)) return true
    
    // 检查其他字段
    return (
      (app.appid && app.appid.toLowerCase().includes(q)) ||
      (app.appCode && app.appCode.toLowerCase().includes(q)) ||
      (app.product && app.product.toLowerCase().includes(q)) ||
      (app.customer && app.customer.toLowerCase().includes(q)) ||
      (app.cl && app.cl.toLowerCase().includes(q))
    )
  })
})

const getPlatformType = (platform) => {
  const types = {
    '抖音': 'info',
    '快手': 'danger',
    '微信': 'success',
    '百度': 'primary'
  }
  return types[platform] || 'info'
}

const handleAddApp = () => {
  isEdit.value = false
  appForm.value = {
    platform: '',
    appName: '',
    appCode: '',
    product: '',
    customer: '',
    appid: '',
    token_id: null,
    cl: '',
    deliverId: '',
    bannerId: '',
    mainTheme: '',
    secondTheme: '',
    version: ''
  }
  dialogVisible.value = true
}

const handleEdit = (app) => {
  isEdit.value = true
  appForm.value = {
    id: app.id,
    platform: app.platform,
    appName: app.appName,
    appCode: app.appCode,
    product: app.product,
    customer: app.customer,
    appid: app.appid,
    token_id: Number(app.token_id),
    cl: app.cl,
    deliverId: app.deliverId,
    bannerId: app.bannerId,
    mainTheme: app.mainTheme,
    secondTheme: app.secondTheme,
    version: app.version
  }
  dialogVisible.value = true
}

const handleDelete = async (app) => {
  try {
    await ElMessageBox.confirm(`确定要删除${app.platform}小程序：${app.appName}吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    loading.value = true
    const res = await request.get('/api/novel-apps/delete', {
      params: { appId: app.appid }
    })
    if (res.code === 200) {
      ElMessage.success('删除成功')
      await fetchAppList()
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!appForm.value.platform || !appForm.value.appName || !appForm.value.appid || 
      !appForm.value.appCode || !appForm.value.product || !appForm.value.customer || 
      !appForm.value.cl) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  try {
    loading.value = true
    
    // 转换平台值为后端需要的格式
    const platformCode = Object.entries(platformMap).find(([key, value]) => 
      value === appForm.value.platform
    )?.[0]

    // 构造请求数据，保持和后端接口一致的字段名
    const requestData = {
      appName: appForm.value.appName,
      appCode: appForm.value.appCode,
      platform: platformCode,
      product: appForm.value.product,
      customer: appForm.value.customer,
      appid: appForm.value.appid,
      tokenId: appForm.value.token_id,
      cl: appForm.value.cl,
      deliverId: appForm.value.deliverId,
      bannerId: appForm.value.bannerId,
      mainTheme: appForm.value.mainTheme,
      secondTheme: appForm.value.secondTheme,
      version: appForm.value.version
    }

    

    if (isEdit.value) {
      // 添加 id 字段
      requestData.id = appForm.value.id
      
      // 发送更新请求
      const res = await request.post('/api/novel-apps/update', requestData)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        await fetchAppList()
        dialogVisible.value = false
      }
    } else {
      // 发送创建请求
      const res = await request.post('/api/novel-apps/create', requestData)
      if (res.code === 200) {
        ElMessage.success('添加成功')
        await fetchAppList()
        dialogVisible.value = false
      }
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 平台选择处理
const handlePlatformSelect = (platform) => {
  if (selectedPlatform.value === platform) {
    selectedPlatform.value = ''
  } else {
    selectedPlatform.value = platform
  }
}

// 清除平台选择
const clearPlatformSelect = () => {
  selectedPlatform.value = ''
}

// 修改表格列配置
const tableColumns = [
  {
    prop: 'platform',
    label: '平台',
    width: '100',
    slot: true
  },
  {
    prop: 'appName',
    label: '小程序名称',
    width: '150'
  },
  {
    prop: 'version',
    label: '版本号',
    width: '100'
  },
  {
    prop: 'appid',
    label: 'AppID',
    width: '200'
  },
  {
    prop: 'appCode',
    label: '应用代号',
    width: '180'
  },
  {
    prop: 'product',
    label: '产品线',
    width: '120'
  },
  {
    prop: 'token_id',
    label: 'Token ID',
    width: '100'
  },
  {
    prop: 'cl',
    label: 'CL标识',
    width: '180'
  },
  {
    prop: 'deliverId',
    label: 'deliverId',
    width: '120'
  },
  {
    prop: 'bannerId',
    label: 'bannerId',
    width: '120'
  },
  {
    prop: 'mainTheme',
    label: '主题色',
    width: '100',
    slot: true
  },
  {
    prop: 'secondTheme',
    label: '次要主题色',
    width: '100',
    slot: true
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '120'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100',
    slot: true
  }
]

// 页面加载时获取数据
onMounted(() => {
  fetchAppList()
})
</script>

<style scoped>
.app-list {
  padding: 20px;
}

.data-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin: 16px 0;
  color: #303133;
}

.card-trend {
  font-size: 14px;
  color: #909399;
}

.count {
  color: #f56c6c;
  font-weight: bold;
}

/* 平台卡片样式 */
.douyin-card :deep(.el-card__header) {
  background-color: #2c2c2c;
  color: white;
}

.kuaishou-card :deep(.el-card__header) {
  background-color: #ff4e33;
  color: white;
}

.weixin-card :deep(.el-card__header) {
  background-color: #07c160;
  color: white;
}

.baidu-card :deep(.el-card__header) {
  background-color: #4e6ef2;
  color: white;
}

/* 卡片选中态样式 */
.data-card.is-active {
  transform: translateY(-5px);
  border: 2px solid;
}

.douyin-card.is-active {
  border-color: #2c2c2c;
}

.kuaishou-card.is-active {
  border-color: #ff4e33;
}

.weixin-card.is-active {
  border-color: #07c160;
}

.baidu-card.is-active {
  border-color: #4e6ef2;
}

.platform-tag {
  margin-left: 12px;
  font-weight: normal;
}

/* 表格样式优化 */
.app-table {
  margin-top: 20px;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  color: #303133;
}

/* 表格内标签样式 */
:deep(.el-tag) {
  border-radius: 4px;
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 4px;
}

:deep(.el-button--primary) {
  background-color: #409eff;
}

:deep(.el-button--success) {
  background-color: #67c23a;
}

:deep(.el-button--danger) {
  background-color: #f56c6c;
}

/* 添加颜色块样式 */
.color-block {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  margin-right: 8px;
  vertical-align: middle;
}
</style> 