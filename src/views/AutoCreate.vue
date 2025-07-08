<template>
  <div class="auto-create-module">
    <el-card class="workflow-container">
      <template #header>
        <div class="header">
          <h3>创意小程序孵化器 - 创建向导</h3>
        </div>
      </template>
      <div class="workflow-content">
        <CustomSteps :active-step="currentStep" :steps="stepsData" @step-click="handleStepClick" />

        <!-- 步骤内容 -->
        <div class="step-panel">
          <!-- 步骤1: 配置基本信息 -->
          <div v-if="currentStep === 0">
            <AutoCreateStep1
              v-model="basicInfoForm"
              :current-sub-step="currentSubStep"
              @update:current-sub-step="currentSubStep = $event"
              ref="basicInfoStepRef"
            />
          </div>

          <!-- 步骤2: 配置支付，广告信息 -->
          <div v-if="currentStep === 1">
            <AutoCreateStep2
              v-model="step2ConfigForm"
              :platform="basicInfoForm.platform"
              :current-sub-step="currentSubStep"
              @update:current-sub-step="currentSubStep = $event"
              ref="autoCreateStep2Ref"
            />
          </div>

          <!-- 步骤3: 配置其他通用信息 -->
          <div v-if="currentStep === 2">
            <AutoCreateStep3
              v-model="generalConfigForm"
              :platform="basicInfoForm.platform"
              ref="generalConfigFormRef"
            />
          </div>

          <!-- 步骤4: 展示配置数据并确认 -->
          <div v-if="currentStep === 3">
            <AutoCreateStep4
              :basicInfoForm="basicInfoForm"
              :microConfigForm="step2ConfigForm.microConfig"
              :paymentConfigForm="step2ConfigForm.paymentConfig"
              :adConfigForm="step2ConfigForm.adConfig"
              :generalConfigForm="generalConfigForm"
              @reset-wizard="resetWizard"
              ref="autoCreateStep4Ref"
            />
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="step-actions">
          <el-button v-if="currentStep > 0 || currentSubStep > 0 && currentStep !== 3" @click="prevStep">上一步</el-button>
          <el-button v-if="currentStep < 3" type="primary" @click="nextStep">下一步</el-button>
          <el-button v-if="currentStep === 3" type="primary" @click="startGeneration">确认无误，开始生成小程序</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import CustomSteps from '../components/common/CustomSteps.vue'
import AutoCreateStep1 from '../components/autoCreate/AutoCreateStep1.vue'
import AutoCreateStep3 from '../components/autoCreate/AutoCreateStep3.vue'
import AutoCreateStep4 from '../components/autoCreate/AutoCreateStep4.vue'
import AutoCreateStep2 from '../components/autoCreate/AutoCreateStep2.vue'
import { useRouter } from 'vue-router'
import { useAppGenerationStore } from '../stores/appGenerationStore'
import request from '../utils/request'

const router = useRouter()
const currentStep = ref(0)
const currentSubStep = ref(0)
const appGenerationStore = useAppGenerationStore()

// 表单引用
const basicInfoStepRef = ref(null)
const generalConfigFormRef = ref(null)
const autoCreateStep2Ref = ref(null)

// 表单校验规则
const basicInfoFormRules = reactive({
  appName: [{ required: true, message: 'Please input app name', trigger: 'blur' }],
  platform: [{ required: true, message: 'Please select platform', trigger: 'change' }],
  version: [{ required: true, message: 'Please input version', trigger: 'blur' }],
  appCode: [{ required: true, message: 'Please input app code', trigger: 'blur' }],
  product: [{ required: true, message: 'Please input product line', trigger: 'blur' }],
  customer: [{ required: true, message: 'Please input customer identifier', trigger: 'blur' }],
  appid: [{ required: true, message: 'Please input AppID', trigger: 'blur' }],
  token_id: [{ required: true, message: 'Please input Token ID', trigger: 'blur' }],
  cl: [{ required: true, message: 'Please input CL identifier', trigger: 'blur' }],
  mainTheme: [],
  secondTheme: [],
})

const step2ConfigForm = ref({
  microConfig: { deliverId: '', bannerId: '' },
  paymentConfig: {
    normalPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    orderPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    renewPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    douzuanPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    wxVirtualPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
  },
  adConfig: {
    rewardAd: { enabled: false, rewardAdId: '', rewardCount: null },
    interstitialAd: { enabled: false, interstitialAdId: '', interstitialCount: null },
    nativeAd: { enabled: false, nativeAdId: '' },
  },
});

const stepsData = ref([
  {
    title: '基本信息',
    description: '配置小程序名称、简介及主题色'
  },
  {
    title: '微距，支付与广告',
    description: '设置微距，支付和广告相关配置'
  },
  {
    title: '其他通用信息',
    description: '配置其他通用设置'
  },
  {
    title: '展示配置数据并确认',
    description: '核对所有配置数据并完成创建'
  }
]);

const handleStepClick = (index) => {
  currentStep.value = index;
  currentSubStep.value = 0;
}

// 表单数据模型
const basicInfoForm = ref({
  appName: '',
  platform: '',
  version: '',
  appCode: '',
  product: '',
  customer: '',
  appid: '',
  token_id: null,
  cl: '',
  mainTheme: '',
  secondTheme: '',
})

