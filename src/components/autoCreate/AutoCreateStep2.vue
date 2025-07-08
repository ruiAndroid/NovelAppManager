<template>
  <div>
    <!-- 步骤2.1: 微距配置 -->
    <div v-if="currentSubStep === 0" class="narrow-form-container">
      <h4>步骤2: 微距配置</h4>
      <el-form :model="microConfigForm" :rules="microConfigFormRules" ref="microConfigFormRef" label-width="120px">
        <el-form-item label="deliverId" prop="deliverId">
          <el-input v-model="microConfigForm.deliverId" placeholder="请输入deliverId" />
        </el-form-item>
        <el-form-item label="bannerId" prop="bannerId">
          <el-input v-model="microConfigForm.bannerId" placeholder="请输入bannerId" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 步骤2.2: 支付配置 -->
    <div v-if="currentSubStep === 1" class="wide-form-container">
      <h4>步骤2: 支付配置</h4>
      <el-form :model="paymentConfigForm" :rules="paymentConfigFormRules" ref="paymentConfigFormRef" style="width: 100%;">
        <div class="payment-config-grid">
          <!-- 普通支付配置 -->
          <el-card class="payment-type-card" :body-style="{ padding: '0' }">
            <div class="payment-card-wrapper">
              <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.normalPay.enabled && paymentConfigForm.normalPay.gatewayAndroid && paymentConfigForm.normalPay.gatewayIos }">
                <div class="payment-type-info">
                  <el-icon><Money /></el-icon>
                  <div class="payment-type-title">
                    <h4>普通支付</h4>
                  </div>
                </div>
                <el-tag size="small" :type="paymentConfigForm.normalPay.enabled ? 'success' : 'info'" effect="plain">
                  {{ paymentConfigForm.normalPay.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>

              <div class="payment-card-content">
                <div class="payment-info-list">
                  <div class="payment-info-item">
                    <span class="label">状态</span>
                    <el-switch v-model="paymentConfigForm.normalPay.enabled" />
                  </div>
                  <el-form-item label="网关(A)" prop="normalPay.gatewayAndroid" class="gateway-form-item">
                    <div v-if="paymentConfigForm.normalPay.enabled">
                      <el-input v-model="paymentConfigForm.normalPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                    </div>
                  </el-form-item>
                  <el-form-item label="网关(I)" prop="normalPay.gatewayIos" class="gateway-form-item">
                    <div v-if="paymentConfigForm.normalPay.enabled">
                      <el-input v-model="paymentConfigForm.normalPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 订单支付配置 -->
          <el-card class="payment-type-card" :body-style="{ padding: '0' }">
            <div class="payment-card-wrapper">
              <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.orderPay.enabled && paymentConfigForm.orderPay.gatewayAndroid && paymentConfigForm.orderPay.gatewayIos }">
                <div class="payment-type-info">
                  <el-icon><Goods /></el-icon>
                  <div class="payment-type-title">
                    <h4>通用交易支付</h4>
                  </div>
                </div>
                <el-tag size="small" :type="paymentConfigForm.orderPay.enabled ? 'success' : 'info'" effect="plain">
                  {{ paymentConfigForm.orderPay.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>

              <div class="payment-card-content">
                <div class="payment-info-list">
                  <div class="payment-info-item">
                    <span class="label">状态</span>
                    <el-switch v-model="paymentConfigForm.orderPay.enabled" />
                  </div>
                  <el-form-item label="网关(A)" prop="orderPay.gatewayAndroid" class="gateway-form-item">
                    <div v-if="paymentConfigForm.orderPay.enabled">
                      <el-input v-model="paymentConfigForm.orderPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                    </div>
                  </el-form-item>
                  <el-form-item label="网关(I)" prop="orderPay.gatewayIos" class="gateway-form-item">
                    <div v-if="paymentConfigForm.orderPay.enabled">
                      <el-input v-model="paymentConfigForm.orderPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 连包支付配置 -->
          <el-card class="payment-type-card" :body-style="{ padding: '0' }">
            <div class="payment-card-wrapper">
              <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.renewPay.enabled && paymentConfigForm.renewPay.gatewayAndroid && paymentConfigForm.renewPay.gatewayIos }">
                <div class="payment-type-info">
                  <el-icon><Calendar /></el-icon>
                  <div class="payment-type-title">
                    <h4>连包支付</h4>
                  </div>
                </div>
                <el-tag size="small" :type="paymentConfigForm.renewPay.enabled ? 'success' : 'info'" effect="plain">
                  {{ paymentConfigForm.renewPay.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>

              <div class="payment-card-content">
                <div class="payment-info-list">
                  <div class="payment-info-item">
                    <span class="label">状态</span>
                    <el-switch v-model="paymentConfigForm.renewPay.enabled" />
                  </div>
                  <el-form-item label="网关(A)" prop="renewPay.gatewayAndroid" class="gateway-form-item">
                    <div v-if="paymentConfigForm.renewPay.enabled">
                      <el-input v-model="paymentConfigForm.renewPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                    </div>
                  </el-form-item>
                  <el-form-item label="网关(I)" prop="renewPay.gatewayIos" class="gateway-form-item">
                    <div v-if="paymentConfigForm.renewPay.enabled">
                      <el-input v-model="paymentConfigForm.renewPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 抖钻支付配置 (抖音平台特有) -->
          <template v-if="platform === 'douyin'">
            <el-card class="payment-type-card" :body-style="{ padding: '0' }">
              <div class="payment-card-wrapper">
                <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.douzuanPay.enabled && paymentConfigForm.douzuanPay.gatewayAndroid && paymentConfigForm.douzuanPay.gatewayIos }">
                  <div class="payment-type-info">
                    <el-icon><Star /></el-icon>
                    <div class="payment-type-title">
                      <h4>抖钻支付</h4>
                    </div>
                  </div>
                  <el-tag size="small" :type="paymentConfigForm.douzuanPay.enabled ? 'success' : 'info'" effect="plain">
                    {{ paymentConfigForm.douzuanPay.enabled ? '已启用' : '未启用' }}
                  </el-tag>
                </div>

                <div class="payment-card-content">
                  <div class="payment-info-list">
                    <div class="payment-info-item">
                      <span class="label">状态</span>
                      <el-switch v-model="paymentConfigForm.douzuanPay.enabled" />
                    </div>
                    <el-form-item label="网关(A)" prop="douzuanPay.gatewayAndroid" class="gateway-form-item">
                      <div v-if="paymentConfigForm.douzuanPay.enabled">
                        <el-input v-model="paymentConfigForm.douzuanPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                      </div>
                    </el-form-item>
                    <el-form-item label="网关(I)" prop="douzuanPay.gatewayIos" class="gateway-form-item">
                      <div v-if="paymentConfigForm.douzuanPay.enabled">
                        <el-input v-model="paymentConfigForm.douzuanPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-card>
          </template>

          <!-- 微信虚拟支付配置 (微信平台特有) -->
          <template v-if="platform === 'weixin'">
            <el-card class="payment-type-card" :body-style="{ padding: '0' }">
              <div class="payment-card-wrapper">
                <div class="payment-card-header" :class="{ 'configured': paymentConfigForm.wxVirtualPay.enabled && paymentConfigForm.wxVirtualPay.gatewayAndroid && paymentConfigForm.wxVirtualPay.gatewayIos }">
                  <div class="payment-type-info">
                    <el-icon><Wallet /></el-icon>
                    <div class="payment-type-title">
                      <h4>微信虚拟支付</h4>
                    </div>
                  </div>
                  <el-tag size="small" :type="paymentConfigForm.wxVirtualPay.enabled ? 'success' : 'info'" effect="plain">
                    {{ paymentConfigForm.wxVirtualPay.enabled ? '已启用' : '未启用' }}
                  </el-tag>
                </div>

                <div class="payment-card-content">
                  <div class="payment-info-list">
                    <div v-if="paymentConfigForm.wxVirtualPay.enabled">
                      <el-input v-model="paymentConfigForm.wxVirtualPay.gatewayAndroid" placeholder="请输入网关 (Android)" />
                    </div>
                    <el-form-item label="网关(A)" prop="wxVirtualPay.gatewayAndroid" class="gateway-form-item">
                    </el-form-item>
                    <el-form-item label="网关(I)" prop="wxVirtualPay.gatewayIos" class="gateway-form-item">
                      <div v-if="paymentConfigForm.wxVirtualPay.enabled">
                        <el-input v-model="paymentConfigForm.wxVirtualPay.gatewayIos" placeholder="请输入网关 (iOS)" />
                      </div>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </el-card>
          </template>
        </div>
      </el-form>
    </div>

    <!-- 步骤2.3: 广告配置 -->
    <div v-if="currentSubStep === 2" class="wide-form-container">
      <h4>步骤2: 广告配置</h4>
      <el-form :model="adConfigForm" :rules="adConfigFormRules" ref="adConfigFormRef" style="width: 100%;">
        <div class="payment-config-grid">
          <!-- 激励广告配置 -->
          <el-card class="payment-type-card" :body-style="{ padding: '0' }">
            <div class="payment-card-wrapper">
              <div class="payment-card-header" :class="{ 'configured': adConfigForm.rewardAd.enabled && adConfigForm.rewardAd.rewardAdId && adConfigForm.rewardAd.rewardCount > 0 }">
                <div class="payment-type-info">
                  <el-icon><VideoPlay /></el-icon>
                  <div class="payment-type-title">
                    <h4>激励广告</h4>
                  </div>
                </div>
                <el-tag size="small" :type="adConfigForm.rewardAd.enabled ? 'success' : 'info'" effect="plain">
                  {{ adConfigForm.rewardAd.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>

              <div class="payment-card-content">
                <div class="payment-info-list">
                  <div class="payment-info-item">
                    <span class="label">状态</span>
                    <el-switch v-model="adConfigForm.rewardAd.enabled" />
                  </div>
                  <el-form-item label="广告位ID" prop="rewardAd.rewardAdId" class="gateway-form-item">
                    <div v-if="adConfigForm.rewardAd.enabled">
                      <el-input v-model="adConfigForm.rewardAd.rewardAdId" placeholder="请输入激励广告ID" />
                    </div>
                  </el-form-item>
                  <el-form-item label="激励次数" prop="rewardAd.rewardCount" class="gateway-form-item">
                    <div v-if="adConfigForm.rewardAd.enabled">
                      <el-input-number v-model="adConfigForm.rewardAd.rewardCount" :min="1" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 插屏广告配置 -->
          <el-card class="payment-type-card" :body-style="{ padding: '0' }">
            <div class="payment-card-wrapper">
              <div class="payment-card-header" :class="{ 'configured': adConfigForm.interstitialAd.enabled && adConfigForm.interstitialAd.interstitialAdId && adConfigForm.interstitialAd.interstitialCount > 0 }">
                <div class="payment-type-info">
                  <el-icon><Picture /></el-icon>
                  <div class="payment-type-title">
                    <h4>插屏广告</h4>
                  </div>
                </div>
                <el-tag size="small" :type="adConfigForm.interstitialAd.enabled ? 'success' : 'info'" effect="plain">
                  {{ adConfigForm.interstitialAd.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>

              <div class="payment-card-content">
                <div class="payment-info-list">
                  <div class="payment-info-item">
                    <span class="label">状态</span>
                    <el-switch v-model="adConfigForm.interstitialAd.enabled" />
                  </div>
                  <el-form-item label="广告位ID" prop="interstitialAd.interstitialAdId" class="gateway-form-item">
                    <div v-if="adConfigForm.interstitialAd.enabled">
                      <el-input v-model="adConfigForm.interstitialAd.interstitialAdId" placeholder="请输入插屏广告ID" />
                    </div>
                  </el-form-item>
                  <el-form-item label="展示次数" prop="interstitialAd.interstitialCount" class="gateway-form-item">
                    <div v-if="adConfigForm.interstitialAd.enabled">
                      <el-input-number v-model="adConfigForm.interstitialAd.interstitialCount" :min="1" style="width: 100%;" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 信息流广告配置 -->
          <el-card class="payment-type-card" :body-style="{ padding: '0' }">
            <div class="payment-card-wrapper">
              <div class="payment-card-header" :class="{ 'configured': adConfigForm.nativeAd.enabled && adConfigForm.nativeAd.nativeAdId }">
                <div class="payment-type-info">
                  <el-icon><Document /></el-icon>
                  <div class="payment-type-title">
                    <h4>信息流广告</h4>
                  </div>
                </div>
                <el-tag size="small" :type="adConfigForm.nativeAd.enabled ? 'success' : 'info'" effect="plain">
                  {{ adConfigForm.nativeAd.enabled ? '已启用' : '未启用' }}
                </el-tag>
              </div>

              <div class="payment-card-content">
                <div class="payment-info-list">
                  <div class="payment-info-item">
                    <span class="label">状态</span>
                    <el-switch v-model="adConfigForm.nativeAd.enabled" />
                  </div>
                  <el-form-item label="广告位ID" prop="nativeAd.nativeAdId" class="gateway-form-item">
                    <div v-if="adConfigForm.nativeAd.enabled">
                      <el-input v-model="adConfigForm.nativeAd.nativeAdId" placeholder="请输入信息流广告ID" />
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, toRaw, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Money, Goods, Calendar, Star, Wallet, VideoPlay, Picture, Document } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
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
    })
  },
  platform: {
    type: String,
    default: ''
  },
  currentSubStep: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'update:currentSubStep'])

// Internal reactive forms, initialized from modelValue
const microConfigForm = reactive({ ...toRaw(props.modelValue.microConfig) })
const paymentConfigForm = reactive({ ...toRaw(props.modelValue.paymentConfig) })
const adConfigForm = reactive({ ...toRaw(props.modelValue.adConfig) })

// Form refs
const microConfigFormRef = ref(null)
const paymentConfigFormRef = ref(null)
const adConfigFormRef = ref(null)

// Form validation rules
const microConfigFormRules = reactive({
  deliverId: [{ required: true, message: '请输入deliverId', trigger: 'blur' }],
  bannerId: [{ required: true, message: '请输入bannerId', trigger: 'blur' }],
})

const paymentConfigFormRules = reactive({
  'normalPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.normalPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'normalPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.normalPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'orderPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.orderPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'orderPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.orderPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'renewPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.renewPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'renewPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (paymentConfigForm.renewPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'douzuanPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (props.platform === 'douyin' && paymentConfigForm.douzuanPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'douzuanPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (props.platform === 'douyin' && paymentConfigForm.douzuanPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'wxVirtualPay.gatewayAndroid': [{
    validator: (rule, value, callback) => {
      if (props.platform === 'weixin' && paymentConfigForm.wxVirtualPay.enabled && !value) {
        callback(new Error('请输入网关 (Android)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'wxVirtualPay.gatewayIos': [{
    validator: (rule, value, callback) => {
      if (props.platform === 'weixin' && paymentConfigForm.wxVirtualPay.enabled && !value) {
        callback(new Error('请输入网关 (iOS)'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
})

const adConfigFormRules = reactive({
  'rewardAd.rewardAdId': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.rewardAd.enabled && !value) {
        callback(new Error('请输入激励广告ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'rewardAd.rewardCount': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.rewardAd.enabled) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue <= 0) {
          callback(new Error('请输入有效激励次数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'interstitialAd.interstitialAdId': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.interstitialAd.enabled && !value) {
        callback(new Error('请输入插屏广告ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'interstitialAd.interstitialCount': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.interstitialAd.enabled && (!value || value <= 0)) {
        callback(new Error('请输入有效展示次数'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'nativeAd.nativeAdId': [{
    validator: (rule, value, callback) => {
      if (adConfigForm.nativeAd.enabled && !value) {
        callback(new Error('请输入信息流广告ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
})

// Watchers to update internal forms when modelValue changes
watch(() => props.modelValue.microConfig, (newVal) => {
  console.log('AutoCreateStep2.vue - modelValue.microConfig changed:', toRaw(newVal));
  if (JSON.stringify(toRaw(newVal)) !== JSON.stringify(toRaw(microConfigForm))) {
    Object.assign(microConfigForm, toRaw(newVal));
  }
}, { deep: true });

watch(() => props.modelValue.paymentConfig, (newVal) => {
  console.log('AutoCreateStep2.vue - modelValue.paymentConfig changed:', toRaw(newVal));
  if (JSON.stringify(toRaw(newVal)) !== JSON.stringify(toRaw(paymentConfigForm))) {
    Object.assign(paymentConfigForm, toRaw(newVal));
  }
}, { deep: true });

watch(() => props.modelValue.adConfig, (newVal) => {
  console.log('AutoCreateStep2.vue - modelValue.adConfig changed:', toRaw(newVal));
  if (JSON.stringify(toRaw(newVal)) !== JSON.stringify(toRaw(adConfigForm))) {
    Object.assign(adConfigForm, toRaw(newVal));
  }
}, { deep: true });

// Watchers to emit updates when internal forms change
watch([microConfigForm, paymentConfigForm, adConfigForm], ([newMicro, newPayment, newAd]) => {
  const newCombined = {
    microConfig: toRaw(newMicro),
    paymentConfig: toRaw(newPayment),
    adConfig: toRaw(newAd),
  };
  console.log('AutoCreateStep2.vue - Emitting update:modelValue with:', newCombined);
  if (JSON.stringify(newCombined) !== JSON.stringify(toRaw(props.modelValue))) {
    emit('update:modelValue', newCombined);
  }
}, { deep: true });

// Expose validate function
const validate = async () => {
  let valid = false;
  if (props.currentSubStep === 0) {
    valid = await microConfigFormRef.value.validate().catch(() => false);
    if (!valid) {
      ElMessage.error('请填写完整的"微距配置"！');
      return false;
    }
  } else if (props.currentSubStep === 1) {
    valid = await paymentConfigFormRef.value.validate().catch(() => false);
    if (!valid) {
      ElMessage.error('请填写完整的"支付配置"！');
      return false;
    }
    const hasEnabledPayment = Object.values(paymentConfigForm).some(payment =>
      payment.enabled &&
      ((payment.gatewayAndroid && payment.gatewayIos) ||
       (props.platform === 'douyin' && payment === paymentConfigForm.douzuanPay) ||
       (props.platform === 'weixin' && payment === paymentConfigForm.wxVirtualPay))
    );
    if (!hasEnabledPayment) {
      ElMessage.error('请至少启用并配置一种支付方式！');
      return false;
    }
  } else if (props.currentSubStep === 2) {
    valid = await adConfigFormRef.value.validate().catch(() => false);
    if (!valid) {
      ElMessage.error('请填写完整的"广告配置"！');
      return false;
    }
    const hasEnabledAd = Object.values(adConfigForm).some(ad =>
      ad.enabled &&
      ((ad.rewardAdId && ad.rewardCount > 0) ||
       (ad.interstitialAdId && ad.interstitialCount > 0) ||
       ad.nativeAdId)
    );
    if (!hasEnabledAd) {
      ElMessage.error('请至少启用并配置一种广告类型！');
      return false;
    }
  }
  return valid;
}

const resetFields = () => {
  microConfigFormRef.value?.resetFields();
  paymentConfigFormRef.value?.resetFields();
  adConfigFormRef.value?.resetFields();
  Object.assign(microConfigForm, { deliverId: '', bannerId: '' });
  Object.assign(paymentConfigForm, {
    normalPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    orderPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    renewPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    douzuanPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
    wxVirtualPay: { enabled: false, gatewayAndroid: '', gatewayIos: '' },
  });
  Object.assign(adConfigForm, {
    rewardAd: { enabled: false, rewardAdId: '', rewardCount: null },
    interstitialAd: { enabled: false, interstitialAdId: '', interstitialCount: null },
    nativeAd: { enabled: false, nativeAdId: '' },
  });
};

defineExpose({
  validate,
  resetFields,
});

</script>

<style scoped>
.narrow-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.wide-form-container {
  max-width: 1000px; /* Adjust this value as needed, larger than 600px */
  margin: 0 auto;
}

h4 {
  margin-bottom: 20px;
  text-align: left; /* Align title to left within its column */
  color: #303133;
}

/* New styles for payment configuration */
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
  display: flex;
  flex-direction: column;
}

.payment-card-content {
  padding: 20px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 0; /* Managed by .payment-info-list now */
}

.payment-card-content :deep(.el-form-item) {
  margin-bottom: 22px; /* Restore default margin */
  padding: 0;
  display: block; /* Restore default block display */
}

.payment-card-content :deep(.el-form-item__label) {
  display: flex; /* Restore default label display */
  text-align: right;
  vertical-align: middle;
  font-size: var(--el-form-label-font-size, inherit);
  color: var(--el-text-color-regular);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}

.payment-card-content :deep(.el-form-item__content) {
  line-height: 32px;
  position: relative;
  font-size: 14px;
  display: flex; /* Restore default content display */
  align-items: center;
}

.payment-card-content :deep(.el-input) {
  width: 100%; /* Default width for el-input in form item */
}

.payment-card-content :deep(.el-input .el-input__inner) {
  text-align: left; /* Changed from right to left */
  color: #303133; /* Keep color to match Payment.vue value */
  font-weight: 500; /* Keep font weight to match Payment.vue value */
  font-size: 14px; /* Keep font size to match Payment.vue value */
}

.payment-card-content :deep(.el-switch) {
  width: auto; /* Ensure it doesn't take up too much space */
  flex-shrink: 0; /* Prevent switch from shrinking */
  height: auto; /* Let element-plus handle height */
  line-height: normal; /* Let element-plus handle line-height */
  display: flex; /* Ensure flex context for alignment */
  align-items: center; /* Center vertically */
}

/* Styles for payment-info-list and payment-info-item from Payment.vue */
.payment-info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%; /* Ensure it takes full width of card content */
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.payment-card-header :deep(.el-tag.el-tag--success.el-tag--plain) {
  background-color: var(--el-tag-bg-color, var(--el-fill-color-light));
  border-color: var(--el-tag-border-color, var(--el-border-color-light));
  color: var(--el-tag-text-color, var(--el-color-success));
}

.payment-type-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-type-info .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
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

/* Styles for el-form-item to mimic payment-info-item for gateway inputs */
.gateway-form-item {
  display: flex !important; /* Override default el-form-item display */
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 0 !important; /* Remove default margin-bottom */
}

.gateway-form-item :deep(.el-form-item__label) {
  flex-shrink: 0;
  text-align: left !important; /* Ensure label is left-aligned */
  color: #909399;
  font-size: 14px;
  padding: 0 !important; /* Remove default padding */
  margin-right: 12px; /* Add some spacing between label and input */
  line-height: var(--el-input-height, 32px); /* Match input height */
}

.gateway-form-item :deep(.el-form-item__content) {
  flex-grow: 1; /* Allow content to take remaining space */
  display: flex; /* Make content a flex container to align its children (input) */
  justify-content: flex-start; /* Align content to the start (left) */
  align-items: center; /* Vertically align */
  margin-left: 0 !important; /* Remove default margin-left */
  line-height: var(--el-input-height, 32px); /* Match input height */
}

/* Specific style for el-input-number's inner input to ensure text is visible */
.gateway-form-item .el-input-number {
  flex-grow: 1; /* Ensure el-input-number takes available space */
  width: auto !important; /* Override explicit width to allow flex-grow */
  flex-shrink: 0 !important; /* Prevent el-input-number from shrinking */
  min-width: 100px !important; /* Ensure a minimum width for visibility */
}

.gateway-form-item .el-input-number :deep(.el-input__inner) {
  text-align: left !important;
  color: #303133;
  font-weight: 500;
  font-size: 14px;
  overflow: visible !important;
}

.gateway-form-item .el-input-number :deep(.el-input) {
  width: 100% !important;
}

.gateway-form-item .el-input-number :deep(.el-input__wrapper) {
  overflow: visible !important;
}

.reward-input-wrapper {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.reward-input-wrapper .el-input-number {
  flex-grow: 1;
  width: auto !important;
}

.reward-input-wrapper .el-input-number :deep(.el-input__inner) {
  text-align: left !important;
  color: #303133;
  font-weight: 500;
  font-size: 14px;
  overflow: visible !important;
}

.reward-input-wrapper .el-input-number :deep(.el-input__wrapper) {
  overflow: visible !important;
}

.reward-input-wrapper .el-input-number :deep(.el-input) {
  width: 100% !important;
}
</style> 