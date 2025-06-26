<template>
  <div class="weiju-config">
    <el-card class="app-list-card">
      <template #header>
    <div class="header">
          <h3>小程序列表</h3>
          <div>
            <el-input
              v-model="searchQuery"
              placeholder="搜索小程序"
              style="width: 200px; margin-right: 15px;margin-left: 15px;"
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
        <el-table 
          :data="filteredApps" 
          style="width: 100%"
          @row-click="handleAppSelect"
          row-key="id"
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
          <el-table-column prop="appid" label="AppID" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '运行中' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card v-if="selectedApp" class="config-card" ref="configCard">
      <template #header>
        <div class="header">
          <h3 class="title-with-tag">
            微距配置 - {{ selectedApp.appName }}
            <el-tag :type="getPlatformType(selectedApp.platform)" effect="light" size="small" class="platform-tag">
              {{ selectedApp.platform }}
            </el-tag>
          </h3>
        </div>
      </template>

      <div class="app-info" v-if="selectedApp">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="AppID">{{ selectedApp.appid }}</el-descriptions-item>
          <el-descriptions-item label="deliverId">{{ selectedApp.deliverId }}</el-descriptions-item>
          <el-descriptions-item label="bannerId">{{ selectedApp.bannerId }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div v-loading="loadingConfig">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="business_type" name="business_type">
            <div v-if="businessTypeConfigs.length === 0" class="empty-config">
              <el-empty description="暂无配置数据"></el-empty>
              <el-button type="primary" @click="handleCreateBusinessType">新建配置</el-button>
    </div>
    
            <div v-else>
              <el-descriptions :column="2" border class="config-id-info">
                <el-descriptions-item label="adId">
                  <el-tag type="info">{{ businessTypeAdId }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="deliverId">
                  <el-tag type="info">{{ originalDeliverId }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
              
              <el-table :data="businessTypeConfigs" style="width: 100%; margin-top: 15px;">
                <el-table-column prop="key" label="配置项" width="200" />
                <el-table-column prop="value" label="配置值">
                  <template #default="scope">
                    <el-input 
                      v-if="scope.row.type === 'string'" 
                      v-model="scope.row.value"
                      size="small"
                    />
                    <el-input-number 
                      v-else-if="scope.row.type === 'number'" 
                      v-model="scope.row.value"
                      size="small" 
                      :controls="false"
      style="width: 100%"
                    />
                    <el-switch 
                      v-else-if="scope.row.type === 'boolean'" 
                      v-model="scope.row.value"
                    />
                    <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
                <el-table-column prop="description" label="描述" />
              </el-table>
              
              <div class="config-actions">
                <el-button type="primary" @click="handleSaveBusinessType">保存配置</el-button>
                <el-button type="danger" @click="handleDeleteConfirm">删除配置</el-button>
                <el-button @click="handleCopyBusinessTypeConfig">复制配置</el-button>
                <el-button @click="handlePasteBusinessTypeConfig">粘贴配置</el-button>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="public_switch" name="public_switch">
            <div v-if="publicSwitchConfigs.length === 0" class="empty-config">
              <el-empty description="暂无配置数据"></el-empty>
              <el-button type="primary" @click="handleCreatePublicSwitch">新建配置</el-button>
            </div>
            
            <div v-else>
              <el-table :data="publicSwitchConfigs" style="width: 100%">
                <el-table-column prop="key" label="配置项" width="200" />
                <el-table-column prop="value" label="配置值">
        <template #default="scope">
                    <el-input 
                      v-if="scope.row.type === 'string'" 
                      v-model="scope.row.value"
            size="small"
                    />
                    <el-input-number 
                      v-else-if="scope.row.type === 'number'" 
                      v-model="scope.row.value"
            size="small"
                      :controls="false"
                      style="width: 100%"
                    />
                    <el-switch 
                      v-else-if="scope.row.type === 'boolean'" 
                      v-model="scope.row.value"
                    />
                    <span v-else>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
                <el-table-column prop="description" label="描述" />
    </el-table>

              <div class="config-actions">
                <el-button type="primary" @click="handleSavePublicSwitch">保存配置</el-button>
                <el-button type="danger" @click="handleDeleteBannerConfirm">删除配置</el-button>
                <el-button @click="handleCopyPublicSwitchConfig">复制配置</el-button>
                <el-button @click="handlePastePublicSwitchConfig">粘贴配置</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 添加删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定要删除该配置吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDeleteBusinessType">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加banner删除确认对话框 -->
    <el-dialog
      v-model="deleteBannerDialogVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定要删除该banner配置吗？此操作不可恢复。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteBannerDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleDeleteBanner">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import request from '../utils/request'
import { pinyin } from 'pinyin-pro'

// 小程序列表相关
const apps = ref([])
const loadingApps = ref(false)
const searchQuery = ref('')
const selectedApp = ref(null)
const configCard = ref(null)

// 配置相关
const activeTab = ref('business_type')
const loadingConfig = ref(false)

// 配置数据
const businessTypeConfigs = ref([])
const publicSwitchConfigs = ref([])
const isNewBusinessType = ref(false)
const isNewPublicSwitch = ref(false)
const publicSwitchLoaded = ref(false)
const businessTypeLoaded = ref(false)

// 添加一个变量来存储原始deliverId
const originalDeliverId = ref('');

// 添加一个变量来存储adId
const businessTypeAdId = ref('');

// 添加变量存储banner相关信息
const bannerAdId = ref('');
const originalBannerId = ref('');

// 过滤后的小程序列表
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

// 监听选项卡变化
watch(activeTab, (newTab) => {
  if (newTab === 'public_switch' && selectedApp.value && !publicSwitchLoaded.value) {
    fetchPublicSwitchConfigs(selectedApp.value.id)
  }else if(newTab === 'business_type' && selectedApp.value && !businessTypeLoaded.value){
    fetchBusinessTypeConfigs(selectedApp.value.id)
  }
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
        appid: app.appid,
        deliverId: app.deliverId || '',
        bannerId: app.bannerId || '',
        status: '运行中'
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

// 获取配置数据
const fetchBusinessTypeConfigs = async (appId) => {
  loadingConfig.value = true
  try {
    // 查找选中的应用
    const app = apps.value.find(a => a.id === appId)
    if (!app || !app.deliverId) {
      // 如果没有deliverId，清空配置并显示空状态
      businessTypeConfigs.value = []
      businessTypeAdId.value = ''
      originalDeliverId.value = ''
      // 不显示任何提示消息，因为这是正常的空状态
      return
    }
    
    // 使用真实API获取business_type配置
    const businessTypeRes = await request.get(`/api/novel-weiju/deliver/getDeliverByDeliverId?deliverId=${app.deliverId}`)
    if (businessTypeRes.code === 200) {
      const data = businessTypeRes.data
      businessTypeAdId.value = data.adId
      originalDeliverId.value = data.deliverId
      businessTypeConfigs.value = convertToConfigItems(data)
      isNewBusinessType.value = false
      businessTypeLoaded.value = true
    } else {
      ElMessage.error(businessTypeRes.message || '获取配置失败')
      businessTypeConfigs.value = []
      businessTypeAdId.value = ''
      originalDeliverId.value = ''
    }
  } catch (error) {
    console.error('获取微距配置失败:', error)
   
    businessTypeConfigs.value = []
    businessTypeAdId.value = ''
    originalDeliverId.value = ''
  } finally {
    loadingConfig.value = false
  }
}

// 修改获取public_switch配置的函数
const fetchPublicSwitchConfigs = async (appId) => {
  if (!appId) return
  
  // 查找选中的应用
  const app = apps.value.find(a => a.id === appId)
  if (!app || !app.bannerId) {
    // 如果没有bannerId，清空配置并显示空状态
    publicSwitchConfigs.value = []
    bannerAdId.value = ''
    originalBannerId.value = ''
    // 不显示任何提示消息，因为这是正常的空状态
    return
  }
  
  loadingConfig.value = true
  try {
    const publicSwitchRes = await request.get('/api/novel-weiju/banner/getBannerByBannerId', {
      params: {
        bannerId: app.bannerId
      }
    })
    
    if (publicSwitchRes.code === 200) {
      const data = publicSwitchRes.data
      bannerAdId.value = data.adId
      originalBannerId.value = data.bannerId
      publicSwitchConfigs.value = convertToBannerConfigItems(data)
      isNewPublicSwitch.value = false
      publicSwitchLoaded.value = true
    } else {
      // 不再抛出错误，直接显示消息
      ElMessage.error(publicSwitchRes.message || '获取banner配置失败')
      publicSwitchConfigs.value = []
      bannerAdId.value = ''
      originalBannerId.value = ''
    }
  } catch (error) {
    console.error('获取banner配置失败:', error)
    publicSwitchConfigs.value = []
    bannerAdId.value = ''
    originalBannerId.value = ''
  } finally {
    loadingConfig.value = false
  }
}

// 添加新的转换函数处理banner配置数据
const convertToBannerConfigItems = (data) => {
  const configItems = []
  const excludeFields = ['adId', 'bannerId', 'createTime', 'updateTime','create_time','update_time']
  const descriptionMap = {
    'material': '素材',
    'time': '时间',
    'mat_id': '素材ID',
    'ks_apple_pay': '快手苹果支付',
    'channel_switch': '渠道开关',
    'reset_gray_switch': '重置灰度开关',
    'pay_ad': '支付广告',
    'renew_pay': '续费支付',
    'bd_apple_pay': '百度苹果支付',
    'tt_iOS_pay': '头条iOS支付',
    'wx_iOS_pay': '微信iOS支付',
    'pay_method': '支付方式',
    'tt_apple_pay': '头条苹果支付',
    'is_im': '是否IM',
    'ad_banner_switch': 'banner广告配置',
    'ad_interstitial_switch': '插屏广告配置',
    'homepage_pop_01': '首页弹窗01',
    'homepage_banner_01': '首页横幅01',
    'homepage_banner_02': '首页横幅02',
    'homepage_banner_03': '首页横幅03',
    'homepage_banner_04': '首页横幅04',
    'homepage_banner_05': '首页横幅05',
    'homepage_banner_06': '首页横幅06',
    'homepage_banner_07': '首页横幅07',
    'homepage_banner_08': '首页横幅08',
    'detailPage_banner_01': '详情页横幅01',
    'detailPage_banner_02': '详情页横幅02',
    'mediapage_video_banner': '媒体页视频横幅',
    'mediapage_banner_01': '媒体页横幅01',
    'mediapage_banner_02': '媒体页横幅02',
    'mediapage_banner_03': '媒体页横幅03',
    'mediapage_banner_04': '媒体页横幅04',
    'mediapage_banner_05': '媒体页横幅05',
    'mediapage_banner_06': '媒体页横幅06',
    'mediapage_banner_07': '媒体页横幅07',
    'mediapage_banner_08': '媒体页横幅08'
  }
  
  // 遍历对象的所有属性
  for (const key in data) {
    if (!excludeFields.includes(key)) {
      configItems.push({
        key: key,
        value: data[key] || '',
        description: descriptionMap[key] || key,
        type: 'string'  // banner配置都使用字符串类型
      })
    }
  }
  
  return configItems
}

// 创建默认的business_type配置 - 前端直接创建默认值，不发请求
const handleCreateBusinessType = () => {
  if (!selectedApp.value || !selectedApp.value.deliverId) {
    ElMessage.warning('请先选择一个有效的小程序')
    return
  }
  
  // 使用前端默认值，不请求API
  const descriptionMap = {
    'coin_si': '金币配置',
    'package_Si': '套餐配置',
    'freeX_perUnlock': '每次解锁免费次数',
    'material': '素材',
    'ok': '启用状态',
    'priority_payment': '优先支付',
    'x_unlock': 'X解锁',
    'parm2': '参数2',
    'free_step_1': '免费步骤1',
    'free_step_2': '免费步骤2',
    'free_step_3': '免费步骤3',
    'free_step_4': '免费步骤4',
    'vip_step_1': 'VIP步骤1',
    'vip_step_2': 'VIP步骤2',
    'vip_step_3': 'VIP步骤3',
    'vip_step_4': 'VIP步骤4'
  }
  
  businessTypeConfigs.value = Object.keys(descriptionMap).map(key => ({
    key,
  value: '',
    description: descriptionMap[key],
    type: 'string'
  }))
  
  // 标记为新建状态，保存时使用创建接口
  isNewBusinessType.value = true
  businessTypeLoaded.value = true
  ElMessage.success('businessType配置创建成功')
}

// 修改创建banner配置的函数
const handleCreatePublicSwitch = () => {
  console.log('selectedApp.value',selectedApp.value)
  if (!selectedApp.value || !selectedApp.value.bannerId) {
    ElMessage.warning('请先选择一个有效的小程序')
    return
  }
  
  // 使用前端默认值，创建所有可配置的banner字段
  const defaultBannerConfig = {
    bannerId: selectedApp.value.bannerId,
    material: '',
    time: '',
    mat_id: '',
    ks_apple_pay: '',
    channel_switch: '',
    reset_gray_switch: '',
    pay_ad: '',
    renew_pay: '',
    bd_apple_pay: '',
    tt_iOS_pay: '',
    wx_iOS_pay: '',
    pay_method: '',
    tt_apple_pay: '',
    is_im: '',
    ad_interstitial_switch:'',
    ad_banner_switch:'',
    homepage_pop_01: '',
    homepage_banner_01: '',
    homepage_banner_02: '',
    homepage_banner_03: '',
    homepage_banner_04: '',
    homepage_banner_05: '',
    homepage_banner_06: '',
    homepage_banner_07: '',
    homepage_banner_08: '',
    detailPage_banner_01: '',
    detailPage_banner_02: '',
    mediapage_video_banner: '',
    mediapage_banner_01: '',
    mediapage_banner_02: '',
    mediapage_banner_03: '',
    mediapage_banner_04: '',
    mediapage_banner_05: '',
    mediapage_banner_06: '',
    mediapage_banner_07: '',
    mediapage_banner_08: ''
  }

  // 发送创建请求
  loadingConfig.value = true
  request.post('/api/novel-weiju/banner/createBanner', defaultBannerConfig)
    .then(res => {
      if (res.code === 200) {
        const data = res.data
        // 保存返回的ID信息
        bannerAdId.value = data.adId
        originalBannerId.value = data.bannerId
        // 将返回的数据转换为配置项
        publicSwitchConfigs.value = convertToBannerConfigItems(data)
        isNewPublicSwitch.value = false
        publicSwitchLoaded.value = true
        ElMessage.success('banner配置创建成功')
      } else {
        throw new Error(res.message || '创建失败')
      }
    })
    .catch(error => {
      console.error('创建banner配置失败:', error)
      ElMessage.error(error.message || '创建banner配置失败')
      publicSwitchConfigs.value = []
      bannerAdId.value = ''
      originalBannerId.value = ''
    })
    .finally(() => {
      loadingConfig.value = false
    })
}

// 保存business_type配置 - 根据是否为新建状态决定使用创建还是更新接口
const handleSaveBusinessType = async () => {
  if (!selectedApp.value) {
    ElMessage.warning('请先选择一个有效的小程序')
    return
  }
  
  try {
    loadingConfig.value = true
    
    // 准备数据 - 使用驼峰命名法
    const businessTypeData = {
      deliverId: isNewBusinessType.value ? selectedApp.value.deliverId : originalDeliverId.value
    }
    
    if (!isNewBusinessType.value && businessTypeAdId.value) {
      businessTypeData.ad_id = businessTypeAdId.value  // 修改为ad_id以匹配数据库字段名
    }
    
    // 将配置项转换为API需要的格式
    const keyMapping = {
      'coin_si': 'coin_si',           // 使用@JsonProperty注解指定的名称
      'package_Si': 'package_si',     // 修正为后端实体类中的名称
      'freeX_perUnlock': 'freeX_perUnlock',
      'material': 'material',
      'ok': 'ok',
      'priority_payment': 'priority_payment',
      'x_unlock': 'x_unlock',
      'parm2': 'parm2',
      'free_step_1': 'free_step_1',
      'free_step_2': 'free_step_2',
      'free_step_3': 'free_step_3',
      'free_step_4': 'free_step_4',
      'vip_step_1': 'vip_step_1',
      'vip_step_2': 'vip_step_2',
      'vip_step_3': 'vip_step_3',
      'vip_step_4': 'vip_step_4'
    }
    
    businessTypeConfigs.value.forEach(item => {
      const mappedKey = keyMapping[item.key] || item.key
      businessTypeData[mappedKey] = item.value || ''  // 确保空值传递空字符串
    })
    
    // 根据是否为新建状态选择不同的API端点
    const apiEndpoint = isNewBusinessType.value 
      ? '/api/novel-weiju/deliver/createDeliver' 
      : '/api/novel-weiju/deliver/updateDeliver'
    
    // 发送API请求保存
    const res = await request.post(apiEndpoint, businessTypeData)
    
    if (res.code === 200) {
      if (isNewBusinessType.value) {
        isNewBusinessType.value = false
        if (res.data) {
          if (res.data.deliverId) originalDeliverId.value = res.data.deliverId
          if (res.data.adId) businessTypeAdId.value = res.data.adId
        }
        ElMessage.success('businessType配置创建成功')
      } else {
        ElMessage.success('businessType配置更新成功')
      }
    } else {
      throw new Error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error(error.message || '保存配置失败')
  } finally {
    loadingConfig.value = false
  }
}

// 保存public_switch配置
const handleSavePublicSwitch = async () => {
  if (!selectedApp.value) {
    ElMessage.warning('请先选择一个小程序')
    return
  }
  
  try {
    loadingConfig.value = true
    
    // 准备数据
    const bannerData = {
      bannerId: originalBannerId.value,
      adId: bannerAdId.value
    }

    // 将配置项转换为API需要的格式
    publicSwitchConfigs.value.forEach(item => {
      bannerData[item.key] = item.value || ''  // 确保空值传递空字符串
    })
    
    // 根据是否为新建状态选择不同的API端点
    const apiEndpoint = isNewPublicSwitch.value 
      ? '/api/novel-weiju/banner/createBanner' 
      : '/api/novel-weiju/banner/updateBanner'
    
    // 发送API请求保存
    const res = await request.post(apiEndpoint, bannerData)
    
    if (res.code === 200) {
      if (isNewPublicSwitch.value) {
        isNewPublicSwitch.value = false
        // 如果是新建，更新ID信息
        if (res.data) {
          bannerAdId.value = res.data.adId
          originalBannerId.value = res.data.bannerId
        }
        ElMessage.success('banner配置创建成功')
      } else {
        ElMessage.success('banner配置更新成功')
      }
    } else {
      throw new Error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error(error.message || '保存配置失败')
  } finally {
    loadingConfig.value = false
  }
}

// 将API返回的数据转换为配置项
const convertToConfigItems = (data) => {
  const configItems = []
  const excludeFields = ['adId', 'deliverId', 'createTime', 'updateTime']
  const descriptionMap = {
    'coin_si': '金币配置',
    'package_Si': '套餐配置',
    'freeX_perUnlock': '每次解锁免费次数',
    'material': '素材',
    'ok': '启用状态',
    'priority_payment': '优先支付',
    'x_unlock': 'X解锁',
    'parm2': '参数2',
    'free_step_1': '免费步骤1',
    'free_step_2': '免费步骤2',
    'free_step_3': '免费步骤3',
    'free_step_4': '免费步骤4',
    'vip_step_1': 'VIP步骤1',
    'vip_step_2': 'VIP步骤2',
    'vip_step_3': 'VIP步骤3',
    'vip_step_4': 'VIP步骤4'
  }
  
  // 遍历对象的所有属性
  for (const key in data) {
    if (!excludeFields.includes(key)) {
      let type = 'string'
      let value = data[key]
      
      // 根据值判断类型
      if (value === 'true' || value === 'false') {
        type = 'boolean'
        value = value === 'true'
      } else if (!isNaN(Number(value)) && value !== '') {
        type = 'number'
        value = Number(value)
      }
      
      configItems.push({
        key: key,
        value: value,
        description: descriptionMap[key] || key,
        type: type
      })
    }
  }
  
  return configItems
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
  fetchBusinessTypeConfigs(app.id)
  publicSwitchLoaded.value = false
  businessTypeLoaded.value = false
  
  // 等待DOM更新后滚动到配置区域
  nextTick(() => {
    if (configCard.value) {
      // 使用 scrollIntoView 滚动到配置卡片
      configCard.value.$el.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// 刷新小程序列表
const handleRefresh = () => {
  fetchApps()
}

// 添加删除确认对话框的显示状态
const deleteDialogVisible = ref(false)

// 显示删除确认对话框
const handleDeleteConfirm = () => {
  deleteDialogVisible.value = true
}

// 执行删除操作
const handleDeleteBusinessType = async () => {
  if (!selectedApp.value || !originalDeliverId.value) {
    ElMessage.warning('无效的配置')
    return
  }
  
  try {
    loadingConfig.value = true
    
    // 发送删除请求 - 修改为GET请求和正确的接口地址
    const res = await request.get('/api/novel-weiju/deliver/deleteByDeliverId', {
      params: {
        deliverId: originalDeliverId.value
      }
    })
    
    if (res.code === 200) {
      ElMessage.success('配置删除成功')
      // 清空配置数据
      businessTypeConfigs.value = []
      businessTypeAdId.value = ''
      originalDeliverId.value = ''
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

// 添加banner删除确认对话框的显示状态
const deleteBannerDialogVisible = ref(false)

// 显示banner删除确认对话框
const handleDeleteBannerConfirm = () => {
  deleteBannerDialogVisible.value = true
}

// 执行banner删除操作
const handleDeleteBanner = async () => {
  if (!selectedApp.value || !originalBannerId.value) {
    ElMessage.warning('无效的配置')
    return
  }
  
  try {
    loadingConfig.value = true
    
    // 发送删除请求
    const res = await request.get('/api/novel-weiju/banner/deleteBannerByBannerId', {
      params: {
        bannerId: originalBannerId.value
      }
    })
    
    if (res.code === 200) {
      ElMessage.success('banner配置删除成功')
      // 清空配置数据
      publicSwitchConfigs.value = []
      bannerAdId.value = ''
      originalBannerId.value = ''
      // 关闭确认对话框
      deleteBannerDialogVisible.value = false
      // 重置加载状态
      publicSwitchLoaded.value = false
    } else {
      throw new Error(res.message || '删除失败')
    }
  } catch (error) {
    console.error('删除banner配置失败:', error)
    ElMessage.error(error.message || '删除banner配置失败')
  } finally {
    loadingConfig.value = false
  }
}

// 在<script setup>中添加如下方法：
const handleCopyBusinessTypeConfig = () => {
  try {
    localStorage.setItem('businessTypeConfigCopy', JSON.stringify(businessTypeConfigs.value))
    ElMessage.success('business_type配置已复制')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}
const handlePasteBusinessTypeConfig = () => {
  try {
    const data = localStorage.getItem('businessTypeConfigCopy')
    if (data) {
      businessTypeConfigs.value = JSON.parse(data)
      ElMessage.success('business_type配置已粘贴')
    } else {
      ElMessage.warning('没有可粘贴的配置')
    }
  } catch (e) {
    ElMessage.error('粘贴失败')
  }
}
const handleCopyPublicSwitchConfig = () => {
  try {
    localStorage.setItem('publicSwitchConfigCopy', JSON.stringify(publicSwitchConfigs.value))
    ElMessage.success('public_switch配置已复制')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}
const handlePastePublicSwitchConfig = () => {
  try {
    const data = localStorage.getItem('publicSwitchConfigCopy')
    if (data) {
      publicSwitchConfigs.value = JSON.parse(data)
      ElMessage.success('public_switch配置已粘贴')
    } else {
      ElMessage.warning('没有可粘贴的配置')
    }
  } catch (e) {
    ElMessage.error('粘贴失败')
  }
}

onMounted(() => {
  fetchApps()
})
</script>

<style scoped>
.weiju-config {
  padding: 20px;
}

.header {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}

.app-info {
  margin-bottom: 20px;
  margin-top: 10px;
}

.el-tabs {
  margin-top: 20px;
}

.app-list-card {
  margin-bottom: 20px;
}

.config-card {
  margin-top: 20px;
  scroll-margin-top: 20px; /* 滚动时的上边距 */
}

.ml-2 {
  margin-left: 8px;
}

.empty-config {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}

.config-actions {
  margin-top: 20px;
  text-align: center;
}

.config-actions .el-button + .el-button {
  margin-left: 10px;
}

.config-id-info {
  margin-bottom: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.title-with-tag {
  display: flex;
  align-items: center;
  margin: 0;
}

.platform-tag {
  margin-left: 8px;
}
</style> 