<template>
  <div class="narrow-form-container">
    <h4>步骤3: 配置其他通用信息</h4>
    <el-form :model="form" :rules="formRules" ref="formRef" label-width="120px">
      <el-form-item label="客服URL" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入客服URL" />
      </el-form-item>

      <el-form-item label="支付卡片样式" prop="payCardStyle" class="pay-card-style-item">
        <el-radio-group v-model="form.payCardStyle">
          <el-radio :value="1" label="样式1" />
          <el-radio :value="2" label="样式2" />
          <el-radio :value="3" label="样式3" />
          <el-radio :value="4" label="样式4" />
        </el-radio-group>
        <div v-if="selectedPayCardImage" class="pay-card-image-preview">
          <img :src="selectedPayCardImage" alt="支付卡片样式预览" />
        </div>
      </el-form-item>
      <el-form-item label="首页卡片样式" prop="homeCardStyle">
        <el-select v-model="form.homeCardStyle" placeholder="请选择首页卡片样式" style="width: 100%;">
          <el-option :value="1" label="样式1" />
        </el-select>
      </el-form-item>

      <el-form-item label="构建命令" prop="buildCode">
        <el-input v-model="form.buildCode" placeholder="请输入构建命令（如 npm run build:xxx）" />
      </el-form-item>

      <!-- Conditionally show Douyin field -->
      <template v-if="platform === '抖音'">
        <el-form-item label="抖音IM ID" prop="douyinImId">
          <el-input v-model="form.douyinImId" placeholder="请输入抖音IM ID" />
        </el-form-item>
        <el-form-item label="抖音AppToken" prop="douyinAppToken">
          <el-input
            v-model="form.douyinAppToken"
            type="textarea"
            :rows="6"
            placeholder="请输入抖音AppToken（私钥内容）"
          />
        </el-form-item>
      </template>

      <!-- Conditionally show Weixin fields -->
      <template v-if="platform === '微信'">
        <el-form-item label="微信AppToken" prop="weixinAppToken">
          <el-input
            v-model="form.weixinAppToken"
            type="textarea"
            :rows="6"
            placeholder="请输入微信AppToken（私钥内容）"
          />
        </el-form-item>
      </template>

      <!-- Conditionally show Kuaishou fields -->
      <template v-if="platform === '快手'">
        <el-form-item label="快手Client ID" prop="kuaishouClientId">
          <el-input v-model="form.kuaishouClientId" placeholder="请输入快手Client ID" />
        </el-form-item>
        <el-form-item label="快手Client Secret" prop="kuaishouClientSecret">
          <el-input v-model="form.kuaishouClientSecret" placeholder="请输入快手Client Secret" show-password />
        </el-form-item>
        <el-form-item label="快手AppToken" prop="kuaishouAppToken">
          <el-input
            v-model="form.kuaishouAppToken"
            type="textarea"
            :rows="6"
            placeholder="请输入快手AppToken（私钥内容）"
          />
        </el-form-item>
      </template>

      <el-form-item label="我的页登录类型" class="login-type-item">
        <el-radio-group v-model="form.mineLoginType">
          <el-radio label="anonymousLogin">静默登录</el-radio>
          <el-radio label="phoneLogin">
            手机号授权登录
            <span class="form-tip">无手机号权限的小程序默认使用静默登录</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="阅读页登录类型" class="login-type-item">
        <el-radio-group v-model="form.readerLoginType">
          <el-radio label="anonymousLogin">静默登录</el-radio>
          <el-radio label="phoneLogin">
            手机号授权登录
            <span class="form-tip">无手机号权限的小程序默认使用静默登录</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, toRaw } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  platform: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// 表单数据双向绑定
const form = ref({ ...props.modelValue });

// 监听 props 变化，更新本地表单数据
watch(() => props.modelValue, (newVal) => {
  if (JSON.stringify(toRaw(newVal)) !== JSON.stringify(toRaw(form.value))) {
    form.value = { ...newVal };
  }
}, { deep: true });

// 监听本地表单数据变化，触发更新事件
watch(form, (newVal) => {
  if (JSON.stringify(toRaw(newVal)) !== JSON.stringify(toRaw(props.modelValue))) {
    emit('update:modelValue', { ...newVal });
  }
}, { deep: true });

// 表单校验规则
const formRules = {
  contact: [{ required: true, message: '请输入客服URL', trigger: 'blur' }],
  payCardStyle: [{ required: true, message: '请选择支付卡片样式', trigger: 'change' }],
  homeCardStyle: [{ required: true, message: '请选择首页卡片样式', trigger: 'change' }],
  buildCode: [{ required: true, message: '请输入构建命令', trigger: 'blur' }],
  mineLoginType: [{ required: true, message: '请选择我的页登录类型', trigger: 'change' }],
  readerLoginType: [{ required: true, message: '请选择阅读页登录类型', trigger: 'change' }],
  'douyinImId': [{
    validator: (rule, value, callback) => {
      if (props.platform === '抖音' && !value) {
        callback(new Error('请输入抖音IM ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'kuaishouClientId': [{
    validator: (rule, value, callback) => {
      if (props.platform === '快手' && !value) {
        callback(new Error('请输入快手Client ID'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  'kuaishouClientSecret': [{
    validator: (rule, value, callback) => {
      if (props.platform === '快手' && !value) {
        callback(new Error('请输入快手Client Secret'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }]
};

// 支付卡片样式预览
const selectedPayCardImage = ref('');
watch(() => form.value.payCardStyle, (newVal) => {
  if (newVal) {
    selectedPayCardImage.value = `/images/payStyle/pay_style${newVal}.png`;
  } else {
    selectedPayCardImage.value = ''; // Clear image if no style selected
  }
}, { immediate: true });

// 表单ref和校验暴露
const formRef = ref(null);
const validate = async () => {
  if (!formRef.value) return false;
  return await formRef.value.validate().catch(() => false);
};
defineExpose({ validate });
</script>

<style scoped>
.narrow-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.pay-card-style-item {
  /* Removed display: flex; flex-direction: column; to restore original layout */
}

.pay-card-image-preview {
  margin-top: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.pay-card-image-preview img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.login-type-item {
  margin-bottom: 20px;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}
</style> 