const generalConfigForm = ref({
  contact: '',
  payCardStyle: null,
  homeCardStyle: null,
  buildCode: '',
  mineLoginType: 'anonymousLogin',
  readerLoginType: 'anonymousLogin',
  douyinImId: '',
  douyinAppToken: '',
  weixinAppToken: '',
  kuaishouClientId: '',
  kuaishouClientSecret: '',
  kuaishouAppToken: '',
  iaaMode: false,
})

const resetWizard = () => {
  currentStep.value = 0;
  currentSubStep.value = 0;
  basicInfoStepRef.value?.resetFields();
  autoCreateStep2Ref.value?.resetFields();
  generalConfigFormRef.value?.resetFields();
};

// 导航函数
const nextStep = async () => {
  // 步骤1的校验
  if (currentStep.value === 0) {
    if (currentSubStep.value === 0) {
      const valid = await basicInfoStepRef.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('Please fill in the complete "Basic Info"');
        return;
      }
      currentSubStep.value = 1;
      return;
    } else if (currentSubStep.value === 1) {
      if (!basicInfoForm.value.mainTheme || !basicInfoForm.value.secondTheme) {
        ElMessage.error('还未确定小程序的主题色哦！');
        return;
      }
    }
  } else if (currentStep.value === 1) {
    // 步骤2的子步骤校验
    if (currentSubStep.value === 0) {
      const valid = await autoCreateStep2Ref.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('请填写完整的"微距配置"！');
        return;
      }
      currentSubStep.value++;
      return;
    } else if (currentSubStep.value === 1) {
      const valid = await autoCreateStep2Ref.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('请填写完整的"支付配置"！');
        return;
      }
      
      const hasEnabledPayment = Object.values(step2ConfigForm.value.paymentConfig).some(payment => 
        payment.enabled && 
        ((payment.gatewayAndroid && payment.gatewayIos) || 
         (basicInfoForm.value.platform === '抖音' && payment === step2ConfigForm.value.paymentConfig.douzuanPay) ||
         (basicInfoForm.value.platform === '微信' && payment === step2ConfigForm.value.paymentConfig.wxVirtualPay))
      );
      
      if (!hasEnabledPayment) {
        ElMessage.error('请至少启用并配置一种支付方式！');
        return;
      }
      
      currentSubStep.value++;
      return;
    } else if (currentSubStep.value === 2) {
      const valid = await autoCreateStep2Ref.value.validate().catch(() => false);
      if (!valid) {
        ElMessage.error('请填写完整的"广告配置"！');
        return;
      }
      
      const hasEnabledAd = Object.values(step2ConfigForm.value.adConfig).some(ad => 
        ad.enabled && 
        ((ad.rewardAdId && ad.rewardCount > 0) || 
         (ad.interstitialAdId && ad.interstitialCount > 0) ||
         ad.nativeAdId)
      );
      
      if (!hasEnabledAd) {
        ElMessage.error('请至少启用并配置一种广告类型！');
        return;
      }
    }
  } else if (currentStep.value === 2) {
    const valid = await generalConfigFormRef.value.validate().catch(() => false);
    if (!valid) {
      ElMessage.error('请填写完整的"其他通用信息"！');
      return;
    }
    currentStep.value++;
    currentSubStep.value = 0;
    return;
  }

  if (currentStep.value < stepsData.value.length - 1) {
    currentStep.value++;
    currentSubStep.value = 0;
  }
};

const prevStep = () => {
  if (currentStep.value === 0) {
    if (currentSubStep.value === 1) {
      currentSubStep.value = 0;
      return;
    }
  } else if (currentStep.value === 1) {
    if (currentSubStep.value > 0) {
      currentSubStep.value--;
      return;
    } else if (currentSubStep.value === 0) {
      currentStep.value--;
      currentSubStep.value = 1;
      return;
    }
  } else if (currentStep.value === 2) {
    currentStep.value--;
    currentSubStep.value = 2;
    return;
  } else if (currentStep.value === 3) {
    currentStep.value--;
    currentSubStep.value = 0;
    return;
  }

  if (currentStep.value > 0) {
    currentStep.value--;
    currentSubStep.value = 0;
  }
};

const startGeneration = async () => {
  // 收集所有配置数据
  const params = {
    baseConfig: basicInfoForm.value,
    deliverConfig: step2ConfigForm.value.microConfig,
    paymentConfig: step2ConfigForm.value.paymentConfig,
    adConfig: step2ConfigForm.value.adConfig,
    commonConfig: generalConfigForm.value
  };

  try {
    const res = await request.post('/api/novel-create/createNovelApp', params);
    if (!res || res.code !== 200 || !res.data?.taskId) {
      ElMessage.error(res.message || '创建任务失败');
      return;
    }
    // 将配置数据存储到 Pinia store（如后续页面还需用到）
    // appGenerationStore.setConfigData(configData);
    // 跳转到生成模块，并带上taskId
    router.push({
      name: 'generate-app',
      query: { taskId: res.data.taskId }
    });
  } catch (e) {
    // ElMessage.error(e.message || '请求失败');
  }
};
</script>

<style scoped>
.auto-create-module {
  padding: 20px;
}

.workflow-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.workflow-content {
  padding: 20px;
}

.step-panel {
  padding: 20px 0;
  min-height: 250px;
}

.step-actions {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style> 